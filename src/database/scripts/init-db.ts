import { NestFactory } from '@nestjs/core';
import { Client } from 'pg';
import { execSync, execSync as exec } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import { AppConfigService } from '@/config/config.service';
import { AppConfigModule } from '@/config/config.module';
import { Logger } from '@/common/logging/logger';

async function initDatabase() {
    const app = await NestFactory.createApplicationContext(AppConfigModule);
    const config = app.get(AppConfigService);
    const logger = new Logger('InitDatabase');
    const dbName = config.dbName;

    const checkClient = new Client({
        host: config.dbHost,
        port: config.dbPort,
        user: config.dbUsername,
        password: config.dbPassword,
        database: 'postgres'
    });

    try {
        await checkClient.connect();

        const check = await checkClient.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);

        if (check.rowCount === 0) {
            logger.log(`📦 Database "${dbName}" not found. Creating...`);
            await checkClient.query(`CREATE DATABASE "${dbName}"`);
            logger.log(`✅ Database "${dbName}" created.`);
        } else {
            logger.log(`✅ Database "${dbName}" already exists.`);
        }

        await checkClient.end();

        const dataSourcePath = path.resolve('src', 'database', 'data-source.ts');
        const migrationsDir = path.resolve('src', 'database', 'migrations');

        const migrationFiles = fs.existsSync(migrationsDir) ? fs.readdirSync(migrationsDir).filter((file) => file.endsWith('.ts')) : [];

        if (migrationFiles.length === 0) {
            logger.log(`📁 No migrations found. Generating initial migration...`);
            execSync(`npm run typeorm -- migration:generate src/database/migrations/InitJobOffers --dataSource ${dataSourcePath}`, {
                stdio: 'inherit',
                env: {
                    ...process.env,
                    PGPASSWORD: config.dbPassword
                }
            });
        } else {
            logger.log(`📁 Found ${migrationFiles.length} migration(s).`);
        }

        logger.log(`🚀 Running migrations...`);
        execSync(`npm run typeorm -- migration:run --dataSource ${dataSourcePath}`, {
            stdio: 'inherit',
            env: {
                ...process.env,
                PGPASSWORD: config.dbPassword
            }
        });

        logger.log('✅ Migrations executed successfully.');
    } catch (error: any) {
        logger.error(`❌ Error: ${error.message}`);
        logger.error(`🔍 Tip: Make sure user "${config.dbUsername}" exists and has permission to create databases.`);
        process.exit(1);
    } finally {
        await app.close();
    }
}

initDatabase();
