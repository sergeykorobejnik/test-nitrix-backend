import jwt from "jsonwebtoken"
import config from "config";

const auth = (req, res, next) => {
    try {
        const { token } = req.body

        const isAuth = jwt.verify(token, config.get("jwt"))

        if(!isAuth) return res.status(400).json({message: "Token expired"})

        req.token = isAuth

    } catch (e) {
        return res.status(401).json({message: "Auth token token dosen`t exist"})
    }
    next()
}

export {auth}