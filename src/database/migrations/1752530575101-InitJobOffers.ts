import { MigrationInterface, QueryRunner } from "typeorm";

export class InitJobOffers1752530575101 implements MigrationInterface {
    name = 'InitJobOffers1752530575101'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "job_offers" ("id" SERIAL NOT NULL, "externalId" character varying NOT NULL, "provider" character varying NOT NULL, "title" character varying NOT NULL, "location" character varying NOT NULL, "contractType" character varying, "remote" boolean, "salaryMin" integer, "salaryMax" integer, "salaryCurrency" character varying, "company" character varying NOT NULL, "skills" text, "postedAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9a54d36bd6829979f945defdeb5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6703e2dce2edabb533829748a5" ON "job_offers" ("externalId") `);
        await queryRunner.query(`CREATE INDEX "IDX_14ebf9a1e10d35ae321d433931" ON "job_offers" ("location") `);
        await queryRunner.query(`CREATE INDEX "IDX_60c48dd88d0dbd4d5baaba87d1" ON "job_offers" ("title") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_884f5b3eeea5f02284867199f8" ON "job_offers" ("externalId", "provider") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_884f5b3eeea5f02284867199f8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_60c48dd88d0dbd4d5baaba87d1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_14ebf9a1e10d35ae321d433931"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6703e2dce2edabb533829748a5"`);
        await queryRunner.query(`DROP TABLE "job_offers"`);
    }

}
