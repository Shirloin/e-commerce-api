import mongoose, { Document } from "mongoose";
import { Schema } from "mongoose";
import { ITransactionHeader } from "./transaction-header";
import { IProduct } from "./product";
import { IProductVariant } from "./product-variant";

export interface ITransactionDetail extends Document{
    quantity: number
    transaction_header: ITransactionHeader
    product_variant: IProductVariant
    createdAt: Date
    updatedAt: Date
}

const transaction_detail_schema = new Schema<ITransactionDetail>({
    quantity: {
        type: Number,
        required: true
    },
    transaction_header: {
        type: Schema.Types.ObjectId,
        ref: 'TransactionHeader'
    },
    product_variant: {
        type: Schema.Types.ObjectId,
        ref: 'ProductVariant'
    },
})

const TransactionDetail = mongoose.model<ITransactionDetail>('TransactionDetail', transaction_detail_schema)
export default TransactionDetail