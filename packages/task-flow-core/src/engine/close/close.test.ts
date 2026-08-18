import { type WorkflowDefinition } from "../../definitions";
import { CoreMessages } from "../../errors";
import { type Task } from "../../models";
import { close } from "./close";
import { type CloseInput } from "./close-input";

interface TestData {
  approvals: string[];
}

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
    workflowKey: "test-workflow",
    status: 3,
    lifecycleState: "open",
    assignedUserId: "user-8",
    data: { approvals: ["user-2", "user-3"] },
    ...overrides,
  };
}

function createInput(
  overrides: Partial<CloseInput<TestData>> = {},
): CloseInput<TestData> {
  return {
    task: createTask(),
    definition,
    ...overrides,
  };
}

describe("close", () => {
  it("closes an open task at the final status", () => {
    const result = close(createInput());

    expect(result).toEqual({
      task: {
        id: "task-17",
        workflowKey: "test-workflow",
        status: 3,
        lifecycleState: "closed",
        assignedUserId: "user-8",
        data: { approvals: ["user-2", "user-3"] },
      },
      messages: [],
    });
  });

  it("rejects a task that is already closed", () => {
    const result = close(
      createInput({ task: createTask({ lifecycleState: "closed" }) }),
    );

    expect(result).toEqual({
      task: null,
      messages: [CoreMessages.taskClosed],
    });
  });

  it("rejects a current status that is absent from the definition", () => {
    const result = close(createInput({ task: createTask({ status: 99 }) }));

    expect(result).toEqual({
      task: null,
      messages: [CoreMessages.currentStatusNotFound],
    });
  });

  it("rejects an open task that has not reached the final status", () => {
    const result = close(createInput({ task: createTask({ status: 2 }) }));

    expect(result).toEqual({
      task: null,
      messages: [CoreMessages.finalStatusRequired],
    });
  });

  it("closes a task in a single-status workflow", () => {
    const singleStatusDefinition: WorkflowDefinition<TestData> = {
      ...definition,
      statuses: [definition.statuses[0]],
    };

    const result = close(
      createInput({
        definition: singleStatusDefinition,
        task: createTask({ status: 1 }),
      }),
    );

    expect(result.task?.lifecycleState).toBe("closed");
  });

  it("does not execute status-data validations", () => {
    const validate = jest.fn(() => false);
    const definitionWithValidation: WorkflowDefinition<TestData> = {
      ...definition,
      statuses: [
        definition.statuses[0],
        definition.statuses[1],
        {
          ...definition.statuses[2],
          validations: [
            {
              validate,
              issue: {
                code: "FORWARD_ONLY_RULE",
                message: "This rule applies only while entering the status.",
              },
            },
          ],
        },
      ],
    };

    const result = close(createInput({ definition: definitionWithValidation }));

    expect(result.messages).toEqual([]);
    expect(validate).not.toHaveBeenCalled();
  });

  it("preserves task fields and does not mutate the supplied objects", () => {
    const task = createTask();
    const originalTask = structuredClone(task);
    const originalDefinition = {
      ...definition,
      statuses: [...definition.statuses],
    };

    const result = close(createInput({ task, definition }));

    expect(task).toEqual(originalTask);
    expect(definition).toEqual(originalDefinition);
    expect(result.task).not.toBe(task);
    expect(result.task?.data).toBe(task.data);
    expect(result.task?.id).toBe(task.id);
    expect(result.task?.workflowKey).toBe(task.workflowKey);
    expect(result.task?.status).toBe(task.status);
    expect(result.task?.assignedUserId).toBe(task.assignedUserId);
  });
});
