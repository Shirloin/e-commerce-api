import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import Shop from "../models/shop";

export function create_shop(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
        // const error = new Error('Validation Failed') as any
        // error.statusCode = 422
        // error.message = errors.array()[0].msg
        // error.data = errors.array()
        // throw error
    }
    const name = req.body.name
    const description = req.body.description
    const user_id = req.body.user_id
    const shop = new Shop({
        name: name,
        description: description,
        user: user_id
    })
    shop
        .save()
        .then(result => {
            res
                .status(201)
                .json({
                    message: "Create shop success",
                    shop: result
                })
        })

}

export function get_shop(req: Request, res: Response, next: NextFunction) {

}