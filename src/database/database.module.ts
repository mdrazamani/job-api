import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigService } from '../config/config.service';
import { AppConfigModule } from '../config/config.module';

@Module({
    imports: [
        AppConfigModule,
        TypeOrmModule.forRootAsync({
            imports: [AppConfigModule],
            inject: [AppConfigService],
            useFactory: async (config: AppConfigService) => {
                const dbConfig = {
                    type: 'postgres' as const,
                    host: config.dbHost,
                    port: config.dbPort,
                    username: config.dbUsername,
                    password: config.dbPassword,
                    database: config.dbName,
                    autoLoadEntities: true,
                    synchronize: true
                };

                console.log(`✅ Connected to PostgreSQL at ${dbConfig.host}:${dbConfig.port} (DB: ${dbConfig.database})`, 'TypeORM');

                return dbConfig;
            }
        })
    ]
})
export class DatabaseModule {}
