import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Box,
  Button,
  Typography,
  Paper,
  TextField,
  Alert,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useAuth } from '../../../contexts/AuthContext'
import * as auth from '../../../lib/auth'

export const Route = createFileRoute('/_authenticated/me/email')({
  component: ChangeEmailPage,
})

function ChangeEmailPage() {
  const navigate = useNavigate()
  const { userEmail, refreshAuth } = useAuth()
  const [newEmail, setNewEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)
    try {
      await auth.changeEmail(newEmail)
      setSuccess(true)
      setNewEmail('')
      await refreshAuth()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate({ to: '/me' })}
        sx={{ mb: 2 }}
      >
        Back to Profile
      </Button>

      <Typography variant="h5" gutterBottom>
        Change Email
      </Typography>

      <Paper sx={{ p: 3, maxWidth: 500 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Current email: {userEmail}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Email update requested. Please check your new email for a
            verification code.
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            required
            label="New Email"
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            margin="normal"
            autoComplete="email"
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Email'}
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}
