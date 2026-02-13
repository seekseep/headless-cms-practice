import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Box } from '@mui/material'

interface MarkdownPreviewProps {
  content: string
}

export default function MarkdownPreview({ content }: MarkdownPreviewProps) {
  return (
    <Box
      sx={{
        p: 2,
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        minHeight: '300px',
        '& h1': { fontSize: '2em', fontWeight: 'bold', mt: 2, mb: 1 },
        '& h2': { fontSize: '1.5em', fontWeight: 'bold', mt: 2, mb: 1 },
        '& h3': { fontSize: '1.25em', fontWeight: 'bold', mt: 2, mb: 1 },
        '& p': { my: 1, lineHeight: 1.7 },
        '& ul, & ol': { pl: 3, my: 1 },
        '& li': { my: 0.5 },
        '& blockquote': {
          borderLeft: 4,
          borderColor: 'grey.300',
          pl: 2,
          ml: 0,
          color: 'text.secondary',
        },
        '& code': {
          bgcolor: 'grey.100',
          px: 0.5,
          borderRadius: 0.5,
          fontFamily: 'monospace',
          fontSize: '0.9em',
        },
        '& pre': {
          bgcolor: 'grey.100',
          p: 2,
          borderRadius: 1,
          overflow: 'auto',
          '& code': {
            bgcolor: 'transparent',
            px: 0,
          },
        },
        '& table': {
          borderCollapse: 'collapse',
          width: '100%',
          my: 1,
        },
        '& th, & td': {
          border: 1,
          borderColor: 'divider',
          px: 1.5,
          py: 0.75,
        },
        '& th': {
          bgcolor: 'grey.100',
          fontWeight: 'bold',
        },
        '& a': {
          color: 'primary.main',
          textDecoration: 'underline',
        },
        '& hr': {
          border: 'none',
          borderTop: 1,
          borderColor: 'divider',
          my: 2,
        },
        '& img': {
          maxWidth: '100%',
        },
      }}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </Box>
  )
}
