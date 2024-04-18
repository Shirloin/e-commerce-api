import mongoose, { Schema } from "mongoose";

const product_variant_schema = new Schema({
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

const ProductVariant = mongoose.model('ProductVariant', product_variant_schema)
export default ProductVariant