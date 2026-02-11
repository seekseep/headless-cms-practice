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
import * as auth from '../lib/auth'

type SearchParams = {
  email?: string
}

export const Route = createFileRoute('/reset-password')({
  component: ResetPasswordPage,
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    email: (search.email as string) || '',
  }),
})

function ResetPasswordPage() {
  const { email: initialEmail } = Route.useSearch()
  const navigate = useNavigate()
  const [email, setEmail] = useState(initialEmail || '')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (newPassword !== newPasswordConfirm) {
      setError('パスワードが一致しません')
      return
    }

    setLoading(true)
    try {
      await auth.confirmForgotPassword(email, code, newPassword)
      navigate({ to: '/login' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'パスワードのリセットに失敗しました')
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
            パスワードリセット
          </Typography>
          <Typography variant="body2" align="center" sx={{ mb: 2 }}>
            メールに送信されたコードと新しいパスワードを入力してください。
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
              label="メールアドレス"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="確認コード"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              autoFocus={!!initialEmail}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="新しいパスワード"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="新しいパスワード（確認）"
              type="password"
              value={newPasswordConfirm}
              onChange={(e) => setNewPasswordConfirm(e.target.value)}
              autoComplete="new-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'リセット中...' : 'パスワードをリセット'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}
