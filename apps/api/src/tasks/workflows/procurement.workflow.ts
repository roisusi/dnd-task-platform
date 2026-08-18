import { type WorkflowDefinition } from '@dnb/task-flow-core';

/** Data collected while a procurement task moves through its workflow. */
export interface ProcurementTaskData extends Record<string, unknown> {
  priceQuotes?: readonly string[];
  receipt?: string;
}

/**
 * Defines the statuses and data requirements of the Procurement workflow.
 * The generic core engine reads this object without knowing the task type.
 */
export const procurementWorkflow: WorkflowDefinition<ProcurementTaskData> = {
  key: 'procurement',
  initialStatus: 1,
  statuses: [
    {
      status: 1,
      name: 'Created',
      validations: [],
    },
    {
      status: 2,
      name: 'Supplier offers received',
      validations: [
        {
          validate: ({ priceQuotes }) =>
            priceQuotes?.length === 2 &&
            priceQuotes.every((quote) => quote.trim().length > 0),
          issue: {
            code: 'TWO_PRICE_QUOTES_REQUIRED',
            message: 'Exactly two non-empty price quotes are required.',
          },
        },
      ],
    },
    {
      status: 3,
      name: 'Purchase completed',
      validations: [
        {
          validate: ({ receipt }) =>
            receipt !== undefined && receipt.trim().length > 0,
          issue: {
            code: 'RECEIPT_REQUIRED',
            message: 'A receipt is required.',
          },
        },
      ],
    },
  ],
};
