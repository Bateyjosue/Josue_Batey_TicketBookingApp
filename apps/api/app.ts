import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import authRouter from './routes/auth'
import eventsRouter from './routes/events'
import bookingsRouter from './routes/bookings'
import cors from 'cors'
import helmet from 'helmet'
dotenv.config()

const app: Express = express()
app.use(express.json());

app.use(helmet())
app.use(cors())

app.get('/', (req: Request, res: Response) => {
  res.status(200).send('Here we are')
})
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/events', eventsRouter)
app.use('/api/v1/bookings', bookingsRouter)

export default app
