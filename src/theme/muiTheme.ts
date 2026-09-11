import { createTheme } from '@mui/material/styles'

// Scoped MUI theme matching the app's existing dark navy/gold palette
// (see src/index.css --color-sap-* custom properties). This keeps MUI
// components visually consistent with the rest of the app rather than
// using MUI's default blue/light styling.
export const muiTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FCE300',
      contrastText: '#2A1655',
    },
    secondary: {
      main: '#2A1655',
    },
    background: {
      default: '#0b0714',
      paper: '#1c1030',
    },
    text: {
      primary: '#f1f0f5',
      secondary: '#a29fb0',
    },
    divider: '#332755',
  },
  typography: {
    fontFamily: 'inherit',
  },
  shape: {
    borderRadius: 10,
  },
})
