import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobOffer } from '../entities/job-offer.entity';
import { createCrudService } from '@/common/crud-factory';
import { Logger } from '@/common/logging/logger';

@Injectable()
export class JobOfferService {
    private readonly crud;
    private readonly logger = new Logger('JobOfferService');

    constructor(
        @InjectRepository(JobOffer)
        private readonly repo: Repository<JobOffer>
    ) {
        this.crud = createCrudService(this.repo);
    }

    create(data: Partial<JobOffer>) {
        return this.crud.create(data);
    }

    update(id: number, data: Partial<JobOffer>) {
        return this.crud.update(id, data);
    }

    delete(id: number) {
        return this.crud.delete(id);
    }

    getById(id: number) {
        return this.crud.getById(id);
    }

    getAll(query: any) {
        return this.crud.getAll(query);
    }

    async createOrUpdate(data: Partial<JobOffer>): Promise<JobOffer> {
        try {
            const existing = await this.repo.findOneBy({
                externalId: data.externalId!,
                provider: data.provider!
            });

            if (existing) {
                const updated = await this.repo.save({ ...existing, ...data });
                this.logger.log(`🔁 Updated job`, {
                    externalId: updated.externalId,
                    provider: updated.provider
                });
                return updated;
            }

            const created = await this.repo.save(this.repo.create(data));
            this.logger.log(`🆕 Created job`, {
                externalId: created.externalId,
                provider: created.provider
            });
            return created;
        } catch (error) {
            this.logger.error('❌ Failed to createOrUpdate job', { job: data }, error.stack);
            throw error;
        }
    }
}
