import {
  taskOperationFailure,
  type TaskOperationResult,
  taskOperationSuccess,
} from "../task-operation-result";
import { CoreMessages } from "../../errors";
import { validateTaskStatus } from "../task-status-validation";
import { type CloseInput } from "./close-input";

/**
 * Closes an open task only when it is at the final workflow status.
 *
 * Close does not enter another status and therefore does not run status-data
 * validations. It returns a new task and preserves every field except the
 * lifecycle state.
 *
 * @typeParam TData - The consumer-owned task-data shape.
 * @param input - Current task and workflow definition.
 * @returns The closed task on success, or a workflow message on failure.
 */
export function close<TData>(
  input: CloseInput<TData>,
): TaskOperationResult<TData> {
  const { task, definition } = input;

  const taskStatus = validateTaskStatus(task, definition, {
    taskClosed: CoreMessages.taskClosed,
    currentStatusNotFound: CoreMessages.currentStatusNotFound,
  });

  if (taskStatus.error !== undefined) {
    return taskOperationFailure([taskStatus.error]);
  }

  const { currentStatusIndex } = taskStatus;

  const finalStatusIndex = definition.statuses.length - 1;

  if (currentStatusIndex !== finalStatusIndex) {
    return taskOperationFailure([CoreMessages.finalStatusRequired]);
  }

  return taskOperationSuccess({
    ...task,
    lifecycleState: "closed",
  });
}
