import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import Product from "../models/product";
import ProductVariant from "../models/product-variant";
import Shop from "../models/shop";

export async function create_product(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
        // const error = new Error('Validation Failed') as any
        // error.statusCode = 422
        // error.message = errors.array()[0].msg
        // throw error
    }
    const { name, description, shop_id, product_variants } = req.body;

    try {

        const product = await Product.create({
            name: name,
            description: description,
            shop: shop_id
        })
        for (const pv of product_variants) {
            const product_variant = await ProductVariant.create({
                name: pv.name,
                price: pv.price,
                image_url: pv.image_url,
                stock: pv.stock,
                product: product._id
            })
            product.product_variants.push(product_variant._id)
            await product.save()
        }
        const shop = await Shop.findById(shop_id)
        shop.products.push(product._id)
        await shop.save()
        return res.status(201).json({ product: product })
    } catch (error) {
        console.error("Error creating product or variants: ", error)
        return res.status(500).json({ error: error })
    }


}

export async function get_product(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    try {
        const product = await Product.findById(id).populate('product_variants')
        if (!product) {
            return res.status(404).json({ error: "Product Not Found" })
        }

        return res.status(200).json({ product: product })
    } catch (error) {
        console.log("Error fetching product with variants: ", error)
        return res.status(500).json({ error: "Error fetching product with variants" })
    }
}

export async function get_products(req: Request, res: Response, next: NextFunction) {
    try {
        const products = await Product.find().populate('product_variants')
        return res.status(200).json({ products: products })
    } catch (error) {
        return res.status(500).json({ error: "Error fetching products" })
    }
}

export async function update_products(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }
    const { name, description } = req.body
    const { id } = req.params
    try {
        const product = await Product.findById(id)
        if (!product) {
            return res.status(404).json({ error: "Product not found" })
        }

        product.name = name
        product.description = description
        await product.save()
        return res.status(200).json({ product: product })
    } catch (error) {
        return res.status(500).json({ error: "Error updating product" })
    }
}

export async function delete_products(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    try {
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        await ProductVariant.deleteMany({ product: product._id });

        const shop = await Shop.findById(product.shop);

        if (!shop) {
            return res.status(404).json({ error: "Shop not found" });
        }
        const index = shop.products.indexOf(product._id);
        if (index !== -1) {
            shop.products.splice(index, 1);
            await shop.save();
        }

        await Product.deleteOne({ _id: id });

        return res.status(200).json({ message: "Delete product and variants success" });
    } catch (error) {
        return res.status(500).json({ error: "Error updating product" })
    }
}