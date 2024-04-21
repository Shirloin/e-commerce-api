import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./user";
import { IProduct } from "./product";
import { ITransactionHeader } from "./transaction-header";

export interface IShop extends Document {
    id: string
    name: string
    description: string
    banner_url: string
    image_url: string
    user: IUser
    transactions: ITransactionHeader[]
    products: IProduct[]
    createdAt: Date
    updatedAt: Date
}

const shop_schema = new Schema<IShop>({
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
        default: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YmFubmVyJTIwYmFja2dyb3VuZHxlbnwwfHwwfHx8MA%3D%3D"
    },
    image_url: {
        type: String,
        default: "https://plus.unsplash.com/premium_photo-1666739387925-5841368970a7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2hvcHBpbmd8ZW58MHx8MHx8fDA%3D"
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



const Shop = mongoose.model<IShop>('Shop', shop_schema)
export default Shop