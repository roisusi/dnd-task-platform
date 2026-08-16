import { type ValidationIssue } from "./validation-issue";

/** Describes a successful validation with no reported problems. */
export interface ValidationSuccess {
  isValid: true;
  issues: readonly [];
}

/** Describes a failed validation containing <strong>at least one</strong> problem. */
export interface ValidationFailure {
  isValid: false;
  issues: readonly [ValidationIssue, ...ValidationIssue[]];
}

/**
 * Represents either a successful validation or a failed validation with issues.
 *
 * The `isValid` property lets TypeScript identify which result was returned.
 *
 * @example
 * ```ts
 * const success: ValidationResult = {
 *   isValid: true,
 *   issues: [],
 * };
 *
 * const failure: ValidationResult = {
 *   isValid: false,
 *   issues: [{
 *     code: "APPROVAL_REQUIRED",
 *     message: "The task must be approved before continuing.",
 *   }],
 * };
 * ```
 */
export type ValidationResult = ValidationSuccess | ValidationFailure;
