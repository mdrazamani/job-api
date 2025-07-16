import { Test, TestingModule } from '@nestjs/testing';
import { Provider1Service } from './provider1.service';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';

describe('Provider1Service', () => {
    let service: Provider1Service;
    let httpService: HttpService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                Provider1Service,
                {
                    provide: HttpService,
                    useValue: {
                        get: jest.fn()
                    }
                }
            ]
        }).compile();

        service = module.get<Provider1Service>(Provider1Service);
        httpService = module.get<HttpService>(HttpService);
    });

    it('should fetch and map jobs', async () => {
        const rawData = { data: { jobs: [{ jobId: 'j1', title: 'Dev', details: {} }] } };
        jest.spyOn(httpService, 'get').mockReturnValue(of(rawData as any));

        const jobs = await service.fetchJobs();
        expect(jobs.length).toBe(1);
        expect(jobs[0].externalId).toBe('j1');
    });
});
