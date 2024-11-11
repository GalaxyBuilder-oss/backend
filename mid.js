import express from "express"
import dotenv from "dotenv";
import jwt from "jsonwebtoken"
dotenv.config();

const middleware = express.Router()

middleware.use((req, res, next) => {
    const authorization = req.headers.authorization;
    if (authorization) {
        if (authorization.startsWith("Bearer ")) {
            const token = authorization.split(" ")[1];
            try {
                req.user = jwt.verify(token, process.env.SECRET_KEY);
                next();
            } catch (error) {
                console.error(error)
                res.status(400).send({ message: "Token tidak valid.", data: null, success: false });
            }
        }
        else {
            return res.status(500).send({ message: 'Otorisasi tidak valid (harus "Bearer").', data: null, success: false });
        }
    }
    else {
        return res.status(401).send({ message: "Anda belum login (tidak ada otorisasi).", data: null, success: false });
    }
})

export default middleware