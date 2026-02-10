import { Hono } from 'hono'
import type { AuthEnv } from '@/middleware/auth'
import health from './routes/health'
import posts from './routes/posts'
import categories from './routes/categories'
import assets from './routes/assets'

const app = new Hono<AuthEnv>()

app.route('/', health)
app.route('/posts', posts)
app.route('/categories', categories)
app.route('/assets', assets)

export default app
