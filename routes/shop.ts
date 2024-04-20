import { Router } from "express";
import { body } from "express-validator";
import { create_shop } from "../controllers/shop";
import User from "../models/user";
import Shop from "../models/shop";

const router = Router()

router.post('/shop', [
    body('name')
        .trim()
        .notEmpty()
        .withMessage("Shop name must be filled"),
    body('description')
        .trim()
        .notEmpty()
        .withMessage("Shop desription must be filled"),
    body('user_id')
        .trim()
        .notEmpty()
        .withMessage("User does not exist")
        .custom(async (value, { req }) => {
            const user = await User.findById(value)
            if (!user) {
                return Promise.reject("User does not exist")
            }
            const shop = await Shop.findOne({ user: value })
            if (shop) {
                return Promise.reject("User has already created a shop")
            }
        })
], create_shop)

export default router