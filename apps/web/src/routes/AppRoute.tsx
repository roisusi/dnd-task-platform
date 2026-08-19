import { Box, Container } from '@mui/material'
import { Outlet } from 'react-router-dom'
import { TaskHeader } from '@features/tasks/TaskHeader'

/** Shared route layout for the task list, creation and task detail pages. */
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
