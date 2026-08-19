import AddRoundedIcon from '@mui/icons-material/AddRounded'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Stack from '@mui/material/Stack'
import Tab from '@mui/material/Tab'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'
import { useMemo, useState } from 'react'
import type { Task } from '@model/task.model'
import { getUserName } from '../data/demo-users.data'
import {
  getTaskTitle,
  workflowDefinitions,
} from '../data/workflow-stages.data'

type TaskFilter = 'open' | 'closed' | 'all'

interface TaskListProps {
  tasks: Task[]
  isLoading: boolean
  onCreateNew: () => void
  onSelectTask: (task: Task) => void
}

/** Filterable table of a user's assigned open and closed tasks. */
export const TaskList = ({
  tasks,
  isLoading,
  onCreateNew,
  onSelectTask,
}: TaskListProps) => {
  const [filter, setFilter] = useState<TaskFilter>('open')
  const visibleTasks = useMemo(
    () =>
      filter === 'all'
        ? tasks
        : tasks.filter((task) => task.lifecycleState === filter),
    [filter, tasks],
  )

  return (
    <Card
      elevation={0}
      sx={{
        width: '100%',
        boxShadow: '0 22px 70px rgba(43, 48, 105, 0.13)',
      }}
    >
      <Box sx={{ p: { xs: 3, md: 5 }, pb: 0 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          sx={{
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2,
          }}
        >
          <div>
            <Typography variant="h3" sx={{ fontWeight: 800 }}>
              Task Flow
            </Typography>
            <Typography sx={{ color: 'text.secondary', mt: 0.5 }}>
              Your assigned tasks
            </Typography>
          </div>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddRoundedIcon />}
            onClick={onCreateNew}
          >
            New task
          </Button>
        </Stack>

        <Tabs
          value={filter}
          onChange={(_, value: TaskFilter) => setFilter(value)}
          sx={{ mt: 3 }}
        >
          <Tab value="open" label="Open" />
          <Tab value="closed" label="Closed" />
          <Tab value="all" label="All" />
        </Tabs>
      </Box>

      {isLoading ? (
        <Stack sx={{ alignItems: 'center', py: 8 }}>
          <CircularProgress />
        </Stack>
      ) : (
        <TableContainer sx={{ px: { xs: 1, md: 3 }, pb: 3 }}>
          <Table sx={{ minWidth: 850 }}>
            <TableHead>
              <TableRow>
                <TableCell>Task</TableCell>
                <TableCell>Workflow</TableCell>
                <TableCell>Step</TableCell>
                <TableCell>Assigned to</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right" />
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleTasks.map((task) => {
                const definition = workflowDefinitions[task.workflowKey]
                const stage = definition.stages.find(
                  ({ status }) => status === task.status,
                )

                return (
                  <TableRow key={task.id} hover>
                    <TableCell sx={{ fontWeight: 700 }}>
                      {getTaskTitle(task)}
                    </TableCell>
                    <TableCell>{definition.label}</TableCell>
                    <TableCell>
                      {stage?.name ?? `Status ${task.status}`} · {task.status} of{' '}
                      {definition.stages.length}
                    </TableCell>
                    <TableCell>{getUserName(task.assignedUserId)}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={task.lifecycleState === 'open' ? 'Open' : 'Closed'}
                        color={
                          task.lifecycleState === 'open' ? 'success' : 'default'
                        }
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="outlined"
                        onClick={() => onSelectTask(task)}
                      >
                        {task.lifecycleState === 'open' ? 'Continue' : 'View'}
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}

              {visibleTasks.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 7 }}>
                    <Typography sx={{ color: 'text.secondary' }}>
                      No {filter === 'all' ? '' : filter} tasks found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Card>
  )
}
