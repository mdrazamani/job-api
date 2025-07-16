import { LoggerService } from '@nestjs/common';

export class Logger implements LoggerService {
    private context: string;

    constructor(context = 'AppLogger') {
        this.context = context;
    }

    log(message: string, meta: Record<string, any> = {}) {
        console.log(this.format('LOG', message, meta));
    }

    warn(message: string, meta: Record<string, any> = {}) {
        console.warn(this.format('WARN', message, meta));
    }

    error(message: string, meta: Record<string, any> = {}, trace?: string) {
        console.error(this.format('ERROR', message, { ...meta, trace }));
    }

    debug(message: string, meta: Record<string, any> = {}) {
        if (process.env.NODE_ENV !== 'production') {
            console.debug(this.format('DEBUG', message, meta));
        }
    }

    verbose(message: string, meta: Record<string, any> = {}) {
        if (process.env.NODE_ENV !== 'production') {
            console.info(this.format('VERBOSE', message, meta));
        }
    }

    // Utility: Logging route info
    logRoute(request: any, response: any, extra: Record<string, any> = {}) {
        const { method, url, headers, body, query } = request;
        const statusCode = response?.statusCode || 200;

        const logMeta = {
            method,
            url,
            statusCode,
            traceId: headers['x-trace-id'] || null,
            query,
            body,
            ...extra
        };

        this.log(`[${method}] ${url} - ${statusCode}`, logMeta);
    }

    private format(level: string, message: string, meta: Record<string, any>) {
        const timestamp = new Date().toISOString();
        const traceId = meta?.ctx?.traceId || meta?.traceId || null;

        return JSON.stringify({
            timestamp,
            level,
            context: this.context,
            message,
            traceId,
            ...meta
        });
    }
}
