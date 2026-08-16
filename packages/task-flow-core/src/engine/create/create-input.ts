import { type WorkflowDefinition } from "../../definitions";
import { type WorkflowMessage } from "../../errors";

/** Contains consumer-defined messages for generic Create failures. */
export interface CreateMessages {
  /** Returned when the supplied task identifier is empty. */
  taskIdRequired: WorkflowMessage;

  /** Returned when the workflow definition key is empty. */
  workflowKeyRequired: WorkflowMessage;

  /** Returned when the configured initial status is absent from the definition. */
  initialStatusNotFound: WorkflowMessage;

  /** Returned when the initial assigned-user identifier is empty. */
  initialAssigneeRequired: WorkflowMessage;
}

/**
 * Contains the information required to create a generic workflow task.
 *
 * The consuming server supplies the identifier and later persists the returned
 * task. The core initializes the workflow state but does not access a database.
 *
 * @typeParam TData - The consumer-owned task-data shape.
 */
export interface CreateInput<TData> {
  /** The task identifier generated or obtained by the consuming server. */
  taskId: string;

  /** The workflow definition used to initialize the task. */
  definition: WorkflowDefinition<TData>;

  /** The complete task-specific data stored on the new task. */
  data: TData;

  /** The user who owns the task when it is created. */
  initialAssignedUserId: string;

  /** Consumer-defined messages for generic Create failures. */
  messages: CreateMessages;
}
