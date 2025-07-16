import { HttpStatus } from '@nestjs/common';

// Interface for defining the structure of main errors
export interface IError {
    message: string;
    statusCode: number;
    status: string;
    comingFrom: string;
    errors?: { field?: string; message: string }[];
    errorStack?: string;
    additionalInfo?: Record<string, any>;
}

// Main class for defining custom errors
export abstract class CustomError extends Error {
    abstract statusCode: number;
    abstract status: string;
    comingFrom: string;
    errors?: { message: string; field?: string }[];
    errorStack?: string;
    additionalInfo?: Record<string, any>;

    constructor(message: string, comingFrom: string, errors?: { message: string; field?: string }[], additionalInfo?: Record<string, any>) {
        super(message);
        this.comingFrom = comingFrom;
        this.errors = errors;
        this.errorStack = this.stack;
        this.additionalInfo = {
            timestamp: new Date().toISOString(),
            ...additionalInfo
        };
        Object.setPrototypeOf(this, CustomError.prototype);
    }

    serializeErrors(): IError {
        return {
            message: this.message,
            statusCode: this.statusCode,
            status: this.status,
            comingFrom: this.comingFrom,
            errors: this.errors,
            errorStack: this.errorStack,
            additionalInfo: this.additionalInfo
        };
    }
}

// Definition of BadRequestError
export class BadRequestError extends CustomError {
    statusCode = HttpStatus.BAD_REQUEST;
    status = 'BadRequestError';

    constructor(message: string, comingFrom: string = 'app', additionalInfo?: Record<string, any>) {
        super(message, comingFrom, undefined, additionalInfo);
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
}

// Definition of RequestValidationError
export class RequestValidationError extends CustomError {
    statusCode = HttpStatus.BAD_REQUEST;
    status = 'RequestValidationError';

    constructor(errors: { message: string; field?: string }[], additionalInfo?: Record<string, any>) {
        super('Validation Error', 'ValidationError', errors, additionalInfo);
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }
}

// Definition of ForbiddenError
export class ForbiddenError extends CustomError {
    statusCode = HttpStatus.FORBIDDEN;
    status = 'ForbiddenError';

    constructor(message: string, comingFrom: string, additionalInfo?: Record<string, any>) {
        super(message, comingFrom, undefined, additionalInfo);
        Object.setPrototypeOf(this, ForbiddenError.prototype);
    }
}

// Definition of NotFoundError
export class NotFoundError extends CustomError {
    statusCode = HttpStatus.NOT_FOUND;
    status = 'NotFoundError';

    constructor(message: string, comingFrom: string, additionalInfo?: Record<string, any>) {
        super(message, comingFrom, undefined, additionalInfo);
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}

// Definition of NotAuthorizedError
export class NotAuthorizedError extends CustomError {
    statusCode = HttpStatus.UNAUTHORIZED;
    status = 'NotAuthorizedError';

    constructor(message: string, comingFrom: string, additionalInfo?: Record<string, any>) {
        super(message, comingFrom, undefined, additionalInfo);
        Object.setPrototypeOf(this, NotAuthorizedError.prototype);
    }
}

// Definition of FileTooLargeError
export class FileTooLargeError extends CustomError {
    statusCode = HttpStatus.PAYLOAD_TOO_LARGE;
    status = 'FileTooLargeError';

    constructor(message: string, comingFrom: string, additionalInfo?: Record<string, any>) {
        super(message, comingFrom, undefined, additionalInfo);
        Object.setPrototypeOf(this, FileTooLargeError.prototype);
    }
}

// Definition of ServerError
export class ServerError extends CustomError {
    statusCode = HttpStatus.SERVICE_UNAVAILABLE;
    status = 'ServerError';

    constructor(message: string, comingFrom: string, additionalInfo?: Record<string, any>) {
        super(message, comingFrom, undefined, additionalInfo);
        Object.setPrototypeOf(this, ServerError.prototype);
    }
}

// Interface for handling system errors
export interface ErrnoException extends Error {
    errno?: number;
    code?: string;
    path?: string;
    syscall?: string;
    stack?: string;
}

export class CustomHttpExceptionError extends CustomError {
    statusCode: number;
    status = 'HttpException';

    constructor(message: string, statusCode: number, traceId?: string) {
        super(message, 'Nest', undefined, { traceId });
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, CustomHttpExceptionError.prototype);
    }
}

export class UnknownServerError extends CustomError {
    statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    status = 'UnknownError';

    constructor(exception: Error, traceId?: string) {
        super('Unexpected internal error', 'Unknown', undefined, {
            traceId,
            originalMessage: exception.message,
            errorStack: exception.stack
        });
        Object.setPrototypeOf(this, UnknownServerError.prototype);
    }
}
