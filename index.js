import express from "express"
import config from "config"
import mongoose from "mongoose";
import {authRouter} from "./rourtes/auth.routes.js";
import cors from "cors"
import {taskRouter} from "./rourtes/task.routes.js";


const app = express()

const PORT = process.env.PORT || config.get("port")
app.use(cors())
app.use(express.json())
app.use('/api/auth', authRouter)
app.use('/api/task', taskRouter)



async function start () {
    try {
        await mongoose.connect(config.get("mongoURI"))

        app.listen(PORT, () => {
            console.log(`SERVER RUNNING AT ${PORT}`)
        })

    } catch (e) {
        console.log("Server error", e.message)
    }
}

start()