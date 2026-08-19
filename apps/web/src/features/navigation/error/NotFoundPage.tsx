import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'

/** Friendly fallback for an unknown frontend route. */
export const NotFoundPage = () => {
  const navigate = useNavigate()

  return (
    <Card elevation={0} sx={{ maxWidth: 480, mx: 'auto' }}>
      <CardContent sx={{ p: 5 }}>
        <Stack spacing={2.5} sx={{ textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Page not found
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            The requested Task Flow page does not exist.
          </Typography>
          <Button variant="contained" onClick={() => void navigate('/')}>
            Back to tasks
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
}
