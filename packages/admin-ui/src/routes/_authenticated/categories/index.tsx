import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { categoryApi, type Category } from '../../../lib/api'

export const Route = createFileRoute('/_authenticated/categories/')({
  component: CategoriesPage,
})

function CategoriesPage() {
  const navigate = useNavigate()
  const [createOpen, setCreateOpen] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryApi.list,
  })

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h5">カテゴリ</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateOpen(true)}
        >
          新規カテゴリ
        </Button>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>名前</TableCell>
                <TableCell>スラッグ</TableCell>
                <TableCell>順序</TableCell>
                <TableCell>説明</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    カテゴリが見つかりません
                  </TableCell>
                </TableRow>
              )}
              {data?.items.map((category) => (
                <TableRow
                  key={category.id}
                  hover
                  sx={{ cursor: 'pointer' }}
                  onClick={() =>
                    navigate({
                      to: '/categories/$id',
                      params: { id: category.id },
                    })
                  }
                >
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.slug}</TableCell>
                  <TableCell>{category.order}</TableCell>
                  <TableCell>{category.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <CreateCategoryDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </Box>
  )
}

function CreateCategoryDialog({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')

  const mutation = useMutation({
    mutationFn: (data: Omit<Category, 'id'>) => categoryApi.create(data),
    onSuccess: (category) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      handleClose()
      navigate({ to: '/categories/$id', params: { id: category.id } })
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : 'カテゴリの作成に失敗しました')
    },
  })

  const handleClose = () => {
    setName('')
    setSlug('')
    setDescription('')
    setError('')
    onClose()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate({
      name,
      slug,
      description,
      parentId: null,
      thumbnail: null,
      order: 0,
    })
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle>新規カテゴリ</DialogTitle>
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
            label="名前"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
          <TextField
            margin="normal"
            fullWidth
            label="説明"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={3}
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
