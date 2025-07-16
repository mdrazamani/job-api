import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, timeout } from 'rxjs';

@Injectable()
export class HealthService {
    constructor(
        private readonly dataSource: DataSource,
        private readonly http: HttpService
    ) {}

    async getHealthStatus() {
        const dbStatus = await this.checkDatabase();
        const provider1Status = await this.checkApi('https://assignment.devotel.io/api/provider1/jobs');
        const provider2Status = await this.checkApi('https://assignment.devotel.io/api/provider2/jobs');

        return {
            status: dbStatus === 'connected' && provider1Status === 'available' && provider2Status === 'available' ? 'ok' : 'degraded',
            timestamp: new Date().toISOString(),
            dependencies: {
                database: dbStatus,
                provider1: provider1Status,
                provider2: provider2Status
            }
        };
    }

    private async checkDatabase(): Promise<'connected' | 'disconnected'> {
        try {
            await this.dataSource.query('SELECT 1');
            return 'connected';
        } catch {
            return 'disconnected';
        }
    }

    private async checkApi(url: string): Promise<'available' | 'unavailable'> {
        try {
            await firstValueFrom(this.http.get(url).pipe(timeout(3000)));
            return 'available';
        } catch {
            return 'unavailable';
        }
    }
}
