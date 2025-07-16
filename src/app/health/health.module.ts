import { Module } from '@nestjs/common';
import { HealthController } from './controllers/health.controller';
// import { HealthService } from './services/health.service';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthService } from './services/health.service';

@Module({
    imports: [TypeOrmModule.forFeature(), HttpModule], // Only needed if separate from global
    controllers: [HealthController],
    providers: [HealthService]
})
export class HealthModule {}
