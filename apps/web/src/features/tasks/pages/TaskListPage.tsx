import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { tasksApi } from '@api/tasks/tasks.queries'
import { ErrorDialog } from '@components/ErrorDialog'
import { useCurrentUser } from '@providers/CurrentUserProvider'
import { TaskList } from '../TaskList'

/** Loads and displays the tasks assigned to the current user. */
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
