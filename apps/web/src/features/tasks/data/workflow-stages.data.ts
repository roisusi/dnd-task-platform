import type { Task, WorkflowKey } from '@model/task.model'
import type {
  FormValues,
  WorkflowUiDefinition,
} from '../interfaces/workflow.interface'

/**
 * Receives a form-field key and reads the value entered for that key.
 * It trims the text and returns `{ [key]: value }` for the API task data.
 */
const textValue = (name: string) => (values: FormValues) => ({
  [name]: String(values[name] ?? '').trim(),
})

/** UI field and stage metadata used to render each supported task workflow. */
export const workflowDefinitions: Record<
  WorkflowKey,
  WorkflowUiDefinition
> = {
  procurement: {
    key: 'procurement',
    label: 'Procurement',
    stages: [
      {
        status: 1,
        name: 'Created',
        fields: [
          { name: 'title', label: 'Task title', type: 'text', required: true },
        ],
        toData: textValue('title'),
      },
      {
        status: 2,
        name: 'Supplier Offers',
        fields: [
          {
            name: 'quoteOne',
            label: 'Supplier quote 1',
            type: 'text',
            required: true,
            defaultValue: (data) =>
              Array.isArray(data.priceQuotes)
                ? String(data.priceQuotes[0] ?? '')
                : '',
          },
          {
            name: 'quoteTwo',
            label: 'Supplier quote 2',
            type: 'text',
            required: true,
            defaultValue: (data) =>
              Array.isArray(data.priceQuotes)
                ? String(data.priceQuotes[1] ?? '')
                : '',
          },
        ],
        toData: (values) => ({
          priceQuotes: [
            String(values.quoteOne ?? '').trim(),
            String(values.quoteTwo ?? '').trim(),
          ],
        }),
      },
      {
        status: 3,
        name: 'Completed',
        fields: [
          { name: 'receipt', label: 'Receipt', type: 'text', required: true },
        ],
        toData: textValue('receipt'),
      },
    ],
  },
  development: {
    key: 'development',
    label: 'Development',
    stages: [
      {
        status: 1,
        name: 'Created',
        fields: [
          { name: 'title', label: 'Task title', type: 'text', required: true },
        ],
        toData: textValue('title'),
      },
      {
        status: 2,
        name: 'Specification',
        fields: [
          {
            name: 'specification',
            label: 'Specification',
            type: 'text',
            required: true,
          },
        ],
        toData: textValue('specification'),
      },
      {
        status: 3,
        name: 'Development',
        fields: [
          {
            name: 'branchName',
            label: 'Branch name',
            type: 'text',
            required: true,
          },
        ],
        toData: textValue('branchName'),
      },
      {
        status: 4,
        name: 'Distribution',
        fields: [
          {
            name: 'versionNumber',
            label: 'Version number',
            type: 'text',
            required: true,
          },
        ],
        toData: textValue('versionNumber'),
      },
    ],
  },
  'product-order': {
    key: 'product-order',
    label: 'Product Order',
    stages: [
      {
        status: 1,
        name: 'Product',
        fields: [
          {
            name: 'productName',
            label: 'Product name',
            type: 'text',
            required: true,
          },
        ],
        toData: textValue('productName'),
      },
      {
        status: 2,
        name: 'Supplier Bids',
        getCount: (data) => (Array.isArray(data.bids) ? data.bids.length : 0),
        fields: [
          {
            name: 'supplierOneName',
            label: 'Supplier 1 name',
            type: 'text',
            required: true,
          },
          {
            name: 'supplierOnePrice',
            label: 'Supplier 1 price',
            type: 'number',
            required: true,
          },
          {
            name: 'supplierTwoName',
            label: 'Supplier 2 name',
            type: 'text',
            required: true,
          },
          {
            name: 'supplierTwoPrice',
            label: 'Supplier 2 price',
            type: 'number',
            required: true,
          },
        ],
        toData: (values) => ({
          bids: [
            {
              supplierName: String(values.supplierOneName ?? '').trim(),
              price: Number(values.supplierOnePrice),
            },
            {
              supplierName: String(values.supplierTwoName ?? '').trim(),
              price: Number(values.supplierTwoPrice),
            },
          ],
        }),
      },
      {
        status: 3,
        name: 'Supplier Selected',
        fields: [
          {
            name: 'selectedSupplierName',
            label: 'Selected supplier',
            type: 'select',
            required: true,
            options: (data) =>
              Array.isArray(data.bids)
                ? data.bids.flatMap((bid) => {
                    if (
                      typeof bid === 'object' &&
                      bid !== null &&
                      'supplierName' in bid &&
                      typeof bid.supplierName === 'string' &&
                      'price' in bid &&
                      typeof bid.price === 'number'
                    ) {
                      return [
                        {
                          label: `${bid.supplierName} - ${bid.price}$`,
                          value: bid.supplierName,
                        },
                      ]
                    }
                    return []
                  })
                : [],
          },
        ],
        toData: textValue('selectedSupplierName'),
      },
      {
        status: 4,
        name: 'Supervisor Approval',
        fields: [
          {
            name: 'supervisorApproved',
            label: 'I approve this order',
            type: 'checkbox',
            required: true,
          },
        ],
        toData: (values) => ({
          supervisorApproved: values.supervisorApproved === true,
        }),
      },
      {
        status: 5,
        name: 'Completed',
        fields: [
          {
            name: 'orderReference',
            label: 'Order reference',
            type: 'text',
            required: true,
          },
        ],
        toData: textValue('orderReference'),
      },
    ],
  },
}

/** Returns the task's user-entered title or a workflow-based fallback. */
export const getTaskTitle = (task: Task): string => {
  const title = task.data.title ?? task.data.productName
  return typeof title === 'string' && title.length > 0
    ? title
    : `${workflowDefinitions[task.workflowKey].label} task`
}
