import { MigrationInterface, QueryRunner } from 'typeorm';

/** Creates the generic JSONB-backed task table used by every workflow type. */
export class CreateTasksTable1787000822181 implements MigrationInterface {
  /** Creates the lifecycle enum, tasks table and assigned-user lookup index. */
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "public"."tasks_lifecycle_state_enum"
      AS ENUM ('open', 'closed')
    `);

    await queryRunner.query(`
      CREATE TABLE "tasks" (
        "id" uuid NOT NULL,
        "workflow_key" varchar(100) NOT NULL,
        "status" integer NOT NULL,
        "lifecycle_state" "public"."tasks_lifecycle_state_enum" NOT NULL,
        "assigned_user_id" varchar(100) NOT NULL,
        "data" jsonb NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_tasks_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_tasks_assigned_user_id"
      ON "tasks" ("assigned_user_id")
    `);
  }

  /** Removes the task table and its PostgreSQL lifecycle enum. */
  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "tasks"');
    await queryRunner.query('DROP TYPE "public"."tasks_lifecycle_state_enum"');
  }
}
