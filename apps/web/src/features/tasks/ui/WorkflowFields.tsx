import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { Controller, useFormContext } from 'react-hook-form'
import type {
  FormValues,
  WorkflowStage,
} from '../interfaces/workflow.interface'

interface WorkflowFieldsProps {
  stage: WorkflowStage
  taskData: Record<string, unknown>
  disabled?: boolean
}

/** Renders the MUI controls described by one workflow stage. */
export const WorkflowFields = ({
  stage,
  taskData,
  disabled = false,
}: WorkflowFieldsProps) => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<FormValues>()

  return (
    <Stack spacing={2.5}>
      {stage.fields.map((field) => {
        const error = errors[field.name]

        if (field.type === 'checkbox') {
          return (
            <Controller
              key={field.name}
              name={field.name}
              control={control}
              rules={{
                validate: field.required
                  ? (value) => value === true || `${field.label} is required.`
                  : undefined,
              }}
              render={({ field: controllerField }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={controllerField.value === true}
                      onChange={(_, checked) =>
                        controllerField.onChange(checked)
                      }
                      disabled={disabled}
                    />
                  }
                  label={field.label}
                />
              )}
            />
          )
        }

        if (field.type === 'select') {
          return (
            <Controller
              key={field.name}
              name={field.name}
              control={control}
              rules={{ required: field.required && `${field.label} is required.` }}
              render={({ field: controllerField }) => (
                <TextField
                  {...controllerField}
                  select
                  fullWidth
                  label={field.label}
                  disabled={disabled}
                  error={Boolean(error)}
                  helperText={error?.message}
                >
                  {(field.options?.(taskData) ?? []).map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          )
        }

        return (
          <TextField
            key={field.name}
            fullWidth
            type={field.type}
            label={field.label}
            disabled={disabled}
            error={Boolean(error)}
            helperText={error?.message}
            {...register(field.name, {
              required: field.required && `${field.label} is required.`,
              valueAsNumber: field.type === 'number',
              min:
                field.type === 'number'
                  ? { value: 0, message: 'The value cannot be negative.' }
                  : undefined,
            })}
          />
        )
      })}
    </Stack>
  )
}
