import { Test, TestingModule } from '@nestjs/testing';
import { JobOfferController } from './job.controller';
import { JobOfferService } from '../services/job-offer.service';
import { GetJobOffersDto } from '../dto/get-job-offers.dto';

describe('JobOfferController', () => {
    let controller: JobOfferController;
    let service: JobOfferService;

    const mockService = {
        getAll: jest.fn()
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [JobOfferController],
            providers: [{ provide: JobOfferService, useValue: mockService }]
        }).compile();

        controller = module.get<JobOfferController>(JobOfferController);
        service = module.get<JobOfferService>(JobOfferService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should call service.getAll with query', async () => {
        const query: GetJobOffersDto = { title: 'Backend' };
        await controller.findAll(query);
        expect(service.getAll).toBeCalledWith(query);
    });
});
