import {
  taskOperationFailure,
  type TaskOperationResult,
  taskOperationSuccess,
} from "../task-operation-result";
import { CoreMessages } from "../../errors";
import { validateStatusData } from "../validate-status-data";
import { type CreateInput } from "./create-input";

/**
 * Creates an open task at the initial status of a workflow definition.
 *
 * The consuming server supplies the task identifier and persists the result.
 * The engine verifies the generic identifiers, validates the initial-status
 * data and copies the definition key into the new task as its workflow key.
 *
 * @typeParam TData - The consumer-owned task-data shape.
 * @param input - Identifier, definition, initial data and assignee.
 * @returns The new task on success, or workflow messages on failure.
 */
export function create<TData>(
  input: CreateInput<TData>,
): TaskOperationResult<TData> {
  const { taskId, definition, data, initialAssignedUserId } = input;

  if (taskId.trim().length === 0) {
    return taskOperationFailure([CoreMessages.taskIdRequired]);
  }

  if (definition.key.trim().length === 0) {
    return taskOperationFailure([CoreMessages.workflowKeyRequired]);
  }

  if (initialAssignedUserId.trim().length === 0) {
    return taskOperationFailure([CoreMessages.initialAssigneeRequired]);
  }

  const initialStatus = definition.statuses.find(
    ({ status }) => status === definition.initialStatus,
  );

  if (initialStatus === undefined) {
    return taskOperationFailure([CoreMessages.initialStatusNotFound]);
  }

  const validationMessages = validateStatusData(initialStatus, data);

  if (validationMessages.length > 0) {
    return taskOperationFailure(validationMessages);
  }

  return taskOperationSuccess({
    id: taskId,
    workflowKey: definition.key,
    status: initialStatus.status,
    lifecycleState: "open",
    assignedUserId: initialAssignedUserId,
    data,
  });
}
