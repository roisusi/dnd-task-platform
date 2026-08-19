import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import type { ApiProblem } from '@api/api'
import { tasksApi } from '@api/tasks/tasks.queries'
import type { Task, WorkflowKey } from '@model/task.model'
import { ErrorDialog } from '@components/ErrorDialog'
import { WorkflowFields } from './WorkflowFields'
import { workflowDefinitions } from '../data/workflow-stages.data'
import type { FormValues } from '../interfaces/workflow.interface'

interface CreateTaskCardProps {
  currentUserId: string
  onCreated: (task: Task) => void
}

/** Form used to select a workflow and create its initial task. */
export const CreateTaskCard = ({
  currentUserId,
  onCreated,
}: CreateTaskCardProps) => {
  const methods = useForm<FormValues>({ defaultValues: {} })
  const { taskCreate, loading, error, reset } = tasksApi.useTaskCreate()
  const [validationProblem, setValidationProblem] =
    useState<ApiProblem | null>(null)

  const selectedWorkflow = methods.watch('workflowKey') as
    | WorkflowKey
    | undefined
  const definition = selectedWorkflow
    ? workflowDefinitions[selectedWorkflow]
    : undefined
  const initialStage = definition?.stages[0]

  const submit = methods.handleSubmit(
    (values) => {
      if (!selectedWorkflow || !initialStage) return

      taskCreate(
        {
          workflowKey: selectedWorkflow,
          assignedUserId: currentUserId,
          data: initialStage.toData(values),
        },
        { onSuccess: onCreated },
      )
    },
    () => {
      setValidationProblem({
        title: 'Complete the required information',
        message: 'Choose a workflow and fill in every required field.',
      })
    },
  )

  return (
    <Card
      elevation={0}
      sx={{
        width: '100%',
        maxWidth: 460,
        boxShadow: '0 20px 60px rgba(43, 48, 105, 0.14)',
      }}
    >
      <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
        <Stack spacing={3} sx={{ textAlign: 'center' }}>
          <div>
            <Typography
              variant="h3"
              sx={{ fontWeight: 800, color: 'text.primary' }}
            >
              Task Flow
            </Typography>
            <Typography sx={{ color: 'text.secondary', mt: 1 }}>
              Choose a workflow to get started
            </Typography>
          </div>

          <FormProvider {...methods}>
            <Stack component="form" spacing={2.5} onSubmit={submit}>
              <Controller
                name="workflowKey"
                control={methods.control}
                rules={{ required: 'Choose a workflow to continue.' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    value={field.value ?? ''}
                    select
                    fullWidth
                    label="Task type"
                    error={Boolean(methods.formState.errors.workflowKey)}
                    helperText={methods.formState.errors.workflowKey?.message}
                  >
                    {Object.values(workflowDefinitions).map((workflow) => (
                      <MenuItem key={workflow.key} value={workflow.key}>
                        {workflow.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />

              {initialStage && (
                <WorkflowFields stage={initialStage} taskData={{}} />
              )}

              <Button
                type="submit"
                size="large"
                variant="contained"
                endIcon={<PlayArrowRoundedIcon />}
                disabled={loading}
                sx={{ py: 1.45 }}
              >
                {loading ? 'Starting…' : 'Start task'}
              </Button>
            </Stack>
          </FormProvider>
        </Stack>
      </CardContent>

      <ErrorDialog
        error={error}
        problem={validationProblem}
        onClose={() => {
          setValidationProblem(null)
          reset()
        }}
      />
    </Card>
  )
}
