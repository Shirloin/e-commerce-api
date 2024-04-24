import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import { IRequest } from "../interfaces/request-interface";
import { IError } from "../interfaces/error-interface";

const SECRET_KEY = process.env.JWT_SECRET_KEY || "JWT_SECRET_KEY"

export async function register(req: IRequest, res: Response, next: NextFunction) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const error = new Error('Validation Failed') as IError
        error.statusCode = 422
        error.msg = errors.array()[0].msg
        return next(error)
    }
    const { username, email, password } = req.body
    try {
        const hashedPw = bcryptjs.hash(password, 12)
        const user = await User.create({
            username: username,
            email: email,
            password: hashedPw
        })
        res.status(201).json({ msg: 'Register Successfull', user_id: user._id })
    } catch (error) {
        next(error)
    }
}

export async function login(req: IRequest, res: Response, next: NextFunction) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const error = new Error('Validation Failed') as IError
        error.statusCode = 422
        error.msg = errors.array()[0].msg
        return next(error)
    }
    const { username, password } = req.body
    try {
        const user = await User.findOne({ username: username })
        if (!user) {
            const error = new Error('Username not found') as IError;
            error.statusCode = 404;
            throw error;
        }
        const isEqual = await bcryptjs.compare(password, user.password)
        if (!isEqual) {
            const error = new Error('Wrong password') as IError;
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign({
            user_id: user._id.toString(),
        },
            SECRET_KEY, { expiresIn: '24h' })
        res.status(200).json({ token: token, user: user, })
    } catch (error) {
        next(error)
    }
}