import { Router } from "express";
import { body } from "express-validator";
import User from "../models/user";
import Product from "../models/product";
import ProductVariant from "../models/product-variant";
import { decrement_cart_product, delete_cart, increment_cart_product, update_cart } from "../controllers/cart";
import Cart from "../models/cart";

const router = Router()

const validate_cart = [
    body('user_id').custom(async (value) => {
        const user = await User.findById(value)
        if(!user) return Promise.reject("User does not exist")
    }),
    body('product_id').custom(async (value) => {
        const product = await Product.findById(value)
        if(!product) return Promise.reject("Product does not exist")
    }),
    body('product_variant_id').custom(async (value) => {
        const product_variant = await ProductVariant.findById(value)
        if(!product_variant) return Promise.reject("Product does not exist")
    })
]

router.post('/cart/increment', 
    validate_cart, 
    increment_cart_product
)

router.post('/cart/decrement',
    validate_cart,
    decrement_cart_product
)

router.put('/cart/:id', [
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
], update_cart)

router.delete('/cart/:id', delete_cart)

export default router