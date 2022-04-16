import {request, Router} from "express";
import {auth} from "../midlwares/auth.midleware.js";
import Task from "../models/Task.js";
import User from "../models/User.js";
import {check, validationResult} from "express-validator";
import task from "../models/Task.js";
const taskRouter = Router()

export {taskRouter}

taskRouter.post(
    '/add',
    auth,
    [
        check('title').isString().isLength({min: 3, max: 255}),
        check('state').isNumeric(),
        check('userId').exists()
    ],
    async  (req, res) => {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                console.log(errors)
                return res.status(500).json({message: errors.join(' ')})
            }

            const {state ,title, userId} = req.body
            const task = new Task({
                state,
                title,
                user: userId
            })

            await task.save()

            await User.findByIdAndUpdate(userId, {
                $push: {tasks: task._id}
            })

            res.sendStatus(200)

        } catch (e) {
            res.status(500).json({message: "Unexpected error on adding new task"})
            console.log(e.message)
        }
    }
)

taskRouter.post(
    '/',
    auth,
    [
        check('userId').exists()
    ],
    async (req, res) => {
        try {
            const {userId} = req.body

            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(500).json({message: errors.join(' ')})
            }

            const user = await User.findById(userId)

            if(!user) res.status(404).json({message: "User not found"})

            const {tasks} = await user.populate('tasks')

            const taskArr = tasks.map(({id, title, state}) => {
                return {
                    id,
                    title,
                    state
                }
            })

            res.status(200).json({
                data: taskArr
            })
        } catch (e) {
            res.status(500).json({message: "Unexpected error on getting task list"})
            console.log(e.message)
        }
    }
)

taskRouter.post(
    '/clear',
    auth,
    [
        check('userId').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)

            const {userId} = req.body

            if (!errors.isEmpty()) {
                return res.status(500).json({message: errors.join(' ')})
            }

            await Task.deleteMany({user: userId})
            await User.updateOne({user: userId}, {tasks: []})

            res.sendStatus(200)

        } catch (e) {
            res.status(500).json({message: "Unexpected error on clearing tasks"})
            console.log(e.message)
        }
    }
)

taskRouter.post(
    '/update',
    auth,
    [
        check('userId').exists(),
        check('taskId').exists(),
        check('title').exists(),
        check('state').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(500).json({message: "Wrong UserId"})
            }
            const {userId, taskId, title, state} = req.body


            const user = await User.findById(userId)
            if (!user) res.json({message: "User not found"})

            await Task.findByIdAndUpdate(taskId, {title, state})

            res.sendStatus(200)

        } catch (e) {
            res.status(500).json({message: "Unexpected error on updating task"})
            console.log(e.message)
        }
    }
)
