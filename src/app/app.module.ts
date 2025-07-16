import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';

import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { CronJobService } from '@/cron/cron-job.service';
import { JobOfferModule } from './jobOffer/jobOffer.module';
import { AppConfigModule } from '@/config/config.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        AppConfigModule,
        HealthModule,
        JobOfferModule,
        ScheduleModule.forRoot(),
        HttpModule
        //add more...
    ],
    providers: [CronJobService]
})
export class AppModule {}
