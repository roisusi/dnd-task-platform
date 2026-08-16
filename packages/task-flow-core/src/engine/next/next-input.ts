import { type WorkflowDefinition } from "../../definitions";
import { type WorkflowMessage } from "../../errors";
import { type Task } from "../../models";

/**
 * Contains consumer-defined messages for the generic failures detected by Next.
 */
export interface NextMessages {
  /** Returned when a closed task cannot be changed. */
  taskClosed: WorkflowMessage;

  /** Returned when the task's current status is absent from the definition. */
  currentStatusNotFound: WorkflowMessage;

  /** Returned when the task is already at the final status. */
  finalStatusReached: WorkflowMessage;

  /** Returned when the next assigned-user identifier is empty. */
  nextAssigneeRequired: WorkflowMessage;
}

/**
 * Contains the information required to advance a task by one workflow status.
 *
 * The consuming server loads the current task, validates that the next user
 * exists, and supplies the complete task-specific data for the destination
 * status. The core engine does not query a database.
 *
 * @typeParam TData - The consumer-owned task-data shape.
 *
 * @example
 * ```ts
 * const input: NextInput<ApprovalData> = {
 *   task,
 *   definition: approvalWorkflow,
 *   data: {
 *     isApproved: true,
 *   },
 *   nextAssignedUserId: "user-8",
 *   messages: nextMessages,
 * };
 * ```
 */
export interface NextInput<TData> {
  /** The current task state loaded by the consuming server. */
  task: Task<TData>;

  /** The workflow definition that controls the task lifecycle. */
  definition: WorkflowDefinition<TData>;

  /** The complete task-specific data to store at the destination status. */
  data: TData;

  /** The identifier of the user who will own the task after the move. */
  nextAssignedUserId: string;

  /** Consumer-defined messages for generic Next failures. */
  messages: NextMessages;
}
