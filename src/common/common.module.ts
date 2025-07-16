import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { GlobalInterceptor } from './interceptors/global.interceptor';
import { PostgresExceptionFilter } from './filters/postgres-exception.filter';
import { AllExceptionsFilter } from './filters/all-exceptions-filter';

@Module({
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: GlobalInterceptor
        },
        {
            provide: APP_FILTER,
            useClass: AllExceptionsFilter
        },
        {
            provide: APP_FILTER,
            useClass: PostgresExceptionFilter
        }
    ]
})
export class CommonModule {}
