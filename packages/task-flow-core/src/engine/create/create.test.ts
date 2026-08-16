import { type WorkflowDefinition } from "../../definitions";
import { create } from "./create";
import { type CreateInput, type CreateMessages } from "./create-input";

interface TestData {
  approvals: string[];
}

const messages: CreateMessages = {
  taskIdRequired: {
    code: "TASK_ID_REQUIRED",
    message: "A task identifier is required.",
  },
  workflowKeyRequired: {
    code: "WORKFLOW_KEY_REQUIRED",
    message: "A workflow key is required.",
  },
  initialStatusNotFound: {
    code: "INITIAL_STATUS_NOT_FOUND",
    message: "The configured initial status was not found.",
  },
  initialAssigneeRequired: {
    code: "INITIAL_ASSIGNEE_REQUIRED",
    message: "An initial assigned user is required.",
  },
};

const definition: WorkflowDefinition<TestData> = {
  key: "test-workflow",
  initialStatus: 1,
  statuses: [
    {
      status: 1,
      name: "Created",
      validations: [
        {
          validate: ({ approvals }) => approvals.length >= 1,
          issue: {
            code: "APPROVAL_REQUIRED",
            message: "An approval is required to create the task.",
          },
        },
      ],
    },
    { status: 2, name: "Approved", validations: [] },
  ],
};

function createInput(
  overrides: Partial<CreateInput<TestData>> = {},
): CreateInput<TestData> {
  return {
    taskId: "task-17",
    definition,
    data: { approvals: ["user-2"] },
    initialAssignedUserId: "user-1",
    messages,
    ...overrides,
  };
}

describe("create", () => {
  it("creates an open task from the workflow definition", () => {
    const result = create(createInput());

    expect(result).toEqual({
      task: {
        id: "task-17",
        workflowKey: "test-workflow",
        status: 1,
        lifecycleState: "open",
        assignedUserId: "user-1",
        data: { approvals: ["user-2"] },
      },
      messages: [],
    });
  });

  it("copies the workflow key from the definition", () => {
    const result = create(
      createInput({ definition: { ...definition, key: "custom-workflow-v2" } }),
    );

    expect(result.task?.workflowKey).toBe("custom-workflow-v2");
  });

  it("uses the configured initial status even when it is not first", () => {
    const result = create(
      createInput({
        definition: {
          ...definition,
          initialStatus: 2,
        },
      }),
    );

    expect(result.task?.status).toBe(2);
  });

  it("rejects an empty task identifier", () => {
    const result = create(createInput({ taskId: "   " }));

    expect(result).toEqual({
      task: null,
      messages: [messages.taskIdRequired],
    });
  });

  it("rejects an empty workflow key", () => {
    const result = create(
      createInput({ definition: { ...definition, key: "   " } }),
    );

    expect(result).toEqual({
      task: null,
      messages: [messages.workflowKeyRequired],
    });
  });

  it("rejects an empty initial assigned-user identifier", () => {
    const result = create(createInput({ initialAssignedUserId: "   " }));

    expect(result).toEqual({
      task: null,
      messages: [messages.initialAssigneeRequired],
    });
  });

  it("rejects an initial status that is absent from the definition", () => {
    const result = create(
      createInput({ definition: { ...definition, initialStatus: 99 } }),
    );

    expect(result).toEqual({
      task: null,
      messages: [messages.initialStatusNotFound],
    });
  });

  it("returns all initial-status validation failures in definition order", () => {
    const firstIssue = {
      code: "FIRST_APPROVAL_REQUIRED",
      message: "A first approval is required.",
    };
    const secondIssue = {
      code: "SECOND_APPROVAL_REQUIRED",
      message: "A second approval is required.",
    };
    const definitionWithTwoRules: WorkflowDefinition<TestData> = {
      ...definition,
      statuses: [
        {
          ...definition.statuses[0],
          validations: [
            {
              validate: ({ approvals }) => approvals.length >= 1,
              issue: firstIssue,
            },
            {
              validate: ({ approvals }) => approvals.length >= 2,
              issue: secondIssue,
            },
          ],
        },
        definition.statuses[1],
      ],
    };

    const result = create(
      createInput({
        definition: definitionWithTwoRules,
        data: { approvals: [] },
      }),
    );

    expect(result).toEqual({
      task: null,
      messages: [firstIssue, secondIssue],
    });
  });

  it("does not mutate the supplied data or workflow definition", () => {
    const data = { approvals: ["user-2"] };
    const originalData = structuredClone(data);
    const originalDefinition = {
      ...definition,
      statuses: [...definition.statuses],
    };

    const result = create(createInput({ data, definition }));

    expect(data).toEqual(originalData);
    expect(definition).toEqual(originalDefinition);
    expect(result.task?.data).toBe(data);
  });
});
