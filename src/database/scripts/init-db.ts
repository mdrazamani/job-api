import { NestFactory } from '@nestjs/core';

import { Client } from 'pg';
import { execSync } from 'child_process';
import * as path from 'path';
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

        const dataSourcePath = path.resolve(process.cwd(), 'src', 'database', 'data-source.ts');
        logger.log(`🛠 Running migrations using: ${dataSourcePath}`);

        execSync(`npx typeorm migration:run --dataSource ${dataSourcePath}`, {
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
