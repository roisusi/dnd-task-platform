import type { DemoUser } from '../interfaces/demo-user.interface'

/** Matches the demo users inserted by the database seed migration. */
export const demoUsers: DemoUser[] = [
  { id: 'user-1', displayName: 'Roi' },
  { id: 'user-2', displayName: 'Dana' },
  { id: 'user-3', displayName: 'Amit' },
  { id: 'user-4', displayName: 'Supervisor' },
]

/** Resolves a stored user identifier to the display name shown in the UI. */
export const getUserName = (userId: string): string => {
  return demoUsers.find((user) => user.id === userId)?.displayName ?? userId
}
