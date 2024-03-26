import { Router } from "express";
import { register, login } from "../controllers/auth";
import { body } from "express-validator";
import User from "../models/user";

const router = Router()

router.post('/login', [
    body('username').trim().notEmpty().withMessage('Username must be filled'),
    body('password').trim().notEmpty().withMessage('Password must be filled')
],
    login
)

router.put('/register', [
    body('username')
        .trim()
        .isLength({ min: 3 }).withMessage("Username length must be at least 3 characters")
        .custom((value, { req }) => {
            return User.findOne({ username: value }).then(userDoc => {
                if (userDoc) {
                    return Promise.reject('Username already exists')
                }
            })
        }),
    body('email')
        .isEmail().withMessage("Please enter a valid email")
        .custom((value, { req }) => {
            return User.findOne({ email: value }).then(userDoc => {
                if (userDoc) {
                    return Promise.reject('Email already exists')
                }
            })
        }).normalizeEmail(),
    body('password')
        .trim()
        .isLength({ min: 3 }).withMessage("Password length must be at least 3 characters")
        .isAlphanumeric().withMessage('Password must be alphanumeric'),
],
    register
)

export default router