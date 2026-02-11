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
import * as auth from '../../../lib/auth'

export const Route = createFileRoute('/_authenticated/me/password')({
  component: ChangePasswordPage,
})

function ChangePasswordPage() {
  const navigate = useNavigate()
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (newPassword !== newPasswordConfirm) {
      setError('新しいパスワードが一致しません')
      return
    }

    setLoading(true)
    try {
      await auth.changePassword(oldPassword, newPassword)
      setSuccess(true)
      setOldPassword('')
      setNewPassword('')
      setNewPasswordConfirm('')
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'パスワードの変更に失敗しました',
      )
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
        パスワード変更
      </Typography>

      <Paper sx={{ p: 3, maxWidth: 500 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            パスワードを変更しました
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            required
            label="現在のパスワード"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            margin="normal"
            autoComplete="current-password"
          />
          <TextField
            fullWidth
            required
            label="新しいパスワード"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            margin="normal"
            autoComplete="new-password"
          />
          <TextField
            fullWidth
            required
            label="新しいパスワード（確認）"
            type="password"
            value={newPasswordConfirm}
            onChange={(e) => setNewPasswordConfirm(e.target.value)}
            margin="normal"
            autoComplete="new-password"
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? '変更中...' : 'パスワードを変更'}
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}
