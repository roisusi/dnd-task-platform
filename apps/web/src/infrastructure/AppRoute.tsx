import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import { Outlet } from 'react-router-dom'
import { TaskHeader } from '@features/tasks/ui/TaskHeader'

/**
 * Provides the shared visual shell for every routed application page.
 *
 * It renders the task header and the React Router outlet where the matched
 * feature page is displayed.
 *
 * @returns The application layout containing its current child route.
 */
export const AppRoute = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        background:
          'radial-gradient(circle at 7% 8%, rgba(104, 108, 230, 0.17), transparent 21%), radial-gradient(circle at 94% 12%, rgba(160, 126, 232, 0.14), transparent 24%), #f6f7ff',
      }}
    >
      <Container
        maxWidth="xl"
        sx={{ py: { xs: 3, md: 5 }, position: 'relative' }}
      >
        <TaskHeader />
        <Outlet />
      </Container>
    </Box>
  )
}
