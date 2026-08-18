import { type WorkflowDefinition } from "../../definitions";
import { type Task } from "../../models";

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

}
