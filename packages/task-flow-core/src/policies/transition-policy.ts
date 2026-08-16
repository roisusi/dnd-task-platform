import { type Task } from "../models";

/**
 * Decides whether a task may move to a requested workflow status.
 */
export type TransitionPolicy<TData> = (
  task: Task<TData>,
  toStatus: number,
) => boolean;
