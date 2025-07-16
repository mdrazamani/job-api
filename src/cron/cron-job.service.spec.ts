import { Test, TestingModule } from '@nestjs/testing';
import { CronJobService } from './cron-job.service';
import { SchedulerRegistry } from '@nestjs/schedule';
import { JobOfferService } from '@/app/jobOffer/services/job-offer.service';
import { Provider1Service } from '@/app/jobOffer/providers/provider1.service';
import { Provider2Service } from '@/app/jobOffer/providers/provider2.service';
import { AppConfigService } from '@/config/config.service';

describe('CronJobService', () => {
    let service: CronJobService;

    const mockJobs = [{ externalId: '1', title: 'Dev', location: 'NY', company: 'X', provider: 'provider1' }];

    const mockJobOfferService = {
        createOrUpdate: jest.fn()
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CronJobService,
                { provide: SchedulerRegistry, useValue: { addCronJob: jest.fn() } },
                { provide: AppConfigService, useValue: { cronSchedule: '* * * * *' } },
                { provide: JobOfferService, useValue: mockJobOfferService },
                {
                    provide: Provider1Service,
                    useValue: { fetchJobs: jest.fn().mockResolvedValue(mockJobs) }
                },
                {
                    provide: Provider2Service,
                    useValue: { fetchJobs: jest.fn().mockResolvedValue(mockJobs) }
                }
            ]
        }).compile();

        service = module.get<CronJobService>(CronJobService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should sync valid jobs (without throwing)', async () => {
        const handle = (service as any).handleFetchJobs.bind(service);
        await handle();

        expect(mockJobOfferService.createOrUpdate).toHaveBeenCalledTimes(2);
    });
});
