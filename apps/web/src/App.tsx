import { CssBaseline, ThemeProvider } from '@mui/material'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { CurrentUserProvider } from '@providers/CurrentUserProvider'
import { appRouter } from '@routes/app-router'
import { theme } from '@theme/theme'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 15_000,
      refetchOnWindowFocus: false,
    },
  },
})

/** Application providers and global UI foundation. */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <CurrentUserProvider>
          <RouterProvider router={appRouter} />
        </CurrentUserProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
