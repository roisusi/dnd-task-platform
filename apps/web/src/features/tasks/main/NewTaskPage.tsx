import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import { useNavigate } from 'react-router-dom'
import { tasksApi } from '@api/tasks/tasks.queries'
import { useCurrentUser } from '@providers/CurrentUserProvider'
import { CreateTaskCard } from '../ui/CreateTaskCard'

/**
 * Provides the complete routed feature for creating a task.
 *
 * It loads the current user context, determines whether a back-navigation
 * action is needed and composes the reusable CreateTaskCard UI.
 *
 * @returns The complete new-task feature rendered by the router.
 */
export const NewTaskPage = () => {
  const navigate = useNavigate()
  const { currentUserId } = useCurrentUser()
  const assignedTasks = tasksApi.useAssignedTasks(currentUserId)
  const hasTasks = (assignedTasks.data?.length ?? 0) > 0

  return (
    <Stack spacing={3} sx={{ alignItems: 'center' }}>
      {hasTasks && (
        <Button
          color="inherit"
          startIcon={<ArrowBackRoundedIcon />}
          onClick={() => void navigate('/')}
        >
          Back to tasks
        </Button>
      )}

      <Box
        sx={{
          width: '100%',
          minHeight: { xs: 520, md: 620 },
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <CreateTaskCard
          currentUserId={currentUserId}
          onCreated={(task) => void navigate(`/tasks/${task.id}`)}
        />
      </Box>
    </Stack>
  )
}
