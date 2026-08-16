import { type WorkflowDefinition } from "../definitions";
import { type WorkflowMessage } from "../errors";
import { type Task } from "../models";

interface TaskStatusMessages {
  taskClosed: WorkflowMessage;
  currentStatusNotFound: WorkflowMessage;
}

type TaskStatusValidation =
  | { currentStatusIndex: number; error?: never }
  | { currentStatusIndex?: never; error: WorkflowMessage };

/** Validates that a task is open and its current status is defined. */
export function validateTaskStatus<TData>(
  task: Task<TData>,
  definition: WorkflowDefinition<TData>,
  messages: TaskStatusMessages,
): TaskStatusValidation {
  if (task.lifecycleState === "closed") {
    return { error: messages.taskClosed };
  }

  const currentStatusIndex = definition.statuses.findIndex(
    ({ status }) => status === task.status,
  );

  if (currentStatusIndex === -1) {
    return { error: messages.currentStatusNotFound };
  }

  return { currentStatusIndex };
}
