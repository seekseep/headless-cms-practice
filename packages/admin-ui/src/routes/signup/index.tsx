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
import * as auth from '../../lib/auth'

export const Route = createFileRoute('/signup/')({
  component: SignupPage,
})

function SignupPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== passwordConfirm) {
      setError('パスワードが一致しません')
      return
    }

    setLoading(true)
    try {
      await auth.signUp(email, password)
      navigate({
        to: '/signup/confirm',
        search: { email },
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : '登録に失敗しました')
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
            新規登録
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
            <TextField
              margin="normal"
              required
              fullWidth
              label="パスワード"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="パスワード（確認）"
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              autoComplete="new-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? '登録中...' : '新規登録'}
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Link to="/login" style={{ color: '#1976d2' }}>
                アカウントをお持ちですか？ログイン
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}
