import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1782135142494 implements MigrationInterface {
    name = 'InitialSchema1782135142494'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."investments_investment_type_enum" AS ENUM('Mutual Fund', 'Stocks', 'Crypto', 'Real Estate', 'Fixed Deposit', 'Other')`);
        await queryRunner.query(`CREATE TABLE "investments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "investment_name" character varying NOT NULL, "investment_type" "public"."investments_investment_type_enum" NOT NULL, "invested_amount" numeric(12,2) NOT NULL, "current_value" numeric(12,2) NOT NULL, "purchase_date" date NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, CONSTRAINT "PK_a1263853f1a4fb8b849c1c9aff4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "investments" ADD CONSTRAINT "FK_fe9d6987f15c1cce3ff55dd25e2" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "investments" DROP CONSTRAINT "FK_fe9d6987f15c1cce3ff55dd25e2"`);
        await queryRunner.query(`DROP TABLE "investments"`);
        await queryRunner.query(`DROP TYPE "public"."investments_investment_type_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
