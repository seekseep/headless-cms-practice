import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
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

export const Route = createFileRoute('/forgot')({
  component: ForgotPasswordPage,
})

function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await auth.forgotPassword(email)
      navigate({
        to: '/reset-password',
        search: { email },
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'リセットコードの送信に失敗しました')
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
            パスワードをお忘れの方
          </Typography>
          <Typography variant="body2" align="center" sx={{ mb: 2 }}>
            パスワードリセットコードを受け取るメールアドレスを入力してください。
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
              autoFocus
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? '送信中...' : 'リセットコードを送信'}
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Link to="/login" style={{ color: '#1976d2' }}>
                ログインに戻る
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}
