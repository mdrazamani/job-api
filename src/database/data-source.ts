import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { JobOffer } from '@/app/jobOffer/entities/job-offer.entity';

dotenv.config();

const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'jobhub',
    synchronize: false,
    logging: true,
    entities: [JobOffer],
    migrations: ['src/database/migrations/*.ts']
});

export default AppDataSource;
