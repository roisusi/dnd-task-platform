import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { getApiProblem, type ApiProblem } from '@api/api'

interface ErrorDialogProps {
  error?: unknown
  problem?: ApiProblem | null
  onClose: () => void
}

/** Shows translated API or local validation failures in one consistent dialog. */
export const ErrorDialog = ({
  error,
  problem = null,
  onClose,
}: ErrorDialogProps) => {
  const content = problem ?? (error == null ? null : getApiProblem(error))

  return (
    <Dialog open={content !== null} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{content?.title}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ whiteSpace: 'pre-line' }}>
          {content?.message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={onClose} autoFocus>
          Got it
        </Button>
      </DialogActions>
    </Dialog>
  )
}
