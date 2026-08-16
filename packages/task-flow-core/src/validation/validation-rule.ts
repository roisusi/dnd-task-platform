import { type ValidationIssue } from "./validation-issue";

/**
 * Describes one reusable validation rule for consumer-owned task data.
 *
 * The engine evaluates `validate`. When it returns `false`, the engine adds
 * `issue` to the failed validation result.
 *
 * @typeParam TData - The consumer-owned task-data shape.
 *
 * @example
 * ```ts
 * interface ApprovalData {
 *   approvals: readonly string[];
 * }
 *
 * const twoApprovalsRequired: ValidationRule<ApprovalData> = {
 *   validate: (data) => data.approvals.length >= 2,
 *   issue: {
 *     code: "TWO_APPROVALS_REQUIRED",
 *     message: "Two approvals are required before continuing.",
 *   },
 * };
 * ```
 */
export interface ValidationRule<TData> {
  /** Returns `true` when the task data satisfies this rule. */
  validate: (data: TData) => boolean;

  /** Describes the problem returned when `validate` returns `false`. */
  issue: ValidationIssue;
}
