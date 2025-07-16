import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { HealthService } from '../services/health.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
    constructor(private readonly healthService: HealthService) {}

    @Get()
    @ApiOperation({ summary: 'Check service & dependency health (DB, external APIs)' })
    @ApiOkResponse({
        description: 'Health status of the server and dependencies',
        schema: {
            example: {
                status: 'ok',
                timestamp: '2025-07-15T12:34:56.000Z',
                dependencies: {
                    database: 'connected',
                    provider1: 'available',
                    provider2: 'available'
                }
            }
        }
    })
    async checkHealth() {
        return this.healthService.getHealthStatus();
    }
}
