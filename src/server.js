import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import morgan from "morgan"
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import gameRoutes from './routes/gameRoutes.js'
import cookieParser from 'cookie-parser'


const app = express()


app.use(morgan("dev"))
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())


// routes
app.use("/auth", authRoutes)
app.use("/users", userRoutes)
app.use("/game", gameRoutes)


export default app

