import { type WorkflowDefinition } from "../../definitions";
import { type Task } from "../../models";

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

}
