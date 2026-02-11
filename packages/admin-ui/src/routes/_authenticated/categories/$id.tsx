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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import AddIcon from '@mui/icons-material/Add'
import { categoryApi, postApi, type Post } from '../../../lib/api'

export const Route = createFileRoute('/_authenticated/categories/$id')({
  component: CategoryDetailPage,
})

function CategoryDetailPage() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: category, isLoading } = useQuery({
    queryKey: ['categories', id],
    queryFn: () => categoryApi.get(id),
  })

  const { data: posts } = useQuery({
    queryKey: ['posts', { categoryId: id }],
    queryFn: () => postApi.listByCategoryId(id),
  })

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [order, setOrder] = useState(0)
  const [createPostOpen, setCreatePostOpen] = useState(false)

  useEffect(() => {
    if (category) {
      setName(category.name)
      setSlug(category.slug)
      setDescription(category.description ?? '')
      setOrder(category.order)
    }
  }, [category])

  const updateMutation = useMutation({
    mutationFn: (data: Parameters<typeof categoryApi.update>[1]) =>
      categoryApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () => categoryApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      navigate({ to: '/categories' })
    },
  })

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!category) {
    return <Typography>カテゴリが見つかりません</Typography>
  }

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate({ to: '/categories' })}
        sx={{ mb: 2 }}
      >
        カテゴリ一覧に戻る
      </Button>

      <Typography variant="h5" gutterBottom>
        カテゴリ編集
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <TextField
          fullWidth
          label="名前"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
          label="説明"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="normal"
          multiline
          rows={3}
        />
        <TextField
          fullWidth
          label="順序"
          type="number"
          value={order}
          onChange={(e) => setOrder(Number(e.target.value))}
          margin="normal"
        />
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            onClick={() =>
              updateMutation.mutate({ name, slug, description, order })
            }
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? '保存中...' : '保存'}
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              if (window.confirm('このカテゴリを削除してもよろしいですか？')) {
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

      <Divider sx={{ my: 3 }} />

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography variant="h6">投稿</Typography>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={() => setCreatePostOpen(true)}
        >
          新規投稿
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>タイトル</TableCell>
              <TableCell>スラッグ</TableCell>
              <TableCell>更新日</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(!posts?.items || posts.items.length === 0) && (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  投稿が見つかりません
                </TableCell>
              </TableRow>
            )}
            {posts?.items.map((post) => (
              <TableRow
                key={post.id}
                hover
                sx={{ cursor: 'pointer' }}
                onClick={() =>
                  navigate({ to: '/posts/$id', params: { id: post.id } })
                }
              >
                <TableCell>{post.title}</TableCell>
                <TableCell>{post.slug}</TableCell>
                <TableCell>
                  {new Date(post.updatedAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <CreatePostDialog
        categoryId={id}
        open={createPostOpen}
        onClose={() => setCreatePostOpen(false)}
      />
    </Box>
  )
}

function CreatePostDialog({
  categoryId,
  open,
  onClose,
}: {
  categoryId: string
  open: boolean
  onClose: () => void
}) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [error, setError] = useState('')

  const mutation = useMutation({
    mutationFn: (data: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) =>
      postApi.create(data),
    onSuccess: (post) => {
      queryClient.invalidateQueries({
        queryKey: ['posts', { categoryId }],
      })
      handleClose()
      navigate({ to: '/posts/$id', params: { id: post.id } })
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : '投稿の作成に失敗しました')
    },
  })

  const handleClose = () => {
    setTitle('')
    setSlug('')
    setError('')
    onClose()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate({ title, slug, categoryId })
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle>新規投稿</DialogTitle>
        <DialogContent>
          {error && (
            <Typography color="error" sx={{ mb: 1 }}>
              {error}
            </Typography>
          )}
          <TextField
            margin="normal"
            required
            fullWidth
            label="タイトル"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="スラッグ"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>キャンセル</Button>
          <Button type="submit" variant="contained" disabled={mutation.isPending}>
            {mutation.isPending ? '作成中...' : '作成'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}
