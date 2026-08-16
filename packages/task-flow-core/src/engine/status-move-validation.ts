import {
  type StatusDefinition,
  type WorkflowDefinition,
} from "../definitions";
import { type WorkflowMessage } from "../errors";
import { type Task } from "../models";
import { validateTaskStatus } from "./task-status-validation";

type StatusMoveDirection = -1 | 1;

interface StatusMoveMessages {
  taskClosed: WorkflowMessage;
  currentStatusNotFound: WorkflowMessage;
  workflowEdgeReached: WorkflowMessage;
}

type StatusMoveValidation<TData> =
  | { destinationStatus: StatusDefinition<TData>; error?: never }
  | { destinationStatus?: never; error: WorkflowMessage };

/**
 * Validates the rules shared by forward and backward status moves.
 *
 * The function rejects a closed task, an unknown current status and a move
 * beyond the workflow edge. Otherwise, it returns the status to move into.
 */
export function validateStatusMove<TData>(
  task: Task<TData>,
  definition: WorkflowDefinition<TData>,
  direction: StatusMoveDirection,
  messages: StatusMoveMessages,
): StatusMoveValidation<TData> {
  const taskStatus = validateTaskStatus(task, definition, messages);

  if (taskStatus.error !== undefined) {
    return { error: taskStatus.error };
  }

  const { currentStatusIndex } = taskStatus;

  const destinationStatus = definition.statuses[currentStatusIndex + direction];

  if (destinationStatus === undefined) {
    return { error: messages.workflowEdgeReached };
  }

  return { destinationStatus };
}
