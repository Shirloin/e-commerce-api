import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"

const SECRET_KEY = process.env.JWT_SECRET_KEY || "JWT_SECRET_KEY"

export function validate_token(req: Request, res: Response, next: NextFunction){
    const authHeader = req.get("authorization")
    if(!authHeader){
        return false
    }
    const token = authHeader.split(' ')[1]
    let decodedToken: {user_id: string}
    try {
        decodedToken = jwt.verify(token, SECRET_KEY) as {user_id: string}
    } catch (error) {
        return next()
    }
    if(!decodedToken){
        return next()
    }
    next()
}