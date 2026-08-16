import { type WorkflowDefinition } from "../../definitions";
import { type WorkflowMessage } from "../../errors";
import { type Task } from "../../models";

/** Contains consumer-defined messages for generic Back failures. */
export interface BackMessages {
  /** Returned when a closed task cannot be changed. */
  taskClosed: WorkflowMessage;

  /** Returned when the task's current status is absent from the definition. */
  currentStatusNotFound: WorkflowMessage;

  /** Returned when the task is already at the first workflow status. */
  initialStatusReached: WorkflowMessage;

  /** Returned when the assigned-user identifier for the previous status is empty. */
  previousAssigneeRequired: WorkflowMessage;
}

/**
 * Contains the information required to move a task one workflow status back.
 *
 * The consuming server loads the task and supplies the user who will own it
 * after the move. Back preserves the task data and does not run validations.
 *
 * @typeParam TData - The consumer-owned task-data shape.
 */
export interface BackInput<TData> {
  /** The current task state loaded by the consuming server. */
  task: Task<TData>;

  /** The ordered workflow definition that contains the previous status. */
  definition: WorkflowDefinition<TData>;

  /** The user who will own the task after it moves backward. */
  previousAssignedUserId: string;

  /** Consumer-defined messages for generic Back failures. */
  messages: BackMessages;
}
