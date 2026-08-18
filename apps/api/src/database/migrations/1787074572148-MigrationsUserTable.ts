import { MigrationInterface, QueryRunner, Table } from 'typeorm';

/** Creates the demo-users table required for task assignment. */
export class MigrationsUserTable1787074572148
  implements MigrationInterface
{
  /** Creates the users table when the migration is applied. */
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '100',
            isPrimary: true,
          },
          {
            name: 'display_name',
            type: 'varchar',
            length: '100',
          },
        ],
      }),
    );
  }

  /** Removes the users table when the migration is reverted. */
  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
