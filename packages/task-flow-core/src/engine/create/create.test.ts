import { type WorkflowDefinition } from "../../definitions";
import { CoreMessages } from "../../errors";
import { create } from "./create";
import { type CreateInput } from "./create-input";

interface TestData {
  approvals: string[];
}

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
      messages: [CoreMessages.taskIdRequired],
    });
  });

  it("rejects an empty workflow key", () => {
    const result = create(
      createInput({ definition: { ...definition, key: "   " } }),
    );

    expect(result).toEqual({
      task: null,
      messages: [CoreMessages.workflowKeyRequired],
    });
  });

  it("rejects an empty initial assigned-user identifier", () => {
    const result = create(createInput({ initialAssignedUserId: "   " }));

    expect(result).toEqual({
      task: null,
      messages: [CoreMessages.initialAssigneeRequired],
    });
  });

  it("rejects an initial status that is absent from the definition", () => {
    const result = create(
      createInput({ definition: { ...definition, initialStatus: 99 } }),
    );

    expect(result).toEqual({
      task: null,
      messages: [CoreMessages.initialStatusNotFound],
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
