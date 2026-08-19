import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { tasksApi } from '@api/tasks/tasks.queries'
import { ErrorDialog } from '@components/ErrorDialog'
import { useCurrentUser } from '@providers/CurrentUserProvider'
import { TaskList } from '../ui/TaskList'

/**
 * Provides the complete routed feature for viewing a user's assigned tasks.
 *
 * It loads tasks through TanStack Query, handles loading and API failures,
 * redirects an empty user to task creation and composes the reusable TaskList.
 *
 * @returns The assigned-task feature or a redirect to task creation.
 */
export const TaskListPage = () => {
  const navigate = useNavigate()
  const { currentUserId } = useCurrentUser()
  const assignedTasks = tasksApi.useAssignedTasks(currentUserId)
  const [errorOpen, setErrorOpen] = useState(true)
  const tasks = assignedTasks.data ?? []

  if (assignedTasks.isSuccess && tasks.length === 0) {
    return <Navigate to="/tasks/new" replace />
  }

  return (
    <>
      <TaskList
        tasks={tasks}
        isLoading={assignedTasks.isLoading}
        onCreateNew={() => void navigate('/tasks/new')}
        onSelectTask={(task) => void navigate(`/tasks/${task.id}`)}
      />

      <ErrorDialog
        error={errorOpen ? assignedTasks.error : undefined}
        onClose={() => setErrorOpen(false)}
      />
    </>
  )
}
