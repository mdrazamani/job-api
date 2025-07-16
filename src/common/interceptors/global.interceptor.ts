import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Logger } from '../logging/logger';

@Injectable()
export class GlobalInterceptor implements NestInterceptor {
    private readonly logger = new Logger('ROUTE');

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();

        const traceId = this.getHeader(request, 'x-trace-id');
        const ip = this.getHeader(request, 'x-ip');
        const method = request.method;
        const url = request.originalUrl;
        const startTime = Date.now();

        return next.handle().pipe(
            map((result) => {
                const page = Number(request.query.page) || 1;
                const limit = Number(request.query.limit) || 10;

                const isPaginated = result?.data && Array.isArray(result.data) && typeof result.total === 'number';

                const pagination = isPaginated
                    ? {
                          currentPage: page,
                          perPage: limit,
                          total: result.total,
                          lastPage: Math.ceil(result.total / limit)
                      }
                    : undefined;

                return {
                    message: 'Request successful',
                    statusCode: response.statusCode,
                    data: isPaginated ? result.data : result,
                    meta: {
                        ...(pagination ? { pagination } : {}),
                        traceId,
                        ip,
                        method,
                        url,
                        duration: Date.now() - startTime,
                        timestamp: new Date().toISOString()
                    }
                };
            }),
            tap((finalResponse) => {
                if (traceId) response.setHeader('x-trace-id', traceId);
                if (ip) response.setHeader('x-ip', ip);

                this.logger.log(`${method} ${url}`, {
                    traceId,
                    ip,
                    statusCode: response.statusCode,
                    duration: finalResponse.meta?.duration
                });
            })
        );
    }

    private getHeader(req: Request, key: string): string | null {
        const val = req.headers[key];
        return Array.isArray(val) ? val[0] : val || null;
    }
}
