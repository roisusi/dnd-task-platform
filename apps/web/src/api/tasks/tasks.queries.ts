import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { tasksService } from './tasks.service'

const taskQueryKeys = {
  detail: (taskId: string) => ['tasks', 'detail', taskId] as const,
  assignedRoot: ['tasks', 'assigned'] as const,
  assigned: (userId: string) => ['tasks', 'assigned', userId] as const,
}

/**
 * Loads one task from the API by its identifier and stores it in the
 * TanStack Query cache. The request runs only when `taskId` is not empty.
 */
const useTask = (taskId: string) => {
  return useQuery({
    queryKey: taskQueryKeys.detail(taskId),
    queryFn: () => tasksService.getTask(taskId),
    enabled: taskId.length > 0,
  })
}

/**
 * Loads all tasks currently assigned to the selected user.
 * The request runs only when `userId` is not empty.
 */
const useAssignedTasks = (userId: string) => {
  return useQuery({
    queryKey: taskQueryKeys.assigned(userId),
    queryFn: () => tasksService.getAssignedTasks(userId),
    enabled: userId.length > 0,
  })
}

/** Creates a task and refreshes the assigned-task cache after success. */
const useTaskCreate = () => {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: tasksService.createTask,
    onSuccess: async (task) => {
      queryClient.setQueryData(taskQueryKeys.detail(task.id), task)
      await queryClient.invalidateQueries({
        queryKey: taskQueryKeys.assignedRoot,
      })
    },
  })

  return {
    taskCreate: mutation.mutate,
    loading: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  }
}

/** Moves a task forward and refreshes its cached data after success. */
const useTaskNext = () => {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: tasksService.nextTask,
    onSuccess: async (task) => {
      queryClient.setQueryData(taskQueryKeys.detail(task.id), task)
      await queryClient.invalidateQueries({
        queryKey: taskQueryKeys.assignedRoot,
      })
    },
  })

  return {
    taskNext: mutation.mutate,
    loading: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  }
}

/** Moves a task backward and refreshes its cached data after success. */
const useTaskBack = () => {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: tasksService.backTask,
    onSuccess: async (task) => {
      queryClient.setQueryData(taskQueryKeys.detail(task.id), task)
      await queryClient.invalidateQueries({
        queryKey: taskQueryKeys.assignedRoot,
      })
    },
  })

  return {
    taskBack: mutation.mutate,
    loading: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  }
}

/** Closes a task and refreshes its cached data after success. */
const useTaskClose = () => {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: tasksService.closeTask,
    onSuccess: async (task) => {
      queryClient.setQueryData(taskQueryKeys.detail(task.id), task)
      await queryClient.invalidateQueries({
        queryKey: taskQueryKeys.assignedRoot,
      })
    },
  })

  return {
    taskClose: mutation.mutate,
    loading: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  }
}

/** TanStack Query hooks belonging to the Tasks API service. */
export const tasksApi = {
  useTask,
  useAssignedTasks,
  useTaskCreate,
  useTaskNext,
  useTaskBack,
  useTaskClose,
}
