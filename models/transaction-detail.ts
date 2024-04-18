import mongoose from "mongoose";
import { Schema } from "mongoose";

const transaction_detail_schema = new Schema({
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