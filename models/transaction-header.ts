import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./user";
import { IShop } from "./shop";
import { ITransactionDetail } from "./transaction-detail";

export interface ITransactionHeader extends Document {
    user: IUser
    shop: IShop
    transaction_details: ITransactionDetail[]
    createdAt: Date
    updatedAt: Date
}

const transaction_header_schema = new Schema<ITransactionHeader>({
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

const TransactionHeader = mongoose.model<ITransactionHeader>('TransactionHeader', transaction_header_schema)
export default TransactionHeader