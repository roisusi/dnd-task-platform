# D&B Task Platform

An extensible task-management platform created as a full-stack home assignment.

The project is organized as an npm workspace so applications and reusable packages can be developed in one repository and consumed through package names.

## Workspace structure

```text
apps/
├── api/    NestJS application
└── web/    React application

packages/
└── task-flow-core/    reusable TypeScript workflow library
```

Each workspace owns its detailed setup and architecture documentation. The root README provides only the project-level overview.

## Root commands

```bash
npm install
npm run workspaces:list
npm run build
npm test
```
