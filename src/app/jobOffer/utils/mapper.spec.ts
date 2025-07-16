import { mapProvider1Job, mapProvider2Job } from './mapper';
import { JobOfferDto } from '../dto/job-offer.dto';

describe('Mapper Functions', () => {
    describe('mapProvider1Job', () => {
        it('should correctly map provider1 job data', () => {
            const rawJob = {
                jobId: '123',
                title: 'Frontend Developer',
                details: {
                    salaryRange: '$50k - $70k',
                    location: 'Berlin',
                    type: 'Full-time'
                },
                company: {
                    name: 'Tech Inc'
                },
                skills: ['React', 'TypeScript'],
                postedDate: '2025-07-10T00:00:00.000Z'
            };

            const result = mapProvider1Job(rawJob);

            const expected: Partial<JobOfferDto> = {
                externalId: '123',
                provider: 'provider1',
                title: 'Frontend Developer',
                location: 'Berlin',
                contractType: 'Full-time',
                remote: undefined,
                salaryMin: 50000,
                salaryMax: 70000,
                salaryCurrency: 'USD',
                company: 'Tech Inc',
                skills: ['React', 'TypeScript'],
                postedAt: new Date('2025-07-10T00:00:00.000Z')
            };

            expect(result).toMatchObject(expected);
        });

        it('should use default values if some fields are missing', () => {
            const rawJob = {
                jobId: '321',
                title: 'No Info Dev',
                details: {},
                company: {},
                skills: [],
                postedDate: 'invalid-date'
            };

            const result = mapProvider1Job(rawJob);

            expect(result.location).toBe('Unknown');
            expect(result.company).toBe('Unknown Company');
            expect(result.salaryMin).toBeUndefined();
            expect(result.salaryMax).toBeUndefined();
            expect(result.postedAt instanceof Date).toBe(true);
        });
    });

    describe('mapProvider2Job', () => {
        it('should correctly map provider2 job data', () => {
            const rawJob = {
                position: 'Backend Developer',
                location: {
                    city: 'Paris',
                    state: 'FR',
                    remote: true
                },
                compensation: {
                    min: 60000,
                    max: 90000,
                    currency: 'EUR'
                },
                employer: {
                    companyName: 'Backenders Ltd'
                },
                requirements: {
                    technologies: ['Node.js', 'PostgreSQL']
                },
                datePosted: '2025-07-12T00:00:00.000Z'
            };

            const result = mapProvider2Job(rawJob, 'job-abc');

            const expected: Partial<JobOfferDto> = {
                externalId: 'job-abc',
                provider: 'provider2',
                title: 'Backend Developer',
                location: 'Paris, FR',
                remote: true,
                salaryMin: 60000,
                salaryMax: 90000,
                salaryCurrency: 'EUR',
                company: 'Backenders Ltd',
                skills: ['Node.js', 'PostgreSQL'],
                postedAt: new Date('2025-07-12T00:00:00.000Z')
            };

            expect(result).toMatchObject(expected);
        });

        it('should fall back to default values if optional fields missing', () => {
            const rawJob = {
                position: 'DevOps',
                location: {},
                compensation: {},
                employer: {},
                requirements: {},
                datePosted: null
            };

            const result = mapProvider2Job(rawJob, 'job-xyz');

            expect(result.location).toBe('undefined, undefined');
            expect(result.remote).toBeUndefined();
            expect(result.salaryMin).toBeUndefined();
            expect(result.salaryMax).toBeUndefined();
            expect(result.salaryCurrency).toBeUndefined();
            expect(result.company).toBe('Unknown Company');
            expect(result.skills).toEqual([]);
        });
    });
});
