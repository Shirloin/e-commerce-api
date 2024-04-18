import mongoose, { Schema } from "mongoose";

const cart_schema = new Schema({
    quantity: {
        type: Number,
        required: true,
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

const Cart = mongoose.model('Cart', cart_schema)
export default Cart