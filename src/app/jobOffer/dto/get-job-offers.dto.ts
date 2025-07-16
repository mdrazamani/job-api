import { IsOptional, IsString, IsNumber, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetJobOffersDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    location?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    minSalary?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    maxSalary?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number;
}
