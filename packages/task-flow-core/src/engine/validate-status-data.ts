import { type StatusDefinition } from "../definitions";
import { type WorkflowMessage } from "../errors";

/** Runs every validation rule of a status and returns all failures in order. */
export function validateStatusData<TData>(
  status: StatusDefinition<TData>,
  data: TData,
): WorkflowMessage[] {
  return status.validations
    .filter(({ validate }) => !validate(data))
    .map(({ issue }) => issue);
}
