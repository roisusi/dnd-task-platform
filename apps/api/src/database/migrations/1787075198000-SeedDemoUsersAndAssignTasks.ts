import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

/** Seeds demo users and protects task assignments with a foreign key. */
export class SeedDemoUsersAndAssignTasks1787075198000 implements MigrationInterface {
  /** Inserts demo users before connecting existing and future tasks to them. */
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "users" ("id", "display_name")
      VALUES
        ('user-1', 'Roi'),
        ('user-2', 'Dana'),
        ('user-3', 'Amit'),
        ('user-4', 'Supervisor')
    `);

    await queryRunner.createForeignKey(
      'tasks',
      new TableForeignKey({
        name: 'fk_tasks_assigned_user',
        columnNames: ['assigned_user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      }),
    );
  }

  /** Removes the relationship before deleting only the seeded demo users. */
  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('tasks', 'fk_tasks_assigned_user');

    await queryRunner.query(`
      DELETE FROM "users"
      WHERE "id" IN ('user-1', 'user-2', 'user-3', 'user-4')
    `);
  }
}
