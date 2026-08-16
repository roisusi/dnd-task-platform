export const LifecycleState = ["open", "closed"] as const;

export type LifecycleStateType = (typeof LifecycleState)[number];
