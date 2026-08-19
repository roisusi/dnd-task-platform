# Create a new task workflow

Use these steps when adding a new task type, for example
`employee-onboarding`.

## 1. Create the server workflow definition

- Add `apps/api/src/tasks/workflows/employee-onboarding.workflow.ts`.
- Define the saved `data`, for example `employeeName`, `equipmentId` and
  `permissionsApproved`.
- Set `key: 'employee-onboarding'` and `initialStatus: 1`.
- Add the ordered `statuses`. Each status contains its `status`, `name` and
  `validations`.

## 2. Register the server workflow

- Import the new definition in
  `apps/api/src/tasks/workflows/workflow.registry.ts`.
- Add `'employee-onboarding': employeeOnboardingWorkflow` to
  `workflowRegistry`.
- The existing Create, Next, Back and Close endpoints will now find the new
  definition through its `workflowKey`.

## 3. Add the Web workflow key

- Add `'employee-onboarding'` to `WorkflowKey` in
  `apps/web/src/model/task.model.ts`.
- This lets TypeScript accept tasks returned with that `workflowKey`.

## 4. Describe the Web stages and fields

- Add the new entry to `workflowDefinitions` in
  `apps/web/src/features/tasks/data/workflow-stages.data.ts`.
- For every stage, define the exact `status`, displayed `name` and `fields`.
- Each field defines values such as `name: 'employeeName'`,
  `label: 'Employee name'`, `type: 'text'` and `required: true`.
- Use `toData` to produce the API payload, for example
  `{ employeeName: values.employeeName }`.

## 5. Restore existing data when necessary

- No extra configuration is needed when the form field and `task.data` use the
  same key, such as `employeeName`.
- Add a field `defaultValue` only when the saved shape differs from the form
  shape, such as `priceQuotes` being displayed as `quoteOne` and `quoteTwo`.

## 6. Keep the existing persistence and generic operations

- The new task is stored in the existing `tasks` table with
  `workflow_key = 'employee-onboarding'`.
- Its custom values are stored in the existing JSONB `data` column, so no new
  task table or migration is required.
- Do not change the core `create`, `next`, `back` or `close` functions.

## 7. Verify the new workflow manually

- Create it from the Web or Postman.
- Run every Next step with valid data and with missing data.
- Run Back, close it at the final status, and confirm a closed task cannot be
  changed.
- Confirm only the user in `assignedUserId` can change it.

The generic core engine, controller operations, task service, reusable React
components and task table do not need to be rewritten.
