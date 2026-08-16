import { type Task } from "../models";

/**
 * Decides whether a task may be closed in its current state.
 */
export type ClosurePolicy<TData> = (task: Task<TData>) => boolean;
