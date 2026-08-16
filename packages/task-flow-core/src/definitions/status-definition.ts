import { type ValidationRule } from "../validation";

/**
 * Describes one status in a consumer-defined workflow.
 *
 * Each status owns the validation rules that must pass before a task can enter
 * that status during a forward move. Backward moves do not run these rules.
 *
 * @typeParam TData - The consumer-owned task-data shape validated by the rules.
 *
 * @example
 * ```ts
 * interface ApprovalData {
 *   approvals: readonly string[];
 * }
 *
 * const approvalStatus: StatusDefinition<ApprovalData> = {
 *   status: 2,
 *   name: "Approvals",
 *   validations: [{
 *     validate: (data) => data.approvals.length >= 2,
 *     issue: {
 *       code: "TWO_APPROVALS_REQUIRED",
 *       message: "Two approvals are required before continuing.",
 *     },
 *   }],
 * };
 * ```
 */
export interface StatusDefinition<TData> {
  status: number;
  name: string;
  validations: readonly ValidationRule<TData>[];
}
