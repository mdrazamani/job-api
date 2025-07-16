import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { mapProvider2Job } from '../utils/mapper';

@Injectable()
export class Provider2Service {
    private readonly endpoint = 'https://assignment.devotel.io/api/provider2/jobs';

    constructor(private readonly http: HttpService) {}

    async fetchJobs(): Promise<any[]> {
        const response = await firstValueFrom(this.http.get(this.endpoint));
        const jobsRaw = response.data?.data?.jobsList || {};
        return Object.entries(jobsRaw).map(([key, value]) => mapProvider2Job(value, key));
    }
}
