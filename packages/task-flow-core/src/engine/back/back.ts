import { type BackInput } from "./back-input";
import { type TaskOperationResult } from "../task-operation-result";

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

  if (task.lifecycleState === "closed") {
    return {
      task: null,
      messages: [messages.taskClosed],
    };
  }

  const currentStatusIndex = definition.statuses.findIndex(
    ({ status }) => status === task.status,
  );

  if (currentStatusIndex === -1) {
    return {
      task: null,
      messages: [messages.currentStatusNotFound],
    };
  }

  const destinationStatus = definition.statuses[currentStatusIndex - 1];

  if (destinationStatus === undefined) {
    return {
      task: null,
      messages: [messages.initialStatusReached],
    };
  }

  if (previousAssignedUserId.trim().length === 0) {
    return {
      task: null,
      messages: [messages.previousAssigneeRequired],
    };
  }

  return {
    task: {
      ...task,
      status: destinationStatus.status,
      lifecycleState: "open",
      assignedUserId: previousAssignedUserId,
    },
    messages: [],
  };
}
