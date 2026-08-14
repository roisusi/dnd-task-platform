import { CORE_HEALTH } from "./index";

describe("task-flow-core", () => {
  it("should return ok", () => {
    expect(CORE_HEALTH).toBe("ok");
  });
});
