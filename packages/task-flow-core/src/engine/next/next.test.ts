import { type WorkflowDefinition } from "../../definitions";
import { CoreMessages } from "../../errors";
import { type Task } from "../../models";
import { type NextInput } from "./next-input";
import { next } from "./next";

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
      validations: [],
    },
    {
      status: 2,
      name: "Approved",
      validations: [
        {
          validate: ({ approvals }) => approvals.length >= 2,
          issue: {
            code: "TWO_APPROVALS_REQUIRED",
            message: "Two approvals are required before continuing.",
          },
        },
      ],
    },
    {
      status: 3,
      name: "Completed",
      validations: [],
    },
  ],
};

function createTask(overrides: Partial<Task<TestData>> = {}): Task<TestData> {
  return {
    id: "task-17",
    workflowKey: "test-workflow",
    status: 1,
    lifecycleState: "open",
    assignedUserId: "user-1",
    data: {
      approvals: [],
    },
    ...overrides, //change values that override the above
  };
}

function createInput(
  overrides: Partial<NextInput<TestData>> = {},
): NextInput<TestData> {
  return {
    task: createTask(),
    definition,
    data: {
      approvals: ["user-2", "user-3"],
    },
    nextAssignedUserId: "user-8",
    ...overrides,
  };
}

describe("next", () => {
  it("advances an open task to the immediately following status", () => {
    const result = next(createInput());

    expect(result.messages).toEqual([]); //next result return []
    expect(result.task).toEqual({
      id: "task-17",
      workflowKey: "test-workflow",
      status: 2,
      lifecycleState: "open",
      assignedUserId: "user-8",
      data: {
        approvals: ["user-2", "user-3"],
      },
    });
  });

  it("rejects a closed task", () => {
    const result = next(
      createInput({
        task: createTask({ lifecycleState: "closed" }),
      }),
    );

    expect(result).toEqual({
      task: null,
      messages: [CoreMessages.taskClosed],
    });
  });

  it("rejects a current status that is absent from the definition", () => {
    const result = next(
      createInput({
        task: createTask({ status: 99 }),
      }),
    );

    expect(result).toEqual({
      task: null,
      messages: [CoreMessages.currentStatusNotFound],
    });
  });

  it("rejects Next when the task is already at the final status", () => {
    const result = next(
      createInput({
        task: createTask({ status: 3 }),
      }),
    );

    expect(result).toEqual({
      task: null,
      messages: [CoreMessages.finalStatusReached],
    });
  });

  it("returns destination-status validation messages without advancing", () => {
    const result = next(
      createInput({
        data: {
          approvals: ["user-2"],
        },
      }),
    );

    expect(result).toEqual({
      task: null,
      messages: [definition.statuses[1].validations[0].issue],
    });
  });

  it("returns all failed destination-status validation messages in definition order", () => {
    const firstIssue = {
      code: "FIRST_APPROVAL_REQUIRED",
      message: "A first approval is required before continuing.",
    };
    const secondIssue = {
      code: "SECOND_APPROVAL_REQUIRED",
      message: "A second approval is required before continuing.",
    };
    const definitionWithTwoRules: WorkflowDefinition<TestData> = {
      ...definition,
      statuses: [
        definition.statuses[0],
        {
          ...definition.statuses[1],
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
        definition.statuses[2],
      ],
    };

    const result = next(
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

  it("rejects an empty next assigned-user identifier", () => {
    const result = next(
      createInput({
        nextAssignedUserId: "   ",
      }),
    );

    expect(result).toEqual({
      task: null,
      messages: [CoreMessages.nextAssigneeRequired],
    });
  });

  it("does not mutate the supplied task", () => {
    const task = createTask();
    const originalTask = structuredClone(task); //clone same task JS function

    const result = next(createInput({ task }));

    expect(task).toEqual(originalTask);
    expect(result.task).not.toBe(task);
  });
});
