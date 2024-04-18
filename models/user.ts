import mongoose from "mongoose";
import { Schema } from "mongoose";

const user_schema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    dob: {
        type: String,
        required: false
    },
    gender: {
        type: String,
        required: false
    },
    image_url: {
        type: String,
        required: false,
        default: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHBlcnNvbnxlbnwwfHwwfHx8MA%3D%3D"
    },
    phone: {
        type: String,
        required: false
    },
    shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    },
    transactions: [
        {
            type: Schema.Types.ObjectId,
            ref: 'TransactionHeader'
        }
    ],
    carts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Cart'
        }
    ],
}, { timestamps: true })

const User = mongoose.model('User', user_schema)

export default User