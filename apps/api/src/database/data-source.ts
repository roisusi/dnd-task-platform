import { join } from 'node:path';
import { DataSource } from 'typeorm';
import { TaskEntity } from '../tasks/tasks.entity';
import { UserEntity } from '../users/user.entity';

const environment = process.env.NODE_ENV ?? 'development';

process.loadEnvFile(`.env.${environment}.local`);

/** Returns a required environment variable or stops before opening a connection. */
function getRequiredEnvironmentVariable(name: string): string {
  const value = process.env[name];

  if (value === undefined || value.length === 0) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

/**
 * Standalone TypeORM configuration used by migration commands.
 * Nest uses the equivalent runtime connection configured in AppModule.
 */
export default new DataSource({
  type: 'postgres',
  host: getRequiredEnvironmentVariable('DB_HOST'),
  port: Number(getRequiredEnvironmentVariable('DB_PORT')),
  database: getRequiredEnvironmentVariable('DB_NAME'),
  username: getRequiredEnvironmentVariable('DB_USERNAME'),
  password: getRequiredEnvironmentVariable('DB_PASSWORD'),
  // One database connection; register every migration-visible entity here.
  entities: [TaskEntity, UserEntity],
  migrations: [join(__dirname, 'migrations', '*{.ts,.js}')],
  synchronize: false,
});
