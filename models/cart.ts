import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./user";
import { IProduct } from "./product";
import { IProductVariant } from "./product-variant";

export interface ICart extends Document{
    quantity: number
    user: IUser
    product: IProduct
    product_variant: IProductVariant
    createdAt: Date
    updatedAt: Date
}

const cart_schema = new Schema<ICart>({
    quantity: {
        type: Number,
        default: 1
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    product_variant: {
        type: Schema.Types.ObjectId,
        ref: 'ProductVariant'
    },
}, { timestamps: true })

const Cart = mongoose.model<ICart>('Cart', cart_schema)
export default Cart