import { Router } from "express";
import { body, validationResult } from "express-validator";
import Shop from "../models/shop";
import { create_product, delete_products, get_product, get_products, update_products } from "../controllers/product";

const router = Router()

const validate_product = [
    body('name').trim().notEmpty().withMessage('Product name must be filled'),
    body('description').trim().notEmpty().withMessage('Product description must be filled')
]

const validate_product_variant = [
    body('product_variants').isArray({ min: 1 }).withMessage('Product variant must be at least one'),
    body('product_variants.*.name').trim().notEmpty().withMessage('Product variant name must be filled'),
    body('product_variants.*.price').isInt({ min: 1 }).withMessage('Price must be at least 1'),
    body('product_variants.*.image_url').trim().notEmpty().withMessage('Image URL must be provided'),
    body('product_variants.*.stock').isInt({ min: 1 }).withMessage('Stock must be at least 1'),
];

router.post('/product', [
    ...validate_product,
    ...validate_product_variant
], create_product)

router.get('/product/:id', get_product)

router.get("/products", get_products)

router.put("/product/:id", [
    ...validate_product
],
    update_products)

router.delete('/product/:id', delete_products)

export default router

