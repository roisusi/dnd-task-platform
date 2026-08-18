import { type WorkflowDefinition } from '@dnb/task-flow-core';

/** Data collected while a development task moves through its workflow. */
export interface DevelopmentTaskData extends Record<string, unknown> {
  specification?: string;
  branchName?: string;
  versionNumber?: string;
}

/** Defines the four statuses and required data of the Development workflow. */
export const developmentWorkflow: WorkflowDefinition<DevelopmentTaskData> = {
  key: 'development',
  initialStatus: 1,
  statuses: [
    {
      status: 1,
      name: 'Created',
      validations: [],
    },
    {
      status: 2,
      name: 'Specification completed',
      validations: [
        {
          validate: ({ specification }) =>
            specification !== undefined && specification.trim().length > 0,
          issue: {
            code: 'SPECIFICATION_REQUIRED',
            message: 'A specification is required.',
          },
        },
      ],
    },
    {
      status: 3,
      name: 'Development completed',
      validations: [
        {
          validate: ({ branchName }) =>
            branchName !== undefined && branchName.trim().length > 0,
          issue: {
            code: 'BRANCH_NAME_REQUIRED',
            message: 'A branch name is required.',
          },
        },
      ],
    },
    {
      status: 4,
      name: 'Distribution completed',
      validations: [
        {
          validate: ({ versionNumber }) =>
            versionNumber !== undefined && versionNumber.trim().length > 0,
          issue: {
            code: 'VERSION_NUMBER_REQUIRED',
            message: 'A version number is required.',
          },
        },
      ],
    },
  ],
};
