require('dotenv').config()
import express, { NextFunction, Request, Response } from 'express'
import authRoutes from "./routes/auth"
import productRoutes from "./routes/product"
import shopRoutes from "./routes/shop"
import cartRoutes from "./routes/cart"
import transactionRoutes from "./routes/transaction"
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import multer, { FileFilterCallback } from 'multer'
import path from 'path'
import { validate_token } from './middleware/middleware'

const app = express()

// File Storage Handling
const fileStorage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
        cb(null, 'images')
    },
    filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
        cb(null, crypto.randomUUID() + '.png')
    }
})

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

// BodyParser
app.use(bodyParser.json())

// Handle CORS
app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader("Access-Control-Allow-Origin", '*')
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
    next()
})

// Handle Upload File
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'))

// API
app.use(authRoutes)
app.use(validate_token, productRoutes)
app.use(validate_token, shopRoutes)
app.use(validate_token, cartRoutes)
app.use(validate_token, transactionRoutes)

// Error Handling
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const status = err.statusCode || 500;
    const msg = err.msg || 'Internal Server Error';
    const data = err.data || {};

    res.status(status).json({ msg: msg, data: data });
})

mongoose
    .connect('mongodb://127.0.0.1:27017/express-database')
    .then(res => {
        app.listen(8080)
    })
    .catch(err => console.log(err))