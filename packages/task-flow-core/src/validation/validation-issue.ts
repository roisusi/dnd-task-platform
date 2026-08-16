import { type WorkflowMessage } from "../errors";

/**
 * Represents a workflow message reported by task-data validation.
 *
 * @example
 * ```ts
 * const issue: ValidationIssue = {
 *   code: "APPROVAL_REQUIRED",
 *   message: "The task must be approved before continuing.",
 * };
 * ```
 */
export type ValidationIssue = WorkflowMessage;
