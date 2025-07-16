import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags, ApiOkResponse, ApiBadRequestResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { JobOfferService } from '../services/job-offer.service';
import { GetJobOffersDto } from '../dto/get-job-offers.dto';

@ApiTags('job-offers')
@Controller('job-offers')
export class JobOfferController {
    constructor(private readonly jobService: JobOfferService) {}

    @Get()
    @ApiOperation({ summary: 'Get all job offers with optional filters and pagination' })
    @ApiQuery({ name: 'title', required: false, type: String, description: 'Filter by job title' })
    @ApiQuery({ name: 'location', required: false, type: String, description: 'Filter by location' })
    @ApiQuery({ name: 'minSalary', required: false, type: Number, description: 'Minimum salary' })
    @ApiQuery({ name: 'maxSalary', required: false, type: Number, description: 'Maximum salary' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
    @ApiOkResponse({
        description: 'List of job offers',
        schema: {
            example: {
                message: 'Request successful',
                statusCode: 200,
                data: [
                    {
                        id: 318,
                        externalId: 'job-23',
                        provider: 'provider2',
                        title: 'Backend Engineer',
                        location: 'Austin, WA',
                        contractType: null,
                        remote: false,
                        salaryMin: 72000,
                        salaryMax: 126000,
                        salaryCurrency: 'USD',
                        company: 'Creative Design Ltd',
                        skills: ['JavaScript', 'Node.js', 'React'],
                        postedAt: '2025-07-13T00:00:00.000Z',
                        createdAt: '2025-07-15T11:23:00.421Z',
                        updatedAt: '2025-07-15T11:23:00.421Z'
                    }
                ],
                meta: {
                    pagination: {
                        currentPage: 1,
                        perPage: 10,
                        total: 318,
                        lastPage: 32
                    },
                    traceId: null,
                    ip: null,
                    method: 'GET',
                    url: '/api/job-offers',
                    duration: 18,
                    timestamp: '2025-07-15T14:53:13.529Z'
                }
            }
        }
    })
    @ApiBadRequestResponse({
        description: 'Bad Request (Custom Error)',
        schema: {
            example: {
                message: 'test',
                statusCode: 400,
                status: 'BadRequestError',
                comingFrom: 'test',
                errorStack: 'Error: test\n    at ...',
                additionalInfo: {
                    timestamp: '2025-07-15T14:58:55.264Z'
                }
            }
        }
    })
    @ApiNotFoundResponse({
        description: 'Not Found (Custom Error)',
        schema: {
            example: {
                message: 'test',
                statusCode: 404,
                status: 'NotFoundError',
                comingFrom: 'test',
                errorStack: 'Error: test\n    at ...',
                additionalInfo: {
                    timestamp: '2025-07-15T14:58:42.975Z'
                }
            }
        }
    })
    async findAll(@Query() query: GetJobOffersDto) {
        return this.jobService.getAll(query);
    }
}
