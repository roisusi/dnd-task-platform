import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

const STORAGE_KEY = 'task-flow-current-user'

interface CurrentUserContextValue {
  currentUserId: string
  setCurrentUserId: (userId: string) => void
}

const CurrentUserContext = createContext<CurrentUserContextValue | null>(null)

/** Keeps the selected demo user stable across routes and browser refreshes. */
export const CurrentUserProvider = ({ children }: { children: ReactNode }) => {
  const [currentUserId, setCurrentUserId] = useState(
    () => window.localStorage.getItem(STORAGE_KEY) ?? 'user-1',
  )

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, currentUserId)
  }, [currentUserId])

  const value = useMemo(
    () => ({ currentUserId, setCurrentUserId }),
    [currentUserId],
  )

  return (
    <CurrentUserContext.Provider value={value}>
      {children}
    </CurrentUserContext.Provider>
  )
}

export const useCurrentUser = (): CurrentUserContextValue => {
  const context = useContext(CurrentUserContext)

  if (context === null) {
    throw new Error('useCurrentUser must be used inside CurrentUserProvider.')
  }

  return context
}
