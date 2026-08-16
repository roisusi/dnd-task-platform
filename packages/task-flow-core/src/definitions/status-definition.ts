/**
 * Describes one status in a consumer-defined workflow.
 */
export interface StatusDefinition {
  status: number;
  name: string;
  canClose: boolean;
}
