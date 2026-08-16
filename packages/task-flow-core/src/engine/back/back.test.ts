import { type WorkflowDefinition } from "../../definitions";
import { type Task } from "../../models";
import { back } from "./back";
import { type BackInput, type BackMessages } from "./back-input";

interface TestData {
  approvals: string[];
}

const messages: BackMessages = {
  taskClosed: {
    code: "TASK_CLOSED",
    message: "A closed task cannot be changed.",
  },
  currentStatusNotFound: {
    code: "STATUS_NOT_FOUND",
    message: "The current status is unknown.",
  },
  initialStatusReached: {
    code: "INITIAL_STATUS_REACHED",
    message: "The task is already at its first status.",
  },
  previousAssigneeRequired: {
    code: "PREVIOUS_ASSIGNEE_REQUIRED",
    message: "A previous assigned user is required.",
  },
};

const definition: WorkflowDefinition<TestData> = {
  key: "test-workflow",
  initialStatus: 1,
  statuses: [
    { status: 1, name: "Created", validations: [] },
    { status: 2, name: "Approved", validations: [] },
    { status: 3, name: "Completed", validations: [] },
  ],
};

function createTask(overrides: Partial<Task<TestData>> = {}): Task<TestData> {
  return {
    id: "task-17",
    status: 2,
    lifecycleState: "open",
    assignedUserId: "user-8",
    data: { approvals: ["user-2", "user-3"] },
    ...overrides,
  };
}

function createInput(
  overrides: Partial<BackInput<TestData>> = {},
): BackInput<TestData> {
  return {
    task: createTask(),
    definition,
    previousAssignedUserId: "user-1",
    messages,
    ...overrides,
  };
}

describe("back", () => {
  it("moves an open task to the immediately previous status", () => {
    const result = back(createInput());

    expect(result).toEqual({
      task: {
        id: "task-17",
        status: 1,
        lifecycleState: "open",
        assignedUserId: "user-1",
        data: { approvals: ["user-2", "user-3"] },
      },
      messages: [],
    });
  });

  it("rejects a closed task", () => {
    const result = back(
      createInput({ task: createTask({ lifecycleState: "closed" }) }),
    );

    expect(result).toEqual({ task: null, messages: [messages.taskClosed] });
  });

  it("rejects a current status that is absent from the definition", () => {
    const result = back(createInput({ task: createTask({ status: 99 }) }));

    expect(result).toEqual({
      task: null,
      messages: [messages.currentStatusNotFound],
    });
  });

  it("rejects Back when the task is already at the first status", () => {
    const result = back(createInput({ task: createTask({ status: 1 }) }));

    expect(result).toEqual({
      task: null,
      messages: [messages.initialStatusReached],
    });
  });

  it("rejects an empty previous assigned-user identifier", () => {
    const result = back(createInput({ previousAssignedUserId: "   " }));

    expect(result).toEqual({
      task: null,
      messages: [messages.previousAssigneeRequired],
    });
  });

  it("does not execute validation rules while moving backward", () => {
    const validate = jest.fn(() => false);
    const definitionWithDestinationValidation: WorkflowDefinition<TestData> = {
      ...definition,
      statuses: [
        {
          ...definition.statuses[0],
          validations: [
            {
              validate,
              issue: {
                code: "FORWARD_ONLY_RULE",
                message: "This rule applies only while moving forward.",
              },
            },
          ],
        },
        definition.statuses[1],
        definition.statuses[2],
      ],
    };

    const result = back(
      createInput({ definition: definitionWithDestinationValidation }),
    );

    expect(result.messages).toEqual([]);
    expect(validate).not.toHaveBeenCalled();
  });

  it("preserves the existing task data", () => {
    const task = createTask();

    const result = back(createInput({ task }));

    expect(result.task?.data).toBe(task.data);
  });

  it("does not mutate the supplied task", () => {
    const task = createTask();
    const originalTask = structuredClone(task);

    const result = back(createInput({ task }));

    expect(task).toEqual(originalTask);
    expect(result.task).not.toBe(task);
  });
});
