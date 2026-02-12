import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { createLogger } from '@headless-cms-practice/core'
import type { AuthEnv } from '@/middleware/auth'
import health from './routes/health'
import posts from './routes/posts'
import categories from './routes/categories'
import assets from './routes/assets'

const logger = createLogger('http')

const app = new Hono<AuthEnv>()

app.use('*', async (c, next) => {
  const method = c.req.method
  const path = c.req.path
  logger.info(`--> ${method} ${path}`)
  await next()
  const status = c.res.status
  logger.info(`<-- ${method} ${path} ${status}`)
})

app.use('*', cors({
  origin: process.env.CORS_ORIGIN?.split(',') ?? [],
}))

app.route('/', health)
app.route('/posts', posts)
app.route('/categories', categories)
app.route('/assets', assets)

export default app
