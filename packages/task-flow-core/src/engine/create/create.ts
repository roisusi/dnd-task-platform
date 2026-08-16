import { type TaskOperationResult } from "../task-operation-result";
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
 * @param input - Identifier, definition, initial data, assignee and messages.
 * @returns The new task on success, or workflow messages on failure.
 */
export function create<TData>(
  input: CreateInput<TData>,
): TaskOperationResult<TData> {
  const { taskId, definition, data, initialAssignedUserId, messages } = input;

  if (taskId.trim().length === 0) {
    return { task: null, messages: [messages.taskIdRequired] };
  }

  if (definition.key.trim().length === 0) {
    return { task: null, messages: [messages.workflowKeyRequired] };
  }

  if (initialAssignedUserId.trim().length === 0) {
    return { task: null, messages: [messages.initialAssigneeRequired] };
  }

  const initialStatus = definition.statuses.find(
    ({ status }) => status === definition.initialStatus,
  );

  if (initialStatus === undefined) {
    return { task: null, messages: [messages.initialStatusNotFound] };
  }

  const validationMessages = validateStatusData(initialStatus, data);

  if (validationMessages.length > 0) {
    return { task: null, messages: validationMessages };
  }

  return {
    task: {
      id: taskId,
      workflowKey: definition.key,
      status: initialStatus.status,
      lifecycleState: "open",
      assignedUserId: initialAssignedUserId,
      data,
    },
    messages: [],
  };
}
