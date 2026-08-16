import { type StatusDefinition } from "./status-definition";

/**
 * Describes a complete workflow configuration supplied by a consuming application.
 *
 * The generic engine uses this definition to discover the available statuses,
 * their order, the initial status and the validation rules attached to each
 * status. The definition contains no concrete workflow logic owned by the
 * core package.
 *
 * Adding another workflow requires the consumer to create another object that
 * implements this interface; it does not require changing the generic engine.
 *
 * @typeParam TData - The consumer-owned data stored in each task for this workflow.
 *
 * @example
 * ```ts
 * interface ApprovalData {
 *   isApproved: boolean;
 * }
 *
 * const approvalWorkflow: WorkflowDefinition<ApprovalData> = {
 *   key: "approval-v1",
 *   initialStatus: 0,
 *   statuses: [
 *     {
 *       status: 0,
 *       name: "Created",
 *       validations: [],
 *     },
 *     {
 *       status: 1,
 *       name: "Approval",
 *       validations: [{
 *         validate: (data) => data.isApproved,
 *         issue: {
 *           code: "APPROVAL_REQUIRED",
 *           message: "Approval is required before continuing.",
 *         },
 *       }],
 *     },
 *     {
 *       status: 2,
 *       name: "Completed",
 *       validations: [],
 *     },
 *   ],
 * };
 * ```
 */
export interface WorkflowDefinition<TData> {
  /** A stable key that identifies this workflow definition to the consumer. */
  key: string;

  /** The numeric status assigned to a newly created task. */
  initialStatus: number;

  /**
   * All statuses recognized by this workflow, ordered from first to last.
   * The engine uses this order to resolve the next and previous statuses.
   */
  statuses: readonly StatusDefinition<TData>[];

}
