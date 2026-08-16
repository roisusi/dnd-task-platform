import { type WorkflowDefinition } from "../../definitions";
import { type WorkflowMessage } from "../../errors";
import { type Task } from "../../models";

/** Contains consumer-defined messages for generic Close failures. */
export interface CloseMessages {
  /** Returned when the task is already closed and therefore immutable. */
  taskAlreadyClosed: WorkflowMessage;

  /** Returned when the task's current status is absent from the definition. */
  currentStatusNotFound: WorkflowMessage;

  /** Returned when the task has not reached the final workflow status. */
  finalStatusRequired: WorkflowMessage;
}

/**
 * Contains the information required to close a generic workflow task.
 *
 * @typeParam TData - The consumer-owned task-data shape.
 */
export interface CloseInput<TData> {
  /** The current task state loaded by the consuming server. */
  task: Task<TData>;

  /** The ordered workflow definition used to identify the final status. */
  definition: WorkflowDefinition<TData>;

  /** Consumer-defined messages for generic Close failures. */
  messages: CloseMessages;
}
