import { type BackInput } from "./back-input";
import { CoreMessages } from "../../errors";
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
 * @param input - Current task, ordered definition and previous assignee.
 * @returns A new task on success, or workflow messages on failure.
 */
export function back<TData>(input: BackInput<TData>): TaskOperationResult<TData> {
  const { task, definition, previousAssignedUserId } = input;

  const statusMove = validateStatusMove(
    task,
    definition,
    -1,
    {
      taskClosed: CoreMessages.taskClosed,
      currentStatusNotFound: CoreMessages.currentStatusNotFound,
      workflowEdgeReached: CoreMessages.initialStatusReached,
    },
  );

  if (statusMove.error !== undefined) {
    return taskOperationFailure([statusMove.error]);
  }

  const { destinationStatus } = statusMove;

  if (previousAssignedUserId.trim().length === 0) {
    return taskOperationFailure([CoreMessages.previousAssigneeRequired]);
  }

  return taskOperationSuccess({
    ...task,
    status: destinationStatus.status,
    lifecycleState: "open",
    assignedUserId: previousAssignedUserId,
  });
}
