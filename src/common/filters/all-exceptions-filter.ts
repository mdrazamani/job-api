import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

import { CustomError } from '@/utils/error-handler';
import { CustomHttpExceptionError, UnknownServerError } from '@/utils/error-handler';
import { Logger } from '../logging/logger';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger('AllExceptionsFilter');

    async catch(exception: unknown, host: ArgumentsHost): Promise<void> {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const traceId = this.getHeader(request, 'x-trace-id') || '';
        const ip = this.getHeader(request, 'x-ip');

        let customError: CustomError;

        if (exception instanceof CustomError) {
            customError = exception;
        } else if (exception instanceof HttpException) {
            const statusCode = exception.getStatus();
            const res = exception.getResponse();

            const message = typeof res === 'string' ? res : (res as any).message || 'Internal server error';

            const errMessage = typeof message === 'string' ? message : message?.[0] || 'Internal error';

            customError = new CustomHttpExceptionError(errMessage, statusCode, traceId);
        } else {
            customError = new UnknownServerError(exception as Error, traceId);
        }

        const serialized = customError.serializeErrors();

        this.logger.error(serialized.message, {
            ctx: { traceId, ip },
            errorStack: serialized.errorStack
        });

        response.status(serialized.statusCode).json(serialized);
    }

    private getHeader(req: Request, key: string): string | null {
        const val = req.headers[key];
        return Array.isArray(val) ? val[0] : val || null;
    }
}
