import { type WorkflowMessage } from "../errors";
import { type Task } from "../models";

/**
 * Contains either the advanced task or messages explaining why Next failed.
 *
 * A successful result contains a task and an empty messages array. A failed
 * result contains `null` as the task and one or more workflow messages.
 *
 * @typeParam TData - The consumer-owned task-data shape.
 *
 * @example
 * ```ts
 * const success: NextResult<ApprovalData> = {
 *   task: advancedTask,
 *   messages: [],
 * };
 *
 * const failure: NextResult<ApprovalData> = {
 *   task: null,
 *   messages: [{
 *     code: "APPROVAL_REQUIRED",
 *     message: "Approval is required before continuing.",
 *   }],
 * };
 * ```
 */
export interface NextResult<TData> {
  /** The new task state, or `null` when the operation failed. */
  task: Task<TData> | null;

  /** Messages explaining why the operation failed; empty on success. */
  messages: WorkflowMessage[];
}
