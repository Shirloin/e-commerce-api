import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import Product from "../models/product";
import ProductVariant from "../models/product-variant";
import Shop from "../models/shop";
import { IRequest } from "../interfaces/request-interface";
import User from "../models/user";

export async function create_product(req: IRequest, res: Response, next: NextFunction) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }
    const { name, description, product_variants } = req.body;
    const {user_id} = req.user

    try {

        const shop = await Shop.findOne({user: user_id})
        if(!shop){
            return res.status(404).json({error: "Shop does not exist"})
        }

        const product = await Product.create({
            name: name,
            description: description,
            shop: shop._id
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
        shop.products.push(product._id)
        await shop.save()
        return res.status(201).json({ product: product })
    } catch (error) {
        console.error("Error creating product or variants: ", error)
        return res.status(500).json({ error: error })
    }


}

export async function get_product(req: IRequest, res: Response, next: NextFunction) {
    const { id } = req.params
    try {
        const product = await Product.findById(id).populate('product_variants').populate('shop')
        if (!product) {
            return res.status(404).json({ error: "Product Not Found" })
        }

        return res.status(200).json({ product: product })
    } catch (error) {
        console.log("Error fetching product with variants: ", error)
        return res.status(500).json({ error: "Error fetching product with variants" })
    }
}

export async function get_products(req: IRequest, res: Response, next: NextFunction) {
    try {
        const products = await Product.find().populate('product_variants').populate('shop')
        return res.status(200).json({ products: products })
    } catch (error) {
        return res.status(500).json({ error: "Error fetching products" })
    }
}

export async function update_products(req: IRequest, res: Response, next: NextFunction) {
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

export async function delete_products(req: IRequest, res: Response, next: NextFunction) {
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