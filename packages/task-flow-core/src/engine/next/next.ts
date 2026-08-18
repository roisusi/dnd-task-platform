import { type NextInput } from "./next-input";
import { CoreMessages } from "../../errors";
import {
  taskOperationFailure,
  type TaskOperationResult,
  taskOperationSuccess,
} from "../task-operation-result";
import { validateStatusMove } from "../status-move-validation";
import { validateStatusData } from "../validate-status-data";

/**
 * Advances an open task to the immediately following workflow status.
 *
 * The operation validates the destination status data, requires the next
 * assigned user and returns a new task without mutating the supplied task.
 *
 * Flow:
 * 1. Reject the operation when the task is already closed.
 * 2. Find the task's current status in the ordered workflow definition.
 * 3. Select only the immediately following status; skipping is impossible.
 * 4. Reject the operation when the current status is already the final status.
 * 5. Evaluate every validation rule attached to the destination status.
 * 6. Return all failed validation messages without changing the task.
 * 7. Require a non-empty identifier for the next assigned user.
 * 8. Return a new open task containing the destination status, supplied data
 *    and next assigned user while preserving the original task object.
 *
 * @typeParam TData - The consumer-owned task-data shape.
 *
 * @param input - The current task, workflow definition, destination data,
 * next assigned user and core-owned generic failure messages.
 *
 * @returns The advanced task on success, or workflow messages on failure.
 */
export function next<TData>(
  input: NextInput<TData>,
): TaskOperationResult<TData> {
  const { task, definition, data, nextAssignedUserId } = input;

  const statusMove = validateStatusMove(task, definition, 1, {
    taskClosed: CoreMessages.taskClosed,
    currentStatusNotFound: CoreMessages.currentStatusNotFound,
    workflowEdgeReached: CoreMessages.finalStatusReached,
  });

  if (statusMove.error !== undefined) {
    return taskOperationFailure([statusMove.error]);
  }

  const { destinationStatus } = statusMove;

  const updatedData = {
    ...task.data,
    ...data,
  };

  const validationMessages = validateStatusData(destinationStatus, updatedData);

  //stop the next if that is a validation error
  if (validationMessages.length > 0) {
    return taskOperationFailure(validationMessages);
  }

  //stop the next id no user assignment entered
  if (nextAssignedUserId.trim().length === 0) {
    return taskOperationFailure([CoreMessages.nextAssigneeRequired]);
  }

  return taskOperationSuccess({
    ...task,
    status: destinationStatus.status,
    lifecycleState: "open", //cant be closed because "closed" is a user action
    assignedUserId: nextAssignedUserId,
    data: updatedData,
  });
}
