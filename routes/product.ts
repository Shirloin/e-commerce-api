import { Router } from "express";
import { body, validationResult } from "express-validator";
import Shop from "../models/shop";
import { create_product } from "../controllers/product";

const router = Router()

const validate_product = [
    body('name').trim().notEmpty().withMessage('Product name must be filled'),
    body('description').trim().notEmpty().withMessage('Product description must be filled'),
    body('shop_id').custom(async (value) => {
        const shop = await Shop.findById(value)
        if (!shop) return Promise.reject('Shop does not exist')
    }),
]

const validate_product_variant = [
    body('name').trim().notEmpty().withMessage('Product variant name must be filled'),
    body('price').isNumeric().withMessage('Price must be a valid number'),
    body('image_url').trim().notEmpty().withMessage('Image URL must be provided'),
    body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
];

router.post('/product', [
    ...validate_product,
    body('product_variants').isArray({ min: 1 }).withMessage('Product variant must be at least one'),
    body('product_variants').custom(async (value, { req }) => {
        for (const variant of value) {
            await Promise.all(validate_product_variant.map(fn => fn.run(req)))
        }
        return true
    })
], create_product)

export default router

