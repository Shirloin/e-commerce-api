import mongoose, { Schema } from "mongoose";
import { IUser } from "./user";
import { IShop } from "./shop";
import { ITransactionDetail } from "./transaction-detail";

export interface ITransactionHeader {
    date: Date
    user: IUser
    shop: IShop
    transaction_details: ITransactionDetail
}

const transaction_header_schema = new Schema({
    date: {
        type: Date,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop',
        required: true
    },
    transaction_details: [
        {
            type: Schema.Types.ObjectId,
            ref: 'TransactionDetail'
        }
    ],
}, { timestamps: true })

const TransactionHeader = mongoose.model('TransactionHeader', transaction_header_schema)
export default TransactionHeader