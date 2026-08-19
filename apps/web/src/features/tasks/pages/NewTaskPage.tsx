import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import { Box, Button, Stack } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { tasksApi } from '@api/tasks/tasks.queries'
import { useCurrentUser } from '@providers/CurrentUserProvider'
import { CreateTaskCard } from '../CreateTaskCard'

/** Route page for selecting a workflow and creating its initial task. */
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
