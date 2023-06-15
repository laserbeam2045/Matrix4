import express from 'express'
import cors from 'cors'

import { morganMiddleware } from './middleware/morgan'

import selectTree from './routes/selectTree'
import createNode from './routes/createNode'
import updateNode from './routes/updateNode'
import deleteNode from './routes/deleteNode'
import deleteTree from './routes/deleteTree'
import movingNode from './routes/movingNode'
import movingTree from './routes/movingTree'

const app: express.Express = express()

app.use(express.json())
app.use(cors())

app.use(morganMiddleware)
app.use(selectTree)
app.use(createNode)
app.use(updateNode)
app.use(deleteNode)
app.use(deleteTree)
app.use(movingNode)
app.use(movingTree)

const PORT = 1234

app.listen(PORT, () => console.log('Server running.'))
