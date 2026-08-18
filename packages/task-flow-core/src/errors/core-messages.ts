import { type WorkflowMessage } from './workflow-message';

/**
 * Default messages for failures produced by the generic workflow engine.
 *
 * Task-specific validation messages remain in the consuming workflow
 * definition beside the business rule that can produce them.
 */
export const CoreMessages = {
  taskIdRequired: {
    code: 'TASK_ID_REQUIRED',
    message: 'A task identifier is required.',
  },
  workflowKeyRequired: {
    code: 'WORKFLOW_KEY_REQUIRED',
    message: 'A workflow key is required.',
  },
  initialStatusNotFound: {
    code: 'INITIAL_STATUS_NOT_FOUND',
    message: 'The configured initial status was not found.',
  },
  initialAssigneeRequired: {
    code: 'INITIAL_ASSIGNEE_REQUIRED',
    message: 'An initial assigned user is required.',
  },
  taskClosed: {
    code: 'TASK_CLOSED',
    message: 'A closed task cannot be changed.',
  },
  currentStatusNotFound: {
    code: 'CURRENT_STATUS_NOT_FOUND',
    message: "The task's current status was not found in its workflow.",
  },
  finalStatusReached: {
    code: 'FINAL_STATUS_REACHED',
    message: 'The task is already at the final status.',
  },
  nextAssigneeRequired: {
    code: 'NEXT_ASSIGNEE_REQUIRED',
    message: 'A next assigned user is required.',
  },
  initialStatusReached: {
    code: 'INITIAL_STATUS_REACHED',
    message: 'The task is already at the initial status.',
  },
  previousAssigneeRequired: {
    code: 'PREVIOUS_ASSIGNEE_REQUIRED',
    message: 'A previous assigned user is required.',
  },
  finalStatusRequired: {
    code: 'FINAL_STATUS_REQUIRED',
    message: 'The task can be closed only at its final status.',
  },
} as const satisfies Record<string, WorkflowMessage>;
