import express from "express"
import { db } from "../index.js"
import { ProductTable, UserTable } from "../db/schema.js"
import { eq } from "drizzle-orm"

// Create a new router 
const router = express.Router()

// create new product
router.post("/newproducts", async (req, res) => {
    // Extract product details from request body
    const { email, category, p_name, description, price, image_url, stock } = req.body
    // console.log(email,category,p_name,description,price,image_url,stock)

    try {
        // Insert new product into the database
        const CreateProduct = await db.insert(ProductTable).values({ email, category, p_name, description, price, image_url, stock })

        // Send success response
        res.status(200).json(
            { "message": "Product Created" }
        )
    } catch (error) {
        // Handle errors and send error response
        res.status(400).json(
            { "message": "Internal Server Error..Please Try Again" }
        )
    }
})

// Get all products
router.get("/allproducts", async (req, res) => {
    try {
        // Fetch all products from the database
        const allProducts = await db.select().from(ProductTable)
        // console.log(allProducts)

        // Check if products are found and send response
        if (allProducts.length > 0) {
            // Send response with products
            res.status(200).json(
                { "All Products": allProducts }
            )
        }

        // If no products found, send this message
        if (allProducts.length == 0) {
            res.status(200).json(
                { "message": "No Products Available" }
            )
        }
    } catch (error) {
        // console.log(error)
        // Handle errors and send error response
        res.status(400).json(
            { "message": "Internal Server Error..Please Try Again" }
        )
    }
})

// Delete Product
router.delete("/deleteproduct/:id", async (req, res) => {
    // Extract product ID from request params
    const { id } = req.params
    // console.log(id)
    try {
        // Delete product from the database where ID matches
        const DeleteUser = await db.delete(ProductTable).where(eq(ProductTable.id, Number(id)))
        // Send success response
        res.status(200).json(
            { "message": "Product Deleted" }
        )
    } catch (error) {
        // Handle errors and send error response
        res.status(400).json(
            { "message": "Unexpected Error Occured" }
        )
    }
})

// Edit Product
router.post("/editproduct/:id", async (req, res) => {
    // Extract product ID from request params
    const { id } = req.params
    // Extract updated product details from request body
    const { category, p_name, description, price, image_url, stock } = req.body
    // console.log(id, category, p_name, description, price, image_url, stock)

    try {
        // Update product in the database where ID matches
        const UpdateProduct = await db.update(ProductTable).set({ category, p_name, description, price, image_url, stock }).where(eq(ProductTable.id, Number(id)))

        // Send success response
        res.status(200).json(
            { "message": "Product Updated" }
        )
    } catch (error) {
        // Handle errors and send error response
        res.status(400).json(
            { "message": "Unexpected Error Occured" }
        )   
    }
})



export default router