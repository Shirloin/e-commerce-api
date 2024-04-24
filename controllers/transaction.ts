import { NextFunction, Response } from "express";
import { IRequest } from "../interfaces/request-interface";
import { validationResult } from "express-validator";
import TransactionHeader from "../models/transaction-header";
import TransactionDetail from "../models/transaction-detail";
import User from "../models/user";
import Shop from "../models/shop";
import Cart from "../models/cart";
import { IError } from "../interfaces/error-interface";

export async function create_transaction(req: IRequest, res: Response, next: NextFunction) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const error = new Error('Validation Failed') as IError
        error.statusCode = 422
        error.msg = errors.array()[0].msg
        return next(error)
    }
    const { shop_id, product_variants } = req.body
    const { user_id } = req.user
    try {

        const user = await User.findById(user_id)
        if (!user) {
            const error = new Error("User not found") as IError
            error.statusCode = 404
            throw error
        }
        const shop = await Shop.findById(shop_id)
        if (!shop) {
            const error = new Error("Shop not found") as IError
            error.statusCode = 404
            throw error
        }

        const transaction = await TransactionHeader.create({
            user: user_id,
            shop: shop_id
        })
        for (const pv of product_variants) {
            const transaction_detail = await TransactionDetail.create({
                quantity: pv.quantity,
                product_variant: pv.id,
                transaction_header: transaction._id
            })
            transaction.transaction_details.push(transaction_detail._id)
            await transaction.save()
        }
        user.transactions.push(transaction._id)
        user.save()
        shop.transactions.push(transaction._id)
        await shop.save()
        return res.status(201).json({message: "Checkout successfull", transaction: transaction})
    } catch (error) {
        next(error)
    }
}

export async function get_user_transactions(req: IRequest, res: Response, next: NextFunction){
    const {user_id} = req.user 
    try {
        const transactions = await TransactionHeader.find({user: user_id}).populate({
            path: 'transaction_details',
            populate: {
                path: 'product_variant'
            }
        }).populate('shop')
        return res.status(200).json({transactions: transactions})
    } catch (error) {
        next(error)
    }
}

export async function get_shop_transactions(req: IRequest, res: Response, next: NextFunction){
    const {user_id} = req.user 
    try {
        const shop = await Shop.findOne({user: user_id})
        if(!shop){
            const error = new Error("Shop not found") as IError
            error.statusCode = 404
            throw error
        }
        const transactions = await TransactionHeader.find({shop: shop._id}).populate({
            path: 'transaction_details',
            populate: {
                path: 'product_variant'
            }
        }).populate('user')
        return res.status(200).json({transactions: transactions})
    } catch (error) {
        next(error)
    }
}