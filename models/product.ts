import mongoose, { Schema } from "mongoose";
import { IShop } from "./shop";
import { IProductVariant } from "./product-variant";
import { IProductCategory } from "./product-category";
import { ITransactionDetail } from "./transaction-detail";
import { ICart } from "./cart";

export interface IProduct {
    name: string
    description: string
    shop: IShop
    product_variants: IProductVariant[]
    product_categories: IProductCategory[]
    transaction_details: ITransactionDetail[]
    carts: ICart[]
}


const product_schema = new Schema({
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

const Product = mongoose.model('Product', product_schema)
export default Product