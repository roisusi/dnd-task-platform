# @dnb/task-flow-core

A standalone TypeScript library that provides reusable contracts and behavior for workflow-driven tasks.

The package is consumed through the npm workspace name:

```text
@dnb/task-flow-core
```

## Responsibilities

- `models`: generic state and data contracts for a workflow task instance.
- `definitions`: contracts a consumer uses to describe statuses and transitions.
- `policies`: generic extension points for transition locks, closure decisions and assignee resolution.
- `validation`: generic validation callback and result contracts.
- `errors`: framework-independent workflow failures.
- `engine`: generic workflow execution implemented later.
- `src/index.ts`: the public package entry point.

## Package commands

Run from the repository root:

```bash
npm run build -w @dnb/task-flow-core
npm test -w @dnb/task-flow-core
npm run pack:check -w @dnb/task-flow-core
```

Generated files are written to `dist`. Source code belongs only under `src`.
