import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4546d8',
      dark: '#3435b5',
      light: '#7778ef',
    },
    success: {
      main: '#22945d',
    },
    background: {
      default: '#f5f6ff',
      paper: '#ffffff',
    },
    text: {
      primary: '#111936',
      secondary: '#69708a',
    },
  },
  typography: {
    fontFamily: '"Noto Sans", system-ui, sans-serif',
    h3: {
      fontSize: '2.25rem',
      letterSpacing: '-0.04em',
    },
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: 'none',
          fontWeight: 700,
          boxShadow: 'none',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 6,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          color: '#111936',
          fontWeight: 800,
        },
      },
    },
  },
})
