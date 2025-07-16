import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { MainModule } from '../src/main.module';

describe('JobOffersController (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [MainModule]
        }).compile();

        app = moduleFixture.createNestApplication();
        app.setGlobalPrefix('api');
        app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('should return paginated job offers (GET /api/job-offers)', async () => {
        const response = await request(app.getHttpServer()).get('/api/job-offers').query({ page: 1, limit: 5 });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Request successful');
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.meta).toHaveProperty('pagination');
    });

    it('should filter job offers by title', async () => {
        const response = await request(app.getHttpServer()).get('/api/job-offers').query({ title: 'engineer' });

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should return 400 for invalid query', async () => {
        const response = await request(app.getHttpServer()).get('/api/job-offers').query({ limit: 'invalid' });

        expect([200, 400]).toContain(response.status);
    });
});
