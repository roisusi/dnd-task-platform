import { type WorkflowDefinition } from "../../definitions";
import { type Task } from "../../models";

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

}
