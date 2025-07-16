import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/config.module';
import { AppModule } from './app/app.module';
import { DatabaseModule } from './database/database.module';
import { CommonModule } from './common/common.module';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule, ThrottlerOptions } from '@nestjs/throttler';

const throttlerOptions: ThrottlerOptions = {
    ttl: 900,
    limit: 100
};

@Module({
    imports: [
        AppConfigModule,
        ThrottlerModule.forRoot({
            throttlers: [throttlerOptions]
        }),
        DatabaseModule,
        CommonModule,
        AppModule
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard
        }
    ]
})
export class MainModule {}
