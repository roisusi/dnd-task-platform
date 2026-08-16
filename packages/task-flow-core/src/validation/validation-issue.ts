/**
 * Describes one validation problem found in consumer-owned task data.
 *
 * @example
 * ```ts
 * const issue: ValidationIssue = {
 *   code: "APPROVAL_REQUIRED",
 *   message: "The task must be approved before continuing.",
 * };
 * ```
 */
export interface ValidationIssue {
  /** A stable code that consumers can handle without parsing the message. */
  code: string;

  /** A human-readable explanation of the validation problem. */
  message: string;
}
