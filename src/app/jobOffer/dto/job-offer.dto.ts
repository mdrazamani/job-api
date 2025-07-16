export class JobOfferDto {
    externalId: string;
    provider: string;
    title: string;
    location: string;
    contractType?: string;
    remote?: boolean;
    salaryMin?: number;
    salaryMax?: number;
    salaryCurrency?: string;
    company: string;
    skills?: string[];
    postedAt: Date;
}
