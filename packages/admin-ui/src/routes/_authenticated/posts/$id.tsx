import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Box,
  Button,
  Typography,
  Paper,
  TextField,
  CircularProgress,
  MenuItem,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { postApi, categoryApi } from '../../../lib/api'

export const Route = createFileRoute('/_authenticated/posts/$id')({
  component: PostDetailPage,
})

function PostDetailPage() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: post, isLoading } = useQuery({
    queryKey: ['posts', id],
    queryFn: () => postApi.get(id),
  })

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryApi.list,
  })

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [content, setContent] = useState('')
  const [categoryId, setCategoryId] = useState('')

  useEffect(() => {
    if (post) {
      setTitle(post.title)
      setSlug(post.slug)
      setContent(post.content ?? '')
      setCategoryId(post.categoryId)
    }
  }, [post])

  const updateMutation = useMutation({
    mutationFn: (data: Parameters<typeof postApi.update>[1]) =>
      postApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () => postApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      if (post?.categoryId) {
        navigate({
          to: '/categories/$id',
          params: { id: post.categoryId },
        })
      } else {
        navigate({ to: '/categories' })
      }
    },
  })

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!post) {
    return <Typography>投稿が見つかりません</Typography>
  }

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() =>
          navigate({
            to: '/categories/$id',
            params: { id: post.categoryId },
          })
        }
        sx={{ mb: 2 }}
      >
        カテゴリに戻る
      </Button>

      <Typography variant="h5" gutterBottom>
        投稿編集
      </Typography>

      <Paper sx={{ p: 3 }}>
        <TextField
          fullWidth
          label="タイトル"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="スラッグ"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          select
          label="カテゴリ"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          margin="normal"
        >
          {categories?.items.map((cat) => (
            <MenuItem key={cat.id} value={cat.id}>
              {cat.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          fullWidth
          label="コンテンツ"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          margin="normal"
          multiline
          rows={10}
        />
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            onClick={() =>
              updateMutation.mutate({ title, slug, content, categoryId })
            }
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? '保存中...' : '保存'}
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              if (window.confirm('この投稿を削除してもよろしいですか？')) {
                deleteMutation.mutate()
              }
            }}
            disabled={deleteMutation.isPending}
          >
            削除
          </Button>
        </Box>
        {updateMutation.isSuccess && (
          <Typography color="success.main" sx={{ mt: 1 }}>
            保存しました
          </Typography>
        )}
        {updateMutation.isError && (
          <Typography color="error" sx={{ mt: 1 }}>
            {updateMutation.error instanceof Error
              ? updateMutation.error.message
              : '保存に失敗しました'}
          </Typography>
        )}
      </Paper>
    </Box>
  )
}
