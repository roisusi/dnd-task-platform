import { type BackInput } from "./back-input";
import {
  taskOperationFailure,
  type TaskOperationResult,
  taskOperationSuccess,
} from "../task-operation-result";
import { validateStatusMove } from "../status-move-validation";

/**
 * Moves an open task to the immediately previous workflow status.
 *
 * Backward movement does not validate task data because the assignment defines
 * it as always allowed. The operation still protects closed tasks, verifies
 * the current status and requires an assignee for the returned task.
 *
 * @typeParam TData - The consumer-owned task-data shape.
 * @param input - Current task, ordered definition, previous assignee and messages.
 * @returns A new task on success, or workflow messages on failure.
 */
export function back<TData>(input: BackInput<TData>): TaskOperationResult<TData> {
  const { task, definition, previousAssignedUserId, messages } = input;

  const statusMove = validateStatusMove(
    task,
    definition,
    -1,
    {
      taskClosed: messages.taskClosed,
      currentStatusNotFound: messages.currentStatusNotFound,
      workflowEdgeReached: messages.initialStatusReached,
    },
  );

  if (statusMove.error !== undefined) {
    return taskOperationFailure([statusMove.error]);
  }

  const { destinationStatus } = statusMove;

  if (previousAssignedUserId.trim().length === 0) {
    return taskOperationFailure([messages.previousAssigneeRequired]);
  }

  return taskOperationSuccess({
    ...task,
    status: destinationStatus.status,
    lifecycleState: "open",
    assignedUserId: previousAssignedUserId,
  });
}
