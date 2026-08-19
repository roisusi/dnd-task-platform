import { api } from '@api/api'
import type {
  BackTaskRequest,
  CloseTaskRequest,
  CreateTaskRequest,
  NextTaskRequest,
  Task,
} from '@model/task.model'

/** Axios-only functions for the task endpoints exposed by NestJS. */
export const tasksService = {
  getTask: async (taskId: string): Promise<Task> => {
    const response = await api.get<Task>(`/tasks/${taskId}`)
    return response.data
  },

  getAssignedTasks: async (userId: string): Promise<Task[]> => {
    const response = await api.get<Task[]>(
      `/tasks/assigned/${encodeURIComponent(userId)}`,
    )
    return response.data
  },

  createTask: async (request: CreateTaskRequest): Promise<Task> => {
    const response = await api.post<Task>('/tasks', request)
    return response.data
  },

  nextTask: async ({
    taskId,
    currentUserId,
    ...body
  }: NextTaskRequest): Promise<Task> => {
    const response = await api.post<Task>(`/tasks/${taskId}/next`, body, {
      headers: { 'x-user-id': currentUserId },
    })
    return response.data
  },

  backTask: async ({
    taskId,
    currentUserId,
    previousAssignedUserId,
  }: BackTaskRequest): Promise<Task> => {
    const response = await api.post<Task>(
      `/tasks/${taskId}/back`,
      { previousAssignedUserId },
      { headers: { 'x-user-id': currentUserId } },
    )
    return response.data
  },

  closeTask: async ({
    taskId,
    currentUserId,
  }: CloseTaskRequest): Promise<Task> => {
    const response = await api.post<Task>(
      `/tasks/${taskId}/close`,
      undefined,
      { headers: { 'x-user-id': currentUserId } },
    )
    return response.data
  },
}
