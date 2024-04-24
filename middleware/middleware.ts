import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import { IRequest } from "../interfaces/request-interface";

const SECRET_KEY = process.env.JWT_SECRET_KEY || "JWT_SECRET_KEY"

export function validate_token(req: IRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, SECRET_KEY as string, (err: any, user: any) => {

        if (err) return res.sendStatus(403)

        req.user = {
            user_id: user.user_id
        }

        next()
    })
}