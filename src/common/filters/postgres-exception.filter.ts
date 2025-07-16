import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { Response, Request } from 'express';
import { BadRequestError, ServerError } from '@/utils/error-handler';

@Catch(QueryFailedError)
export class PostgresExceptionFilter implements ExceptionFilter {
    catch(exception: QueryFailedError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const traceId = this.getTraceId(request.headers);

        const error: any = exception;

        let errorToThrow;

        switch (error.code) {
            case '23505': {
                // unique violation
                const msg = this.extractDuplicateMessage(error.detail);
                errorToThrow = new BadRequestError(msg, 'Postgres', {
                    traceId,
                    constraint: error.constraint
                });
                break;
            }

            case '23502': {
                // not_null_violation
                errorToThrow = new BadRequestError(`Field '${error.column}' must not be null`, 'Postgres', {
                    traceId,
                    column: error.column
                });
                break;
            }

            case '23503': {
                // foreign_key_violation
                errorToThrow = new BadRequestError(`Foreign key violation on '${error.column}'`, 'Postgres', {
                    traceId,
                    column: error.column,
                    table: error.table
                });
                break;
            }

            default: {
                // unexpected DB error
                errorToThrow = new ServerError('Unexpected database error', 'Postgres', {
                    traceId,
                    dbCode: error.code,
                    dbMessage: error.message
                });
            }
        }

        response.status(errorToThrow.statusCode).json(errorToThrow.serializeErrors());
    }

    private extractDuplicateMessage(detail: string): string {
        const match = detail.match(/\((.*?)\)=\((.*?)\)/);
        if (match) {
            return `Duplicate value for '${match[1]}': '${match[2]}' already exists.`;
        }
        return 'Duplicate value error';
    }

    private getTraceId(headers: Record<string, any>): string | null {
        const traceId = headers['x-trace-id'];
        return Array.isArray(traceId) ? traceId[0] : traceId || null;
    }
}
