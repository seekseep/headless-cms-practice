import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Box,
  Button,
  Typography,
  Paper,
  TextField,
  CircularProgress,
  Alert,
  MenuItem,
  Tabs,
  Tab,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ImageIcon from '@mui/icons-material/Image'
import MarkdownEditor from '../../../components/MarkdownEditor'
import MarkdownPreview from '../../../components/MarkdownPreview'
import type { UpdatePostCommandInput } from '@headless-cms-practice/core'
import { getPost, updatePost, deletePost, listCategories, createUploadUrl } from '../../../lib/api'

export const Route = createFileRoute('/_authenticated/posts/$id')({
  component: PostDetailPage,
})

function PostDetailPage() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: post, isLoading, error: postError } = useQuery({
    queryKey: ['posts', id],
    queryFn: () => getPost({ id }),
  })

  const { data: categories, error: categoriesError } = useQuery({
    queryKey: ['categories'],
    queryFn: () => listCategories({ nextToken: null }),
  })

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [content, setContent] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [editorTab, setEditorTab] = useState<0 | 1>(0)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = useCallback(async (file: File) => {
    setUploading(true)
    setUploadError(null)
    try {
      const { uploadUrl, url } = await createUploadUrl({ contentType: file.type })
      await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      })
      setContent((prev) => prev + `\n![${file.name}](${url})\n`)
    } catch {
      setUploadError('画像のアップロードに失敗しました')
    } finally {
      setUploading(false)
    }
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageUpload(file)
    }
    e.target.value = ''
  }, [handleImageUpload])

  useEffect(() => {
    if (post) {
      setTitle(post.title)
      setSlug(post.slug)
      setContent(post.content ?? '')
      setCategoryId(post.categoryId)
    }
  }, [post])

  const updateMutation = useMutation({
    mutationFn: (data: Omit<UpdatePostCommandInput, 'id'>) =>
      updatePost({ id, ...data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () => deletePost({ id }),
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

      {postError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {postError instanceof Error ? postError.message : '投稿の取得に失敗しました'}
        </Alert>
      )}
      {categoriesError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {categoriesError instanceof Error ? categoriesError.message : 'カテゴリの取得に失敗しました'}
        </Alert>
      )}

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
        <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
          コンテンツ
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tabs
            value={editorTab}
            onChange={(_, v) => setEditorTab(v)}
            sx={{ mb: 1 }}
          >
            <Tab label="編集" />
            <Tab label="プレビュー" />
          </Tabs>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileSelect}
          />
          <Button
            size="small"
            variant="outlined"
            startIcon={uploading ? <CircularProgress size={16} /> : <ImageIcon />}
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            sx={{ mb: 1 }}
          >
            {uploading ? 'アップロード中...' : '画像を挿入'}
          </Button>
        </Box>
        {uploadError && (
          <Alert severity="error" sx={{ mb: 1 }} onClose={() => setUploadError(null)}>
            {uploadError}
          </Alert>
        )}
        {editorTab === 0 ? (
          <MarkdownEditor
            value={content}
            onChange={setContent}
            placeholder="Markdownで入力..."
          />
        ) : (
          <MarkdownPreview content={content} />
        )}
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
          <Alert severity="error" sx={{ mt: 1 }}>
            {updateMutation.error instanceof Error
              ? updateMutation.error.message
              : '保存に失敗しました'}
          </Alert>
        )}
      </Paper>
    </Box>
  )
}
