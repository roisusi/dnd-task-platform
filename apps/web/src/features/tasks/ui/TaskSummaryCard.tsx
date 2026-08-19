import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import type { Task } from '@model/task.model'
import { getUserName } from '../data/demo-users.data'
import {
  getTaskTitle,
  workflowDefinitions,
} from '../data/workflow-stages.data'

interface TaskSummaryCardProps {
  task: Task
  onBackToTasks: () => void
  onCreateNew: () => void
}

/** Navigation and metadata shown beside an active workflow. */
export const TaskSummaryCard = ({
  task,
  onBackToTasks,
  onCreateNew,
}: TaskSummaryCardProps) => {
  const assignedUser = getUserName(task.assignedUserId)

  return (
    <Card
      elevation={0}
      sx={{
        width: '100%',
        boxShadow: '0 18px 55px rgba(43, 48, 105, 0.12)',
      }}
    >
      <CardContent sx={{ p: 3.5 }}>
        <Stack spacing={2.5}>
          <Button
            color="inherit"
            startIcon={<ArrowBackRoundedIcon />}
            onClick={onBackToTasks}
            sx={{ alignSelf: 'flex-start', px: 0 }}
          >
            Back to tasks
          </Button>

          <div>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              Task Flow
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Current task
            </Typography>
            <Typography variant="h6" sx={{ mt: 0.5 }}>
              {getTaskTitle(task)}
            </Typography>
          </div>

          <div>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Workflow
            </Typography>
            <Typography>{workflowDefinitions[task.workflowKey].label}</Typography>
          </div>

          <Chip
            sx={{ alignSelf: 'flex-start' }}
            label={task.lifecycleState === 'open' ? 'Open' : 'Closed'}
            color={task.lifecycleState === 'open' ? 'success' : 'default'}
          />

          <Divider />

          <div>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Assigned to
            </Typography>
            <Stack
              direction="row"
              spacing={1.25}
              sx={{ alignItems: 'center', mt: 1 }}
            >
              <Avatar sx={{ width: 34, height: 34, bgcolor: 'primary.main' }}>
                {assignedUser.charAt(0)}
              </Avatar>
              <Typography sx={{ fontWeight: 600 }}>{assignedUser}</Typography>
            </Stack>
          </div>

          <div>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Updated
            </Typography>
            <Typography>{new Date(task.updatedAt).toLocaleString()}</Typography>
          </div>

          <Divider />

          <Button
            variant="outlined"
            startIcon={<AddCircleOutlineRoundedIcon />}
            onClick={onCreateNew}
          >
            Create new task
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
}
