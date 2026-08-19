# D&B Task Platform

An extensible full-stack task-management application. Procurement and
Development are the assignment examples; Product Order is a third workflow
that demonstrates how another task type can be added without changing the
generic workflow engine.

## Technology

- React, TypeScript, Vite and Material UI
- React Router, TanStack Query, Axios and React Hook Form
- NestJS and TypeORM
- PostgreSQL
- A framework-independent TypeScript package: `@dnb/task-flow-core`

## Project structure

```text
apps/
├── api/                     NestJS REST API and workflow definitions
└── web/                     React task-management application

packages/
└── task-flow-core/          reusable workflow contracts and engine
```

The repository is an npm workspace. Dependencies are installed once at the
root, and the applications consume the core package through its workspace
name instead of a relative filesystem import.

## Prerequisites

- Node.js 24
- npm 11 or later
- PostgreSQL 17 or a compatible recent PostgreSQL version

Using `nvm` is recommended:

```bash
nvm install 24
nvm use 24
```

## Installation

Run all commands from the repository root unless a section says otherwise.

### 1. Install workspace dependencies

```bash
npm ci
```

`npm ci` installs the exact dependency versions recorded in
`package-lock.json` and links `@dnb/task-flow-core` into the workspace.

Optional workspace checks:

```bash
npm run workspaces:list
npm run workspace:check-link
```

### 2. Start PostgreSQL and create the database

On macOS with Homebrew:

```bash
brew services start postgresql@17
createdb dnb_task_flow
```

On Windows, PostgreSQL normally starts automatically after installation. If
it is stopped, open PowerShell as Administrator and run:

```powershell
Start-Service postgresql-x64-17
```

Create the database using the PostgreSQL tools installed in the default
location. PowerShell will ask for the `postgres` user's password:

```powershell
& "C:\Program Files\PostgreSQL\17\bin\createdb.exe" -U postgres dnb_task_flow
```

Confirm that PostgreSQL accepts connections on macOS:

```bash
pg_isready
```

Or on Windows:

```powershell
& "C:\Program Files\PostgreSQL\17\bin\pg_isready.exe" -U postgres
```

If PostgreSQL was installed in a different directory or with another major
version, update `17` in the service name and executable path accordingly.

### 3. Configure the API environment

Create the local development file from the committed example:

```bash
cp apps/api/.env.example apps/api/.env.development.local
```

Update the copied file with the local PostgreSQL credentials:

```dotenv
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dnb_task_flow
DB_USERNAME=your_postgres_username
DB_PASSWORD=your_postgres_password
```

`apps/api/.env.development.local` is ignored by Git and must never be
committed. The username and password must identify a PostgreSQL user that can
create tables in `dnb_task_flow`.

If the local PostgreSQL user does not yet have a password, set one before
starting the API:

```sql
ALTER USER your_postgres_username WITH PASSWORD 'your_postgres_password';
```

### 4. Create the schema and demo users

```bash
npm run migration:run -w apps/api
```

The migrations create the `tasks` and `users` tables, add the assignment
foreign key, and insert four demo users:

- `user-1` — Roi
- `user-2` — Dana
- `user-3` — Amit
- `user-4` — Supervisor

Migration details and maintenance commands are documented in
[`apps/api/README.md`](apps/api/README.md).

### 5. Start the applications

Start the API and Web together from one terminal:

```bash
npm run dev
```

`concurrently` starts both processes and prefixes their output with `API` or
`WEB`. Press `Ctrl+C` once to stop both.

To run them separately, start the API in one terminal:

```bash
npm run dev:api
```

Then start the Web application in another terminal:

```bash
npm run dev:web
```

Open:

- Web application: http://localhost:5173
- REST API: http://localhost:3000

The API allows the local Vite origin `http://localhost:5173` through CORS.

## Verification

Run the complete workspace build and test commands:

```bash
npm run build
npm test
npm run lint
```

Run the core tests with individual test names:

```bash
npm run test:core:verbose
```

The Postman collection is available at:

```text
apps/api/postman/task-flow-api.postman_collection.json
```

Import it into Postman to run the three example workflows and validation
requests. The collection stores created task IDs and the current demo user as
collection variables.

## Architecture

### Reusable workflow core

`@dnb/task-flow-core` contains generic task models, workflow-definition
contracts, validation results, messages and the Create, Next, Back and Close
operations. It has no NestJS, HTTP, TypeORM, database or concrete workflow
dependency.

### API and persistence

The NestJS application owns the concrete Procurement, Development and Product
Order definitions. A registry maps each persisted `workflowKey` to its
definition; the shared task service uses the same generic operations for every
workflow.

Tasks share one PostgreSQL table. Common lifecycle fields are regular columns,
while workflow-specific values are stored in a JSONB `data` column. Adding a
workflow therefore does not require another task table or another lifecycle
service.

### Web application

The React application uses routed pages for the assigned-task list, task
creation and task continuation. The task ID is kept in `/tasks/:taskId`, and
the persisted status is reloaded from the API, so refreshing the browser keeps
the user on the same task and step.

Axios owns HTTP calls, TanStack Query owns server state and cache invalidation,
and React Hook Form owns step-form state. Material UI provides the component
system and `CssBaseline`.

## Adding another workflow

1. Add a consumer-owned workflow definition under the API workflow folder.
2. Register its key in the API workflow registry.
3. Add its UI field definition to the web workflow configuration.
4. Add user-facing translations for any new validation message codes.

The core engine, generic controller operations and task table do not need to
be rewritten.

## Known limitations and future improvements

### Code-defined workflows

The application is extensible, but it is not fully dynamic. Workflow
definitions are TypeScript code rather than database records or
administrator-created configuration. Adding a task type requires creating its
workflow definition and registering its key in the API registry, with a
matching UI definition for its fields.

This was an intentional design boundary for the assignment: new workflows can
reuse the task table, API operations and generic core engine without rewriting
their lifecycle logic. A fully dynamic version could later store workflow
stages, field metadata and validation configuration in the database and build
the UI from that metadata.

### Demo users and authentication

Authentication is intentionally outside the assignment scope. The application
uses four seeded demo users, the Web `Working as` selector and an `x-user-id`
header. The API verifies that the supplied user exists and is the task's
current assignee, but the header is not a secure identity mechanism.

A production version should replace it with authenticated users, JWT or a
session, authorization guards and server-derived user identity. The demo UI
also switches to the next assigned user after a successful transition so the
entire flow can be demonstrated on one computer.

### Styling organization

Material UI `sx` styles are currently colocated inline with the components.
This is valid MUI usage and keeps the home assignment easy to inspect. If the
application grows, repeated or substantial styles should be extracted into
adjacent `*.styles.ts` files, while small one-off layout rules may remain
inline.
