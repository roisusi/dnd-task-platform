import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
import {
  Button,
  Card,
  CardContent,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import type { ApiProblem } from '@api/api'
import { useCreateTask } from '@api/tasks/tasks.queries'
import type { Task, WorkflowKey } from '@api/tasks/models/task.model'
import { ErrorDialog } from '@components/ErrorDialog'
import { WorkflowFields } from './WorkflowFields'
import {
  workflowDefinitions,
  type FormValues,
} from './workflow.config'

interface CreateTaskCardProps {
  currentUserId: string
  onCreated: (task: Task) => void
}

/** Selects a workflow and creates its initial task instance. */
export const CreateTaskCard = ({
  currentUserId,
  onCreated,
}: CreateTaskCardProps) => {
  const methods = useForm<FormValues>({ defaultValues: {} })
  const createTask = useCreateTask()
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

      createTask.mutate(
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
                disabled={createTask.isPending}
                sx={{ py: 1.45 }}
              >
                {createTask.isPending ? 'Starting…' : 'Start task'}
              </Button>
            </Stack>
          </FormProvider>
        </Stack>
      </CardContent>

      <ErrorDialog
        error={createTask.error}
        problem={validationProblem}
        onClose={() => {
          setValidationProblem(null)
          createTask.reset()
        }}
      />
    </Card>
  )
}
