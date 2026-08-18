import { type WorkflowDefinition } from '@dnb/task-flow-core';

/** A price proposal submitted by one supplier. */
export interface ProductBid {
  supplierName: string;
  price: number;
}

/** Data collected while a product order moves through its workflow. */
export interface ProductOrderTaskData extends Record<string, unknown> {
  productName?: string;
  bids?: readonly ProductBid[];
  selectedSupplierName?: string;
  supervisorApproved?: boolean;
  orderReference?: string;
}

/**
 * Defines the five statuses of the additional Product Order workflow.
 * This third definition demonstrates that the generic core can support a new
 * task type without changing the core engine or its workflow contracts.
 */
export const productOrderWorkflow: WorkflowDefinition<ProductOrderTaskData> = {
  key: 'product-order',
  initialStatus: 1,
  statuses: [
    {
      status: 1,
      name: 'Product specified',
      validations: [
        {
          validate: ({ productName }) =>
            productName !== undefined && productName.trim().length > 0,
          issue: {
            code: 'PRODUCT_NAME_REQUIRED',
            message: 'A product name is required.',
          },
        },
      ],
    },
    {
      status: 2,
      name: 'Supplier bids received',
      validations: [
        {
          validate: ({ bids }) =>
            bids !== undefined &&
            bids.length > 0 &&
            bids.every(
              ({ supplierName, price }) =>
                supplierName.trim().length > 0 && price >= 0,
            ),
          issue: {
            code: 'VALID_SUPPLIER_BIDS_REQUIRED',
            message: 'At least one valid supplier bid is required.',
          },
        },
      ],
    },
    {
      status: 3,
      name: 'Supplier selected',
      validations: [
        {
          validate: ({ bids, selectedSupplierName }) =>
            selectedSupplierName !== undefined &&
            selectedSupplierName.trim().length > 0 &&
            bids?.some(
              ({ supplierName }) => supplierName === selectedSupplierName,
            ) === true,
          issue: {
            code: 'SUPPLIER_SELECTION_REQUIRED',
            message: 'The selected supplier must exist in the submitted bids.',
          },
        },
      ],
    },
    {
      status: 4,
      name: 'Supervisor approved',
      validations: [
        {
          validate: ({ supervisorApproved }) => supervisorApproved === true,
          issue: {
            code: 'SUPERVISOR_APPROVAL_REQUIRED',
            message: 'Supervisor approval is required.',
          },
        },
      ],
    },
    {
      status: 5,
      name: 'Order completed',
      validations: [
        {
          validate: ({ orderReference }) =>
            orderReference !== undefined && orderReference.trim().length > 0,
          issue: {
            code: 'ORDER_REFERENCE_REQUIRED',
            message: 'An order reference is required.',
          },
        },
      ],
    },
  ],
};
