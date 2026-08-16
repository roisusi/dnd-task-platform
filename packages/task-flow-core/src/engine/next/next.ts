import { type NextInput } from "./next-input";
import { type TaskOperationResult } from "../task-operation-result";
import { validateStatusMove } from "../status-move-validation";

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
 * next assigned user and consumer-defined failure messages.
 *
 * @returns The advanced task on success, or workflow messages on failure.
 */
export function next<TData>(input: NextInput<TData>): TaskOperationResult<TData> {
  const { task, definition, data, nextAssignedUserId, messages } = input;

  const statusMove = validateStatusMove(
    task,
    definition,
    1,
    {
      taskClosed: messages.taskClosed,
      currentStatusNotFound: messages.currentStatusNotFound,
      workflowEdgeReached: messages.finalStatusReached,
    },
  );

  if (statusMove.error !== undefined) {
    return {
      task: null,
      messages: [statusMove.error],
    };
  }

  const { destinationStatus } = statusMove;

  //check all the validation rules that the server have entered, can be more than 1 and return the issues
  const validationMessages = destinationStatus.validations
    .filter(({ validate }) => !validate(data))
    .map(({ issue }) => issue);

  //stop the next if that is a validation error
  if (validationMessages.length > 0) {
    return {
      task: null,
      messages: validationMessages,
    };
  }

  //stop the next id no user assignment entered
  if (nextAssignedUserId.trim().length === 0) {
    return {
      task: null,
      messages: [messages.nextAssigneeRequired],
    };
  }

  return {
    task: {
      ...task,
      status: destinationStatus.status,
      lifecycleState: "open", //cant be closed because "closed" is a user action
      assignedUserId: nextAssignedUserId,
      data,
    },
    messages: [],
  };
}
