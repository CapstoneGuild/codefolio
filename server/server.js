import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()

const PORT = process.env.PORT || 3001

const app = express()

app.use(
    cors({
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        credentials: true,
    })
)
app.use(express.json())

app.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}`)
})
