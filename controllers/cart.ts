import { NextFunction, Request, Response } from "express";
import Cart from "../models/cart";
import { validationResult } from "express-validator";
import Shop from "../models/shop";
import { IRequest } from "../interfaces/request-interface";

export async function get_carts(req: IRequest, res: Response, next: NextFunction) {
    const { user_id } = req.user
    try {
        const carts = await Cart.find({ user: user_id }).populate('products').populate('product_variants')
        return res.status(200).json({ carts: carts })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Error fetching carts" })
    }
}

export async function add_to_cart(req: IRequest, res: Response, next: NextFunction) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }
    const { product_id, product_variant_id } = req.body
    const { user_id } = req.user
    try {
        const cart = await Cart.findOne({
            user: user_id,
            product: product_id,
            product_variant: product_variant_id
        })
        if (!cart) {
            const newCart = await Cart.create({
                user: user_id,
                product: product_id,
                product_variant: product_variant_id
            })
            return res.status(200).json({ cart: newCart })
        }
        const updatedCart = await Cart.findByIdAndUpdate(cart.id, { quantity: { $inc: 1 } })
        return res.status(200).json({ cart: updatedCart })
    } catch (error) {
        return res.status(500).json({ error: "Error add item to cart" })
    }
}

export async function increment_cart_product(req: IRequest, res: Response, next: NextFunction) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }
    const { id } = req.params
    try {
        const cart = await Cart.findByIdAndUpdate(
            id, 
            { $inc: { quantity: 1 } }, 
            { new: true }
        )
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" })
        }
        return res.status(200).json({ cart: cart })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Error increase item to cart" })
    }
}

export async function decrement_cart_product(req: IRequest, res: Response, next: NextFunction) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }
    const { id } = req.params
    try {
        const cart = await Cart.findByIdAndUpdate(
            id, 
            { $inc: { quantity: -1 } }, 
            { new: true }
        )
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" })
        }
        if (cart.quantity < 1) {
            await Cart.findByIdAndDelete(id)
            return res.status(200).json({ message: "Cart item removed" })
        }
        return res.status(200).json({ cart: cart })
    } catch (error) {
        return res.status(500).json({ error: "Error decrease item to cart" })
    }
}

export async function update_cart(req: IRequest, res: Response, next: NextFunction) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }
    const { quantity } = req.body
    const { id } = req.params
    try {
        const cart = await Cart.findById(id)
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" })
        }
        cart.quantity = quantity
        await cart.save()
        return res.status(200).json({ cart: cart })
    } catch (error) {
        return res.status(500).json({ error: "Error updating cart" })
    }
}

export async function delete_cart(req: IRequest, res: Response, next: NextFunction) {
    const { id } = req.params
    try {
        const cart = await Cart.findByIdAndDelete(id)
        if (!cart) {
            return res.status(404).json({ error: "Cart not found" })
        }
        return res.status(200).json({ message: "Remove cart success" })
    } catch (error) {
        return res.status(500).json({ error: "Error removing cart" })
    }
}