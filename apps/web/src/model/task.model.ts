export type WorkflowKey = 'procurement' | 'development' | 'product-order'

export type LifecycleState = 'open' | 'closed'

/** Task data returned by the Tasks API. */
export interface Task {
  id: string
  workflowKey: WorkflowKey
  status: number
  lifecycleState: LifecycleState
  assignedUserId: string
  data: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

/** Request body used to create a task. */
export interface CreateTaskRequest {
  workflowKey: WorkflowKey
  assignedUserId: string
  data: Record<string, unknown>
}

/** Request data used to move a task to its next status. */
export interface NextTaskRequest {
  taskId: string
  currentUserId: string
  nextAssignedUserId: string
  data: Record<string, unknown>
}

/** Request data used to move a task to its previous status. */
export interface BackTaskRequest {
  taskId: string
  currentUserId: string
  previousAssignedUserId: string
}

/** Request data used to close a task. */
export interface CloseTaskRequest {
  taskId: string
  currentUserId: string
}
