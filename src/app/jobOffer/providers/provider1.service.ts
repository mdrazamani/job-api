import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { mapProvider1Job } from '../utils/mapper';

@Injectable()
export class Provider1Service {
    private readonly endpoint = 'https://assignment.devotel.io/api/provider1/jobs';

    constructor(private readonly http: HttpService) {}

    async fetchJobs(): Promise<any[]> {
        const response = await firstValueFrom(this.http.get(this.endpoint));
        const jobsRaw = response.data?.jobs || [];
        return jobsRaw.map(mapProvider1Job);
    }
}
