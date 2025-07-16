import { Injectable, OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { AppConfigService } from '@/config/config.service';
import { JobOfferService } from '@/app/jobOffer/services/job-offer.service';
import { Provider1Service } from '@/app/jobOffer/providers/provider1.service';
import { Provider2Service } from '@/app/jobOffer/providers/provider2.service';
import { Logger } from '@/common/logging/logger';

@Injectable()
export class CronJobService implements OnModuleInit {
    private readonly logger = new Logger('CronJobService');

    constructor(
        private readonly config: AppConfigService,
        private readonly schedulerRegistry: SchedulerRegistry,
        private readonly jobOfferService: JobOfferService,
        private readonly provider1Service: Provider1Service,
        private readonly provider2Service: Provider2Service
    ) {}

    onModuleInit() {
        const schedule = this.config.cronSchedule || '*/5 * * * *';
        const job = new CronJob(schedule, () => this.handleFetchJobs());

        this.schedulerRegistry.addCronJob('fetch-job-offers', job);
        job.start();

        this.logger.log(`🕒 CronJob registered with schedule: "${schedule}"`);
    }

    private async handleFetchJobs() {
        this.logger.log(`🔄 Cron job started`);

        try {
            const [jobs1, jobs2] = await Promise.all([this.provider1Service.fetchJobs(), this.provider2Service.fetchJobs()]);

            const allJobs = [...jobs1, ...jobs2];
            let inserted = 0;

            for (const job of allJobs) {
                if (!job.externalId || !job.title || !job.location || !job.company) {
                    this.logger.warn('⚠️ Skipping invalid job', { job });
                    continue;
                }

                await this.jobOfferService.createOrUpdate(job);
                inserted++;
            }

            this.logger.log(`✅ Synced ${inserted} valid job offers out of ${allJobs.length}`);
        } catch (err) {
            this.logger.error('❌ Cron job failed', {}, err.stack);
        }
    }
}
