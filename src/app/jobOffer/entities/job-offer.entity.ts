import { Entity, Column, PrimaryGeneratedColumn, Index, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'job_offers' })
@Index(['externalId', 'provider'], { unique: true })
@Index(['title'])
@Index(['location'])
export class JobOffer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Index()
    externalId: string;

    @Column()
    provider: string;

    @Column()
    title: string;

    @Column()
    location: string;

    @Column({ nullable: true })
    contractType?: string;

    @Column({ nullable: true })
    remote?: boolean;

    @Column({ type: 'int', nullable: true })
    salaryMin?: number;

    @Column({ type: 'int', nullable: true })
    salaryMax?: number;

    @Column({ nullable: true })
    salaryCurrency?: string;

    @Column()
    company: string;

    @Column('simple-array', { nullable: true })
    skills: string[];

    @Column({ type: 'timestamp' })
    postedAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
