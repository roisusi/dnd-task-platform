import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'
import { useCurrentUser } from '@providers/CurrentUserProvider'
import { demoUsers } from '../data/demo-users.data'

/** Displays task navigation and the demo-user selector. */
export const TaskHeader = () => {
  const navigate = useNavigate()
  const { currentUserId, setCurrentUserId } = useCurrentUser()

  const changeCurrentUser = (userId: string) => {
    setCurrentUserId(userId)
    // Run the navigation and intentionally ignore its optional Promise result.
    void navigate('/')
  }

  return (
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
  )
}
