# D&B Task Platform API

NestJS API for the task-flow platform. It connects the reusable task-flow core library to PostgreSQL through TypeORM.

## Developer notes

Use the root [`README.md`](../../README.md) for the complete installation and
run guide. This file documents API-specific development details.

### Environment loading

The API and the TypeORM CLI load:

```text
.env.<NODE_ENV>.local
```

When `NODE_ENV` is not supplied, both use
`.env.development.local`. Start by copying `.env.example`; local environment
files are ignored by Git.

### Runtime and migration connections

- `AppModule` configures the TypeORM connection used while NestJS is running.
- `src/database/data-source.ts` configures the standalone connection used by
  TypeORM migration commands.
- Both configurations must point to the same environment and register the
  same entities.
- `synchronize` remains `false`; database structure is changed only through
  migrations.

### API identity model

Create accepts an initial `assignedUserId`. Next, Back and Close expect the
current demo identity in the `x-user-id` header. The service confirms that the
user exists and currently owns the task before changing it. This is assignment
validation for the home assignment, not production authentication.

### Postman

Import `postman/task-flow-api.postman_collection.json`. Its collection-level
scripts maintain the current task and current demo user variables while the
requests move through Procurement, Development and Product Order.

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
