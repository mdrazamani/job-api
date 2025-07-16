import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobOffer } from './entities/job-offer.entity';
import { JobOfferService } from './services/job-offer.service';
import { JobOfferController } from './controllers/job.controller';
import { Provider1Service } from './providers/provider1.service';
import { Provider2Service } from './providers/provider2.service';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [TypeOrmModule.forFeature([JobOffer]), HttpModule],
    providers: [JobOfferService, Provider1Service, Provider2Service],
    controllers: [JobOfferController],
    exports: [JobOfferService, Provider1Service, Provider2Service]
})
export class JobOfferModule {}
