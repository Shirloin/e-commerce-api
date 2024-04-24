import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import { IGetUserAuthInfoRequest } from "../interfaces/get-user-auth-info-request";

const SECRET_KEY = process.env.JWT_SECRET_KEY || "JWT_SECRET_KEY"

export function validate_token(req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, SECRET_KEY as string, (err: any, user: any) => {
        console.log(err)

        if (err) return res.sendStatus(403)

        req.user = user

        next()
    })
}