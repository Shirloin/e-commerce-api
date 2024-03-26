import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

const SECRET_KEY = process.env.JWT_SECRET_KEY || "JWT_SECRET_KEY"

export function register(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const error = new Error('Validation Failed') as any
        error.statusCode = 422
        error.data = errors.array()
        throw error
    }
    const username = req.body.username
    const email = req.body.email
    const password = req.body.password
    bcryptjs.hash(password, 12)
        .then(hashedPw => {
            const user = new User({
                username: username,
                email: email,
                password: hashedPw
            })
            return user.save()
        })
        .then(result => {
            res.status(201).json({ message: 'Register Successfull', userId: result._id })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500
            }
            next(err)
        })
}

export function login(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const error = new Error('Validation Failed') as any
        error.statusCode = 422
        error.data = errors.array()
        throw error
    }
    const username = req.body.username
    const password = req.body.password
    let loadedUser: any = null
    User.findOne({ username: username })
        .then(user => {
            if (!user) {
                const error = new Error('A user with this email could not be found') as any
                error.statusCode = 401
                throw error
            }
            loadedUser = user
            return bcryptjs.compare(password, user.password)
        })
        .then(isEqual => {
            if (!isEqual) {
                const error = new Error('Wrong Password!') as any
                error.statusCode = 401
                throw error
            }
            const token = jwt.sign({
                username: loadedUser.username,
                userId: loadedUser._id.toString()
            },
                SECRET_KEY, { expiresIn: '1h' })
            res.status(200).json({ token: token, userId: loadedUser._id.toString() })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500
            }
            next(err)
        })


}