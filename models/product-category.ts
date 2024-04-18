import mongoose, { Schema } from "mongoose";

const product_category_schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    products: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }
}, { timestamps: true })

const ProductCategory = mongoose.model('ProductCategory', product_category_schema)
export default ProductCategory