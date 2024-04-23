import { NextFunction, Request, Response } from "express";
import Cart from "../models/cart";
import { validationResult } from "express-validator";
import Shop from "../models/shop";

export async function increment_cart_product(req: Request, res: Response, next: NextFunction){
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }
    const {user_id, product_id, product_variant_id} = req.body
    try {
        const cart = await Cart.findOne({
            user: user_id,
            product: product_id,
            product_variant: product_variant_id
        })
        if(!cart){
            const newCart = await Cart.create({
                user: user_id,
                product: product_id,
                product_variant: product_variant_id,
                quantity: 1
            })
            return res.status(200).json({cart: newCart})
        }
        cart.quantity = cart.quantity + 1
        await cart.save()
        return res.status(200).json({cart: cart})
    } catch (error) {
        return res.status(500).json({error: "Error increase item to cart"})
    }
}

export async function decrement_cart_product(req: Request, res: Response, next: NextFunction){
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }
    const {user_id, product_id, product_variant_id} = req.body
    try {
        const cart = await Cart.findOne({
            user: user_id,
            product: product_id,
            product_variant: product_variant_id
        })
        if(!cart){
            return res.status(404).json({message: "Cart not found"})
        }
        cart.quantity = cart.quantity - 1
        await cart.save()
        return res.status(200).json({cart: cart})
    } catch (error) {
        return res.status(500).json({error: "Error decrease item to cart"})
    }
}

export async function update_cart(req: Request, res: Response, next: NextFunction){
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }
    const {quantity} = req.body
    const {id} = req.params
    try {
        const cart = await Cart.findById(id)
        if(!cart){
            return res.status(404).json({message: "Cart not found"})
        }
        cart.quantity = quantity
        await cart.save()
        return res.status(200).json({cart: cart})
    } catch (error) {
        return res.status(500).json({error: "Error updating cart"})
    }
}

export async function delete_cart(req: Request, res: Response, next: NextFunction){
    const {id} = req.params
    try {
        const cart = await Cart.findByIdAndDelete(id)
        if(!cart){
            return res.status(404).json({error: "Cart not found"})
        }
        return res.status(200).json({message: "Remove cart success"})
    } catch (error) {
        return res.status(500).json({error: "Error removing cart"})
    }
}