import { type ValidationIssue } from "./validation-issue";

/**
 * Contains the problems reported by task-data validation.
 *
 * An empty array means the data is valid. One or more issues mean validation
 * failed and the workflow operation must not continue.
 *
 * @example
 * ```ts
 * const success: ValidationResult = [];
 *
 * const failure: ValidationResult = [{
 *     code: "APPROVAL_REQUIRED",
 *     message: "The task must be approved before continuing.",
 * }];
 * ```
 */
export type ValidationResult = readonly ValidationIssue[];
