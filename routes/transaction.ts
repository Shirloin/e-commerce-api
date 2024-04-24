import { Router } from "express";
import { body } from "express-validator";
import ProductVariant from "../models/product-variant";
import { create_transaction, get_shop_transactions, get_user_transactions } from "../controllers/transaction";
import Shop from "../models/shop";

const router = Router()

const validate_product = [
    body('shop_id').custom(async (value) => {
        const shop = await Shop.findById(value)
        if (!shop) return Promise.reject("Shop does not exist")
    }),
    body('product_variants').isArray({ min: 1 }).withMessage('Product variant must be at least one'),
    body('product_variants.*.id').custom(async (value) => {
        const product_variant = await ProductVariant.findById(value)
        if (!product_variant) return Promise.reject("Product does not exist")
    }),
    body('product_variants.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
]

router.post('/transactions', validate_product, create_transaction)

router.get('/transactions/user', get_user_transactions)
router.get('/transactions/shop', get_shop_transactions)

export default router