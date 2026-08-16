import { type LifecycleStateType } from "./lifecycle-state";

export interface Task<TData> {
  data: TData; //Data of the Task
  status: number; //step in the process
  lifecycleState: LifecycleStateType;
  id: string;
  assignedUserId: string; //use assign id
}
