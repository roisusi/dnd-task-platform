import type { Task } from '@model/task.model'
import type {
  FormValues,
  WorkflowStage,
} from '../interfaces/workflow.interface'

/**
 * Prepares the values that should appear when the next-stage form opens.
 *
 * Think of the form as a group of empty boxes. This function looks at every
 * field in the next stage and decides what to put inside its box:
 *
 * 1. Use the field's `defaultValue` function when the API data must be changed
 *    into a different UI shape.
 * 2. Otherwise, reuse a simple saved value with the same field name.
 * 3. If no saved value exists, use an empty string or `false` for a checkbox.
 * 4. Select the task's current assignee as the next assignee initially.
 *
 * For example, the API may store `priceQuotes: ['100', '120']`, while the form
 * displays two boxes named `quoteOne` and `quoteTwo`. The field-specific
 * `defaultValue` functions take the two saved items and put one in each box.
 *
 * @param stage The next workflow stage whose form is about to be displayed.
 * @param task The saved task containing earlier data and its current assignee.
 * @returns An object React Hook Form uses as the form's starting values.
 */
export const createStageFormDefaultValues = (
  stage: WorkflowStage | undefined,
  task: Task,
): FormValues => {
  const values: FormValues = {
    nextAssignedUserId: task.assignedUserId,
  }

  stage?.fields.forEach((field) => {
    const configuredValue = field.defaultValue?.(task.data)
    const persistedValue = task.data[field.name]

    if (configuredValue !== undefined) {
      values[field.name] = configuredValue
    } else if (
      typeof persistedValue === 'string' ||
      typeof persistedValue === 'number' ||
      typeof persistedValue === 'boolean'
    ) {
      values[field.name] = persistedValue
    } else {
      values[field.name] = field.type === 'checkbox' ? false : ''
    }
  })

  return values
}
