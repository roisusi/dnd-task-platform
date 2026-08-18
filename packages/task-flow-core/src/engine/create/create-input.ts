import { type WorkflowDefinition } from "../../definitions";

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

}
