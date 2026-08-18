import { type CreateMessages, type NextMessages } from '@dnb/task-flow-core';

/** Messages returned when the generic Create operation cannot create a task. */
export const createMessages = {
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
} satisfies CreateMessages;

/** Messages returned when the generic Next operation cannot advance a task. */
export const nextMessages = {
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
} satisfies NextMessages;
