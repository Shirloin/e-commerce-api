import mongoose, { Document, Schema } from "mongoose";
import { IProduct } from "./product";
import { ITransactionDetail } from "./transaction-detail";
import { ICart } from "./cart";

export interface IProductVariant extends Document {
    name: string
    price: number
    image_url: string
    stock: number
    product: IProduct
    transaction_details: ITransactionDetail[]
    carts: ICart[]
    createdAt: Date
    updatedAt: Date
}

const product_variant_schema = new Schema<IProductVariant>({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    image_url: {
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    transaction_details: [
        {
            type: Schema.Types.ObjectId,
            ref: 'TransactionDetail'
        }
    ],
    carts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Cart'
        }
    ]
}, { timestamps: true })

const ProductVariant = mongoose.model<IProductVariant>('ProductVariant', product_variant_schema)
export default ProductVariant