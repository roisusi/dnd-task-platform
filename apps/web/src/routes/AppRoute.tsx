import {
  Box,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material'
import { Outlet, useNavigate } from 'react-router-dom'
import { useCurrentUser } from '@providers/CurrentUserProvider'
import { demoUsers } from '@features/tasks/demo-users'

/** Shared route layout for the task list, creation and task detail pages. */
export const AppRoute = () => {
  const navigate = useNavigate()
  const { currentUserId, setCurrentUserId } = useCurrentUser()

  const changeCurrentUser = (userId: string) => {
    setCurrentUserId(userId)
    // Run the navigation and intentionally ignore its optional Promise result.
    void navigate('/')
  }

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
        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: { xs: 4, md: 6 },
          }}
        >
          <Typography
            component="button"
            type="button"
            onClick={() => void navigate('/')}
            sx={{
              border: 0,
              p: 0,
              bgcolor: 'transparent',
              color: 'text.primary',
              font: 'inherit',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            Task Management
          </Typography>

          <FormControl size="small" sx={{ minWidth: 170 }}>
            <InputLabel>Working as</InputLabel>
            <Select
              label="Working as"
              value={currentUserId}
              onChange={(event) => changeCurrentUser(event.target.value)}
              sx={{ bgcolor: 'rgba(255,255,255,0.82)' }}
            >
              {demoUsers.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.displayName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        <Outlet />
      </Container>
    </Box>
  )
}
