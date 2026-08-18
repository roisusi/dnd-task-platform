import { developmentWorkflow } from './development.workflow';
import { procurementWorkflow } from './procurement.workflow';
import { productOrderWorkflow } from './product-order.workflow';

/**
 * Connects each workflow key stored in the tasks table to its executable
 * TypeScript definition. Adding a task type requires adding its definition
 * here, while the generic task operations remain unchanged.
 */
export const workflowRegistry = {
  procurement: procurementWorkflow,
  development: developmentWorkflow,
  'product-order': productOrderWorkflow,
} as const;

/** Every workflow key currently supported by the API. */
export type WorkflowKey = keyof typeof workflowRegistry;

/**
 * Finds the executable definition registered for a persisted workflow key.
 * The return type is the exact union of the definitions in the registry, so
 * every individual workflow retains its strongly typed validation functions.
 */
export function findWorkflowDefinition(
  workflowKey: string,
): (typeof workflowRegistry)[WorkflowKey] | undefined {
  if (!Object.hasOwn(workflowRegistry, workflowKey)) {
    return undefined;
  }

  return workflowRegistry[workflowKey as WorkflowKey];
}
