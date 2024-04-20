import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import Product from "../models/product";
import ProductVariant from "../models/product-variant";

export async function create_product(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
        // const error = new Error('Validation Failed') as any
        // error.statusCode = 422
        // error.message = errors.array()[0].msg
        // throw error
    }
    const product_name = req.body.name
    const product_description = req.body.description
    const shop_id = req.body.shop_id

    const product_variants = req.body.product_variants

    try {
        const product = await Product.create({
            name: product_name,
            description: product_description,
            shop: shop_id
        })
        for (const pv of product_variants) {
            const product_variant = await ProductVariant.create({
                name: pv.name,
                price: pv.price,
                image_url: pv.image_url,
                stock: pv.stock,
                product: product._id
            })
            product.product_variants.push(product_variant._id)
            await product.save()
        }
        return res.status(201).json({ product: product })
    } catch (error) {
        console.error("Error creating product or variants: ", error)
        return res.status(500).json({ error: error })
    }


}