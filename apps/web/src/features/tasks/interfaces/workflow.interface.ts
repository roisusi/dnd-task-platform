import type { WorkflowKey } from '@model/task.model'

export type FieldValue = string | number | boolean
export type FormValues = Record<string, FieldValue>

export interface FieldOption {
  label: string
  value: string
}

export interface WorkflowField {
  name: string
  label: string
  type: 'text' | 'number' | 'select' | 'checkbox'
  required?: boolean
  options?: (data: Record<string, unknown>) => FieldOption[]
  defaultValue?: (data: Record<string, unknown>) => FieldValue
}

export interface WorkflowStage {
  status: number
  name: string
  fields: WorkflowField[]
  getCount?: (data: Record<string, unknown>) => number
  toData: (values: FormValues) => Record<string, unknown>
}

export interface WorkflowUiDefinition {
  key: WorkflowKey
  label: string
  stages: WorkflowStage[]
}
