import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  Paper,
} from '@mui/material'
import * as auth from '../../lib/auth'

type SearchParams = {
  email?: string
}

export const Route = createFileRoute('/signup/confirm')({
  component: ConfirmSignupPage,
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    email: (search.email as string) || '',
  }),
})

function ConfirmSignupPage() {
  const { email: initialEmail } = Route.useSearch()
  const navigate = useNavigate()
  const [email, setEmail] = useState(initialEmail || '')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await auth.confirmSignUp(email, code)
      navigate({ to: '/login' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Confirmation failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Confirm Sign Up
          </Typography>
          <Typography variant="body2" align="center" sx={{ mb: 2 }}>
            Enter the confirmation code sent to your email.
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Confirmation Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              autoFocus={!!initialEmail}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Confirming...' : 'Confirm'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}
