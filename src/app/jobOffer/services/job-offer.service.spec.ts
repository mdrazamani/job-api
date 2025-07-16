import { Test, TestingModule } from '@nestjs/testing';
import { JobOfferService } from './job-offer.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JobOffer } from '../entities/job-offer.entity';
import { Repository } from 'typeorm';

const mockRepo = () => ({
    findOneBy: jest.fn(),
    save: jest.fn(),
    create: jest.fn()
});

describe('JobOfferService', () => {
    let service: JobOfferService;
    let repo: ReturnType<typeof mockRepo>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [JobOfferService, { provide: getRepositoryToken(JobOffer), useFactory: mockRepo }]
        }).compile();

        service = module.get<JobOfferService>(JobOfferService);
        repo = module.get(getRepositoryToken(JobOffer));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should create new job if not exists', async () => {
        repo.findOneBy.mockResolvedValue(null);
        repo.create.mockReturnValue({ externalId: '123' });
        repo.save.mockResolvedValue({ id: 1 });

        const job = await service.createOrUpdate({
            externalId: '123',
            provider: 'provider1',
            title: 'Developer',
            location: 'NY',
            company: 'Tech Co'
        });

        expect(repo.create).toBeCalled();
        expect(repo.save).toBeCalled();
        expect(job).toEqual({ id: 1 });
    });

    it('should update job if exists', async () => {
        repo.findOneBy.mockResolvedValue({ id: 1, title: 'Old' });
        repo.save.mockResolvedValue({ id: 1, title: 'New' });

        const job = await service.createOrUpdate({
            externalId: '123',
            provider: 'provider1',
            title: 'New',
            location: 'NY',
            company: 'Tech Co'
        });

        expect(repo.save).toBeCalledWith(expect.objectContaining({ title: 'New' }));
        expect(job.title).toBe('New');
    });
});
