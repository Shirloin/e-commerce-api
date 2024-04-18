import mongoose, { Schema } from "mongoose";

const shop_schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    banner_url: {
        type: String,
        required: true,
    },
    image_url: {
        type: String,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    transactions: [
        {
            type: Schema.Types.ObjectId,
            ref: 'TransactionHeader'
        }
    ],
    products: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }
    ]
}, { timestamps: true })

const Shop = mongoose.model('Shop', shop_schema)
export default Shop