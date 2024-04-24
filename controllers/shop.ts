import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import Shop from "../models/shop";
import ProductVariant from "../models/product-variant";
import Product from "../models/product";
import { IRequest } from "../interfaces/request-interface";
import User from "../models/user";

export async function create_shop(req: IRequest, res: Response, next: NextFunction) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }
    const { name, description } = req.body
    const { user_id } = req.user
    try {
        const user = await User.findById(user_id)
        if(!user){
            return res.status(404).json({error: "User not found"})
        }
        const shop = await Shop.create({
            name: name,
            description: description,
            user: user_id
        })
        user.shop = shop
        await user.save()
        res.status(201).json({message: "Create shop success",shop: shop})
    } catch (error) {
        return res.status(500).json({error: "Error creating shop"})
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
        return res.status(500).json({ error: "Error fetching shops" })
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
            return res.status(404).json({ error: "Shop not found" })
        }
        return res.status(200).json({ shop: shop })
    } catch (error) {
        console.log(`Error fetching shop: `, error)
        return res.status(500).json({ error: "Error fetching shop" })
    }
}

export async function update_shop(req: IRequest, res: Response, next: NextFunction) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }
    const { name, description } = req.body
    const { id } = req.params
    try {
        const shop = await Shop.findById(id)
        if (!shop) {
            return res.status(404).json({ error: "Shop not found" })
        }
        shop.name = name
        shop.description = description
        await shop.save()
        return res.status(200).json({ shop: shop })
    } catch (error) {
        return res.status(500).json({ error: "Error updating shop" })
    }
}

export async function delete_shop(req: IRequest, res: Response, next: NextFunction) {
    const { id } = req.params
    try {
        const shop = await Shop.findByIdAndDelete(id)
        if (!shop) {
            return res.status(404).json({ error: "Shop not found" })
        }
        for (const product of shop.products) {
            await Product.deleteOne({ _id: product._id })
            await ProductVariant.deleteMany({ product: product._id })
        }
        return res.status(200).json({ message: "Delete shop success" })
    } catch (error) {
        return res.status(500).json({ error: "Error deleting shop" })
    }
}