import { createRootRoute, Outlet } from '@tanstack/react-router'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '../lib/queryClient'
import { AuthProvider } from '../contexts/AuthContext'

const theme = createTheme()

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Outlet />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
