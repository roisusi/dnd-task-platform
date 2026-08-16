import { type WorkflowMessage } from "../errors";
import { type Task } from "../models";

/**
 * Contains either the task produced by an engine operation or failure messages.
 *
 * Every task operation uses the same result shape: success returns a task and
 * no messages, while failure returns `null` and one or more messages.
 *
 * @typeParam TData - The consumer-owned task-data shape.
 */
export interface TaskOperationResult<TData> {
  /** The task produced by the operation, or `null` when it failed. */
  task: Task<TData> | null;

  /** Messages explaining the failure; empty on success. */
  messages: WorkflowMessage[];
}
