import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
    constructor(private readonly configService: ConfigService) {}

    get dbHost(): string {
        return this.configService.get<string>('DB_HOST') || 'localhost';
    }

    get dbPort(): number {
        return Number(this.configService.get<string>('DB_PORT'));
    }

    get dbUsername(): string {
        return this.configService.get<string>('DB_USERNAME') || 'jobadmin';
    }

    get dbPassword(): string {
        return this.configService.get<string>('DB_PASSWORD') || 'securepassword';
    }

    get dbName(): string {
        return this.configService.get<string>('DB_NAME') || 'jobhub';
    }

    get runPort(): number {
        return Number(this.configService.get<string>('PORT')) || 3000;
    }

    get cronSchedule(): string {
        return this.configService.get<string>('CRON_SCHEDULE') || '*/5 * * * *';
    }
}
