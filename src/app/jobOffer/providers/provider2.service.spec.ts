import { Test, TestingModule } from '@nestjs/testing';
import { Provider2Service } from './provider2.service';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { mapProvider2Job } from '../utils/mapper';

jest.mock('../utils/mapper', () => ({
    mapProvider2Job: jest.fn()
}));

describe('Provider2Service', () => {
    let service: Provider2Service;
    let httpService: HttpService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                Provider2Service,
                {
                    provide: HttpService,
                    useValue: {
                        get: jest.fn()
                    }
                }
            ]
        }).compile();

        service = module.get<Provider2Service>(Provider2Service);
        httpService = module.get<HttpService>(HttpService);
    });

    it('should fetch and map jobs from provider2', async () => {
        const mockRawJobs = {
            data: {
                data: {
                    jobsList: {
                        job1: { position: 'Developer' },
                        job2: { position: 'Designer' }
                    }
                }
            }
        };

        const mappedJob = { externalId: 'mapped' };
        (mapProvider2Job as jest.Mock).mockReturnValue(mappedJob);
        (httpService.get as jest.Mock).mockReturnValue(of(mockRawJobs));

        const result = await service.fetchJobs();

        expect(httpService.get).toHaveBeenCalledWith('https://assignment.devotel.io/api/provider2/jobs');
        expect(mapProvider2Job).toHaveBeenCalledTimes(2);
        expect(result).toEqual([mappedJob, mappedJob]);
    });
});
