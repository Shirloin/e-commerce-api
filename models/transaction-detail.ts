import mongoose from "mongoose";
import { Schema } from "mongoose";
import { ITransactionHeader } from "./transaction-header";
import { IProduct } from "./product";
import { IProductVariant } from "./product-variant";

export interface ITransactionDetail {
    quantity: number
    transaction_header: ITransactionHeader
    product: IProduct
    product_variant: IProductVariant
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
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    product_variant: {
        type: Schema.Types.ObjectId,
        ref: 'ProductVariant'
    },
})

const TransactionDetail = mongoose.model('TransactionDetail', transaction_detail_schema)
export default TransactionDetail