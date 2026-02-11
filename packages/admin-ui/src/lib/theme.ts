import { createTheme } from '@mui/material'

export const theme = createTheme({
  components: {
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
    },
    MuiButton: {
      defaultProps: {
        variant: 'contained',
      },
    },
    MuiTable: {
      defaultProps: {},
    },
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
      }
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
        variant: 'outlined',
      }
    }
  },
})
