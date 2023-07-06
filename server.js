import connectDB from "./db/connect.js";
import express from 'express'
import 'dotenv/config'

import userRouter from './routes/userRoutes.js'
import courseRouter from './routes/courseRoutes.js'
import studentRouter from './routes/studentRoutes.js'

import cipsStudentRouter from './routes/cipsStudentRoutes.js'
import cors from 'cors'
import { pathURL } from "./utils.js";


const app = express()
app.use(express.json())

app.use(cors({
    origin: pathURL
}))

app.use("/uploads", express.static('uploads'))

//Routes
app.use('/api/v1/user', userRouter)
app.use('/api/v1/course', courseRouter)
app.use('/api/v1/student', studentRouter)
app.use('/api/v1/cips', cipsStudentRouter)


const port = process.env.PORT || 5000
const start = async () => {

    try {
        connectDB(process.env.MONGO_URI)
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}...`);
        })
    } catch (error) {
        console.log(error);
    }
}

start()