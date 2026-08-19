import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Stepper from '@mui/material/Stepper'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import type { ApiProblem } from '@api/api'
import { tasksApi } from '@api/tasks/tasks.queries'
import type { Task } from '@model/task.model'
import { ErrorDialog } from '@components/ErrorDialog'
import { demoUsers } from '../data/demo-users.data'
import { TaskDataSummary } from './TaskDataSummary'
import { WorkflowFields } from './WorkflowFields'
import { workflowDefinitions } from '../data/workflow-stages.data'
import type { FormValues } from '../interfaces/workflow.interface'
import { createStageFormDefaultValues } from '../utils/create-stage-form-default-values'

interface WorkflowCardProps {
  task: Task
  currentUserId: string
  onTaskChanged: (task: Task) => void
}

/** Stepper, active-stage form and lifecycle controls for one task. */
export const WorkflowCard = ({
  task,
  currentUserId,
  onTaskChanged,
}: WorkflowCardProps) => {
  const definition = workflowDefinitions[task.workflowKey]
  const currentIndex = definition.stages.findIndex(
    ({ status }) => status === task.status,
  )
  const nextStage = definition.stages[currentIndex + 1]
  const isFirstStage = currentIndex === 0
  const isFinalStage = currentIndex === definition.stages.length - 1
  const isClosed = task.lifecycleState === 'closed'

  const methods = useForm<FormValues>({
    defaultValues: createStageFormDefaultValues(nextStage, task),
  })
  const [validationProblem, setValidationProblem] =
    useState<ApiProblem | null>(null)
  const {
    taskNext,
    loading: nextLoading,
    error: nextError,
    reset: resetNext,
  } = tasksApi.useTaskNext()
  const {
    taskBack,
    loading: backLoading,
    error: backError,
    reset: resetBack,
  } = tasksApi.useTaskBack()
  const {
    taskClose,
    loading: closeLoading,
    error: closeError,
    reset: resetClose,
  } = tasksApi.useTaskClose()
  const isPending = nextLoading || backLoading || closeLoading
  const mutationError = nextError ?? backError ?? closeError

  const submitNext = methods.handleSubmit(
    (values) => {
      if (!nextStage) return

      taskNext(
        {
          taskId: task.id,
          currentUserId,
          nextAssignedUserId: String(values.nextAssignedUserId),
          data: nextStage.toData(values),
        },
        { onSuccess: onTaskChanged },
      )
    },
    () => {
      setValidationProblem({
        title: 'Complete the next step',
        message: 'Fill in every required field before moving forward.',
      })
    },
  )

  const moveBack = () => {
    taskBack(
      {
        taskId: task.id,
        currentUserId,
        previousAssignedUserId: currentUserId,
      },
      { onSuccess: onTaskChanged },
    )
  }

  const close = () => {
    taskClose(
      {
        taskId: task.id,
        currentUserId,
      },
      { onSuccess: onTaskChanged },
    )
  }

  return (
    <Stack spacing={2.25} sx={{ width: '100%' }}>
      <Card
        elevation={0}
        sx={{
          boxShadow: '0 18px 55px rgba(43, 48, 105, 0.12)',
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
          <Stack spacing={4}>
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                {definition.label} Task
              </Typography>
              <Chip
                label={isClosed ? 'Closed' : 'Open'}
                color={isClosed ? 'default' : 'success'}
                size="small"
              />
            </Stack>

            <Stepper activeStep={currentIndex} alternativeLabel>
              {definition.stages.map((stage) => (
                <Step
                  key={stage.status}
                  completed={isClosed || task.status > stage.status}
                >
                  <StepLabel>
                    {stage.name}
                    {stage.getCount ? ` (${stage.getCount(task.data)})` : ''}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>

            <Divider />

            {isClosed ? (
              <Stack spacing={3}>
                <Alert severity="success" icon={<CheckCircleRoundedIcon />}>
                  This task is closed and can no longer be changed.
                </Alert>
                <TaskDataSummary data={task.data} />
              </Stack>
            ) : isFinalStage ? (
              <Alert severity="info">
                Every workflow stage is complete. Close the task when you are
                ready.
              </Alert>
            ) : (
              <FormProvider {...methods}>
                <Stack component="form" spacing={3} onSubmit={submitNext}>
                  <div>
                    <Typography
                      variant="overline"
                      sx={{ color: 'primary.main' }}
                    >
                      Next step
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {nextStage?.name}
                    </Typography>
                  </div>

                  {nextStage && (
                    <WorkflowFields stage={nextStage} taskData={task.data} />
                  )}

                  <Controller
                    name="nextAssignedUserId"
                    control={methods.control}
                    rules={{ required: 'Choose the next assigned user.' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        value={field.value ?? ''}
                        select
                        fullWidth
                        label="Next assigned user"
                        error={Boolean(
                          methods.formState.errors.nextAssignedUserId,
                        )}
                        helperText={
                          methods.formState.errors.nextAssignedUserId?.message
                        }
                      >
                        {demoUsers.map((user) => (
                          <MenuItem key={user.id} value={user.id}>
                            {user.displayName}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Stack>
              </FormProvider>
            )}
          </Stack>
        </CardContent>
      </Card>

      {!isClosed && (
        <Card
          elevation={0}
          sx={{
            boxShadow: '0 14px 45px rgba(43, 48, 105, 0.11)',
          }}
        >
          <CardContent sx={{ px: 3, py: '20px !important' }}>
            <Stack
              direction="row"
              sx={{
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
              }}
            >
              <Button
                variant="outlined"
                startIcon={<ArrowBackRoundedIcon />}
                disabled={isFirstStage || isPending}
                onClick={moveBack}
              >
                Back
              </Button>

              <Typography
                sx={{ color: 'text.secondary', textAlign: 'center' }}
              >
                Step {currentIndex + 1} of {definition.stages.length}
              </Typography>

              {isFinalStage ? (
                <Button
                  variant="contained"
                  color="success"
                  endIcon={<CheckCircleRoundedIcon />}
                  disabled={isPending}
                  onClick={close}
                >
                  Close
                </Button>
              ) : (
                <Button
                  variant="contained"
                  endIcon={<ArrowForwardRoundedIcon />}
                  disabled={isPending}
                  onClick={submitNext}
                >
                  Next
                </Button>
              )}
            </Stack>
          </CardContent>
        </Card>
      )}

      <ErrorDialog
        error={mutationError}
        problem={validationProblem}
        onClose={() => {
          setValidationProblem(null)
          resetNext()
          resetBack()
          resetClose()
        }}
      />
    </Stack>
  )
}
