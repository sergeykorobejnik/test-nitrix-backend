import {Router} from "express";
import {check, validationResult} from "express-validator";
import User from "../models/User.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import config from "config";


const authRouter = Router()

authRouter.post('/', async (req, res) => {


    const { token } = req.body

    if(!token) return res.status(400).json({
        message: "Unexpected Token"
    })

    const isAuth = jwt.verify(token, config.get("jwt"))

    if(!isAuth) return res.status(401).json({message: "Token expired"})

    res.status(200).json({message: "Auth success"})

})

authRouter.post('/register',
    [
        check('email').normalizeEmail().isEmail(),
        check('password').isLength({min: 6, max: 255})
    ],
    async (req, res) => {
    try {
        const {email, password} = req.body
        const errors = validationResult(req)

        if(!errors.isEmpty()) {
            return res.status(400).json({
                message: "Wrong request"
            })
        }

        const isRegistered = await User.findOne({email: email})

        if(isRegistered) return res.status(400).json({
            message: "This user already exist"
        })

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = new User({
            email: email,
            password: hashedPassword
        })

        await user.save()

        const token = jwt.sign(
            {userId: user.id},
            config.get("jwt"),
            {expiresIn: '1d'}
        )

        res.status(200).json({
            token: token,
            userId: user.id
        })

    } catch (e) {
        console.log(e.message)
        res.status(500).json({message: "Unexpected error"})
    }
})

authRouter.post ('/login',
    [
        check('email').normalizeEmail().isEmail(),
        check('password').isLength({min: 6, max: 255})
    ],
    async (req, res) => {
        try {

            const {email, password} = req.body


            const errors = validationResult(req)

            if(!errors.isEmpty()) {
                return res.status(400).json({
                    message: "Wrong data"
                })
            }


            const user = await User.findOne({email: email})


            if(!user) {
                return res.status(400).json({
                    message: "User not found"
                })
            }

            const isPassword = bcrypt.compare(password, user.password)

            if(!isPassword) return res.status(400).json({message: "Wrong password"})

            const token = jwt.sign(
                {userId: user.id},
                config.get("jwt"),
                {expiresIn: '1d'}
            )

            res.status(200).json({
                token: token,
                userId: user.id
            })


        } catch (e) {
            console.log(e.message)
            res.status(500).json({message: "Unexpected error"})
        }

    })

export {authRouter}