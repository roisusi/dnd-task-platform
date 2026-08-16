import { LifecycleStateType } from "./lifecycle-state";

export interface Task<TData> {
  data: TData; //Data of the Task
  status: LifecycleStateType;
  id: string;
  workflowDefinitionId: string; //what
  assignedUserId: string; //use assign id
}
