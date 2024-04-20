import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import Product from "../models/product";

export async function create_product(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const error = new Error('Validation Failed') as any
        error.statusCode = 422
        error.message = errors.array()[0].msg
        throw error
    }
    const product_name = req.body.name
    const product_description = req.body.description
    const shop_id = req.body.shop_id

    const product_variants = req.body.product_variants
    const product = await new Product({
        name: product_name,
        description: product_description,
        shop: shop_id
    }).save()
    return res.status(201).json({ product: product })
}