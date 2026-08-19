import { Box, CircularProgress, Stack } from '@mui/material'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { tasksApi } from '@api/tasks/tasks.queries'
import type { Task } from '@model/task.model'
import { ErrorDialog } from '@components/ErrorDialog'
import { useCurrentUser } from '@providers/CurrentUserProvider'
import { TaskSummaryCard } from '../ui/TaskSummaryCard'
import { WorkflowCard } from '../ui/WorkflowCard'

/**
 * Provides the complete routed feature for continuing or viewing one task.
 *
 * It reads the task identifier from the URL, reloads the persisted task,
 * handles loading and errors, and composes reusable summary and workflow UI.
 *
 * @returns The active task feature for the task selected by the route.
 */
export const TaskPage = () => {
  const navigate = useNavigate()
  const { taskId = '' } = useParams()
  const { currentUserId, setCurrentUserId } = useCurrentUser()
  const taskQuery = tasksApi.useTask(taskId)
  const [errorOpen, setErrorOpen] = useState(true)

  const taskChanged = (task: Task) => {
    setCurrentUserId(task.assignedUserId)
  }

  if (taskQuery.isLoading) {
    return (
      <Stack
        sx={{ minHeight: 500, alignItems: 'center', justifyContent: 'center' }}
      >
        <CircularProgress />
      </Stack>
    )
  }

  if (!taskQuery.data) {
    return (
      <>
        <Box sx={{ minHeight: 420 }} />
        <ErrorDialog
          error={errorOpen ? taskQuery.error : undefined}
          onClose={() => {
            setErrorOpen(false)
            void navigate('/')
          }}
        />
      </>
    )
  }

  const task = taskQuery.data

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '290px minmax(0, 1fr)' },
        alignItems: 'start',
        gap: 3,
      }}
    >
      <TaskSummaryCard
        task={task}
        onBackToTasks={() => void navigate('/')}
        onCreateNew={() => void navigate('/tasks/new')}
      />
      <WorkflowCard
        key={`${task.id}-${task.status}-${task.lifecycleState}`}
        task={task}
        currentUserId={currentUserId}
        onTaskChanged={taskChanged}
      />
    </Box>
  )
}
