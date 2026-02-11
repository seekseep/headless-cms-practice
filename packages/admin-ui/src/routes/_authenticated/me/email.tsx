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
      setError(err instanceof Error ? err.message : 'メールアドレスの変更に失敗しました')
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
        プロフィールに戻る
      </Button>

      <Typography variant="h5" gutterBottom>
        メールアドレス変更
      </Typography>

      <Paper sx={{ p: 3, maxWidth: 500 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          現在のメールアドレス: {userEmail}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            メールアドレスの更新をリクエストしました。新しいメールアドレスに送信された確認コードをご確認ください。
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            required
            label="新しいメールアドレス"
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
            {loading ? '更新中...' : 'メールアドレスを更新'}
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}
