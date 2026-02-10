import { createFileRoute, Navigate } from '@tanstack/react-router'
import { CircularProgress, Box } from '@mui/material'
import { useAuth } from '../contexts/AuthContext'

export const Route = createFileRoute('/')({
  component: IndexPage,
})

function IndexPage() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/categories" />
  }

  return <Navigate to="/login" />
}
