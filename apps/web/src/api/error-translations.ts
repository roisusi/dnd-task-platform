/** User-facing copy for machine-readable workflow and validation codes. */
export const errorTranslations: Record<string, string> = {
  TASK_ID_REQUIRED: 'The task identifier is missing.',
  WORKFLOW_KEY_REQUIRED: 'Choose a task type before continuing.',
  INITIAL_STATUS_NOT_FOUND:
    'This workflow does not have a valid starting step.',
  INITIAL_ASSIGNEE_REQUIRED: 'Choose the user who will own this task.',
  TASK_CLOSED: 'This task is closed and can no longer be changed.',
  CURRENT_STATUS_NOT_FOUND:
    'The saved task step does not exist in its workflow definition.',
  FINAL_STATUS_REACHED: 'This task is already at its final step.',
  NEXT_ASSIGNEE_REQUIRED: 'Choose the user responsible for the next step.',
  INITIAL_STATUS_REACHED: 'This task is already at its first step.',
  PREVIOUS_ASSIGNEE_REQUIRED:
    'Choose the user responsible after moving backward.',
  FINAL_STATUS_REQUIRED:
    'Complete every workflow step before closing the task.',
  TWO_PRICE_QUOTES_REQUIRED:
    'Enter exactly two non-empty supplier quotes.',
  RECEIPT_REQUIRED: 'Add the purchase receipt before continuing.',
  SPECIFICATION_REQUIRED:
    'Add the completed specification before continuing.',
  BRANCH_NAME_REQUIRED: 'Add the development branch name.',
  VERSION_NUMBER_REQUIRED: 'Add the distributed version number.',
  PRODUCT_NAME_REQUIRED: 'Enter the product that should be ordered.',
  VALID_SUPPLIER_BIDS_REQUIRED:
    'Add at least one supplier with a valid name and price.',
  SUPPLIER_SELECTION_REQUIRED:
    'Choose one of the suppliers that submitted a bid.',
  SUPERVISOR_APPROVAL_REQUIRED:
    'Supervisor approval is required before continuing.',
  ORDER_REFERENCE_REQUIRED: 'Add the completed order reference.',
}
