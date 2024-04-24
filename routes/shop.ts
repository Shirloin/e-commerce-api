import { Router } from "express";
import { body } from "express-validator";
import { create_shop, delete_shop, get_shop, get_shops } from "../controllers/shop";
import User from "../models/user";
import Shop from "../models/shop";
import { delete_products, update_products } from "../controllers/product";

const router = Router()

const validate_shop = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage("Shop name must be filled"),
    body('description')
        .trim()
        .notEmpty()
        .withMessage("Shop desription must be filled"),
]

router.post('/shop', [
    ...validate_shop
], create_shop)

router.get('/shops', get_shops)

router.get('/shop/:id', get_shop)

router.put('/shop/:id', [
    ...validate_shop
], update_products)

router.delete('/shop/:id', delete_shop)

export default router