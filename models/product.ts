import mongoose, { Document, Schema } from "mongoose";
import { IShop } from "./shop";
import { IProductVariant } from "./product-variant";
import { IProductCategory } from "./product-category";
import { ITransactionDetail } from "./transaction-detail";
import { ICart } from "./cart";

export interface IProduct extends Document {
    name: string
    description: string
    shop: IShop
    product_variants: IProductVariant[]
    product_categories: IProductCategory[]
    transaction_details: ITransactionDetail[]
    carts: ICart[]
    createdAt: Date
    updatedAt: Date
}


const product_schema = new Schema<IProduct>({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop',
        required: true
    },
    product_variants: [
        {
            type: Schema.Types.ObjectId,
            ref: 'ProductVariant'
        }
    ],
    product_categories: [
        {
            type: Schema.Types.ObjectId,
            ref: 'ProductCategory'
        }
    ],
    carts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Cart'
        }
    ]
}, { timestamps: true })

const Product = mongoose.model<IProduct>('Product', product_schema)
export default Product