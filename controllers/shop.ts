import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import Shop from "../models/shop";
import ProductVariant from "../models/product-variant";
import Product from "../models/product";
import { IRequest } from "../interfaces/request-interface";
import User from "../models/user";
import { IError } from "../interfaces/error-interface";

export async function create_shop(req: IRequest, res: Response, next: NextFunction) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const error = new Error('Validation Failed') as IError
        error.statusCode = 422
        error.msg = errors.array()[0].msg
        return next(error)
    }
    const { name, description } = req.body
    const { user_id } = req.user
    try {
        const user = await User.findById(user_id)
        if (!user) {
            const error = new Error('User not found') as IError;
            error.statusCode = 404;
            throw error;
        }
        const shop = await Shop.create({
            name: name,
            description: description,
            user: user_id
        })
        user.shop = shop
        await user.save()
        res.status(201).json({ message: "Create shop success", shop: shop })
    } catch (error) {
        next(error)
    }
}

export async function get_shops(req: IRequest, res: Response, next: NextFunction) {
    try {
        const shops = await Shop.find().populate({
            path: 'products',
            populate: {
                path: 'product_variants'
            }
        })
        return res.status(200).json({ shops: shops })
    } catch (error) {
        next(error)
    }
}

export async function get_shop(req: IRequest, res: Response, next: NextFunction) {
    const { id } = req.params
    try {
        const shop = await (await Shop.findById(id)).populate({
            path: 'products',
            populate: {
                path: 'product_variants'
            }
        })
        if (!shop) {
            const error = new Error("Shop not found") as IError
            error.statusCode = 404
            throw error
        }
        return res.status(200).json({ shop: shop })
    } catch (error) {
        next(error)
    }
}

export async function update_shop(req: IRequest, res: Response, next: NextFunction) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const error = new Error('Validation Failed') as IError
        error.statusCode = 422
        error.msg = errors.array()[0].msg
        return next(error)
    }
    const { name, description } = req.body
    const { id } = req.params
    try {
        const shop = await Shop.findById(id)
        if (!shop) {
            const error = new Error("Shop not found") as IError
            error.statusCode = 404
            throw error
        }
        shop.name = name
        shop.description = description
        await shop.save()
        return res.status(200).json({ shop: shop })
    } catch (error) {
        next(error)
    }
}

export async function delete_shop(req: IRequest, res: Response, next: NextFunction) {
    const { id } = req.params
    try {
        const shop = await Shop.findByIdAndDelete(id)
        if (!shop) {
            const error = new Error("Shop not found") as IError
            error.statusCode = 404
            throw error
        }
        for (const product of shop.products) {
            await Product.deleteOne({ _id: product._id })
            await ProductVariant.deleteMany({ product: product._id })
        }
        return res.status(200).json({ message: "Delete shop success" })
    } catch (error) {
        next(error)
    }
}