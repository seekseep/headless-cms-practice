import { createFileRoute, Navigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { CircularProgress, Box } from '@mui/material'
import { useAuth } from '../contexts/AuthContext'

export const Route = createFileRoute('/logout')({
  component: LogoutPage,
})

function LogoutPage() {
  const { logout } = useAuth()
  const [done, setDone] = useState(false)

  useEffect(() => {
    logout().then(() => setDone(true))
  }, [logout])

  if (done) {
    return <Navigate to="/login" />
  }

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
