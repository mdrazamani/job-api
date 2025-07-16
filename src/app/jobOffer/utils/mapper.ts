import { JobOfferDto } from '../dto/job-offer.dto';

function safeDate(input: any): Date {
    const date = new Date(input);
    return isNaN(date.getTime()) ? new Date() : date;
}

export function mapProvider1Job(raw: any): JobOfferDto {
    const [minSalaryStr, maxSalaryStr] = raw.details.salaryRange?.replace(/\$/g, '').replace(/k/g, '000').split(' - ') || [];

    return {
        externalId: raw.jobId,
        provider: 'provider1',
        title: raw.title,
        location: raw.details?.location || 'Unknown',
        contractType: raw.details?.type ?? undefined,
        remote: undefined, // not provided
        salaryMin: minSalaryStr ? parseInt(minSalaryStr) : undefined,
        salaryMax: maxSalaryStr ? parseInt(maxSalaryStr) : undefined,
        salaryCurrency: 'USD',
        company: raw.company?.name || 'Unknown Company',
        skills: raw.skills || [],
        postedAt: safeDate(raw.postedDate)
    };
}

export function mapProvider2Job(raw: any, key: string): JobOfferDto {
    return {
        externalId: key,
        provider: 'provider2',
        title: raw.position,
        location: `${raw.location?.city}, ${raw.location?.state}`,
        contractType: undefined,
        remote: typeof raw.location?.remote === 'boolean' ? raw.location.remote : undefined,
        salaryMin: raw.compensation?.min ?? undefined,
        salaryMax: raw.compensation?.max ?? undefined,
        salaryCurrency: raw.compensation?.currency ?? undefined,
        company: raw.employer?.companyName || 'Unknown Company',
        skills: raw.requirements?.technologies || [],
        postedAt: safeDate(raw.datePosted)
    };
}
