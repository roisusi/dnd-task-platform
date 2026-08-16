import { type Task } from "../models";

/**
 * Resolves the user who should own a task at the requested workflow status.
 */
export type AssigneePolicy<TData> = (
  task: Task<TData>,
  toStatus: number,
) => string;
