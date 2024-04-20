import mongoose, { Schema } from "mongoose";
import { IProduct } from "./product";

export interface IProductCategory {
    name: string
    products: IProduct[]
}

const product_category_schema = new Schema<IProductCategory>({
    name: {
        type: String,
        required: true,
    },
    products: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }
    ]
}, { timestamps: true })

const ProductCategory = mongoose.model('ProductCategory', product_category_schema)
export default ProductCategory