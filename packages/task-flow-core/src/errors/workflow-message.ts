/**
 * Describes a framework-independent message returned by workflow operations.
 *
 * The consuming application owns the available codes and message text. The
 * core package only defines the common shape used to return them.
 *
 * @example
 * ```ts
 * const message: WorkflowMessage = {
 *   code: "VALIDATION_FAILED",
 *   message: "The task data is not valid for this operation.",
 * };
 * ```
 */
export interface WorkflowMessage {
  /** A consumer-defined machine-readable message code. */
  code: string;

  /** A consumer-defined human-readable message. */
  message: string;
}
