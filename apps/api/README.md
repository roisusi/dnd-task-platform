# D&B Task Platform API

NestJS API for the task-flow platform. It connects the reusable task-flow core library to PostgreSQL through TypeORM.

## Installation

<!-- Installation instructions will be added here. -->

## Database migrations

Run these commands from the repository root.

### Create an empty migration

```bash
npm run migration:create -w apps/api -- src/database/migrations/GiveTableMigrationName
```

Creates an empty migration file. You must write both methods manually:

- `up`: applies the database change, such as creating a table.
- `down`: reverses the change made by `up`, such as deleting that table.

After the file is created, it is considered a pending migration until `migration:run` applies it to the database.

### Generate a migration from the entities

```bash
npm run migration:generate -w apps/api -- src/database/migrations/GiveTableMigrationName
```

Compares the TypeORM entities with the current database schema and generates the required SQL in a new migration file. It does not change the database.

### Show migration status

```bash
npm run migration:show -w apps/api
```

Shows which migrations have already run and which migrations are still pending.

### Run pending migrations

```bash
npm run migration:run -w apps/api
```

Runs every pending migration in timestamp order. TypeORM records each completed migration, so it will not run it again.

### Revert the latest migration

```bash
npm run migration:revert -w apps/api
```

Runs the `down` method of the latest completed migration. Run it again only when another migration must also be reverted.

## Important migration terms

- `up`: applies the database change.
- `down`: reverses the database change.
- `pending migration`: a migration file that exists in the project but its `up` method has not yet been applied to the current database. It is a migration status, not another method that must be written.
- `data-source.ts`: the TypeORM CLI connection and the list of entities and migrations it can inspect.
