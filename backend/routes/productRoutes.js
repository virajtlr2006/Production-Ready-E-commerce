import express from "express"
import { db } from "../index.js"
import { NotificationTable, ProductTable, UserTable } from "../db/schema.js"
import { eq } from "drizzle-orm"

// Create a new router 
const router = express.Router()

// create new product
router.post("/newproducts", async (req, res) => {
    // Extract product details from request body
    const { email, category, p_name, description, price, image_url, stock } = req.body
    console.log(email,category,p_name,description,price,image_url,stock)

    if(!email || !p_name || !category || !description || !price || !image_url || !stock ){
        res.status(400).json(
            {"message":"All fields are required"}
        )
    }

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

    const {id} = req.params
    try {
        // Fetch all products from the database
        const allProducts = await db.select().from(ProductTable)
        console.log(allProducts)

        // Check if products are found and send response
        if (allProducts.length > 0) {
            // Send response with products
            res.status(200).json(
                { "Allproducts": allProducts }
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

// Approve Product
router.post("/approveproduct/:id", async (req, res) => {

    const title = "Product Approval"

    const message = "Your Product is Approved and is live now"

    // Id from params
    const { id } = req.params
    // console.log(id)

    // const {user_id} = req.body

    try {
        // Update product isApproved to true in the db where ID matches
        const ApproveProduct = await db.update(ProductTable).set({isApproved: true }).where(eq(ProductTable.id, Number(id)))

        // Send success response
        res.status(200).json(
            { "message": "Product Approved" }
        )

        const FetchProduct = await db.select().from(ProductTable).where(eq(ProductTable.id,Number(id)))
        // console.log(FetchProduct)

        const CreateNotification = await db.insert(NotificationTable).values({user_id: FetchProduct[0].email,title,message}).returning()
        // console.log(CreateNotification) 

    } catch (error) {
        // Handle errors and send error response
        res.status(400).json(
            { "message": "Unexpected Error Occured" }
        )   
    }
})

// Reject Product
router.post("/rejectproduct/:id", async (req, res) => {
    // Id from params
    const { id } = req.params
    // console.log(id)

    try {
        // Update product isApproved to false in the db where ID matches
        const RejectProduct = await db.update(ProductTable).set({isApproved: false }).where(eq(ProductTable.id, Number(id)))

        // Send success response
        res.status(200).json(
            { "message": "Product Rejected" }
        )
    } catch (error) {
        // Handle errors and send error response
        res.status(400).json(
            { "message": "Unexpected Error Occured" }
        )   
    }
})

// All Approved Products
router.post("/approvedproducts", async (req, res) => {
    try {
        // Fetch all approved products from the database
        const Approvedproducts = await db.select().from(ProductTable).where(eq(ProductTable.isApproved, true))
        // console.log(Approvedproducts)

        // Check if approved products are found and send response
        if (Approvedproducts.length > 0) {
            // Send response with approved products
            res.status(200).json(
                { "Approvedproducts": Approvedproducts }
            )
        }

        // If no approved products found, send this message
        if (Approvedproducts.length == 0) {
            res.status(200).json(
                { "message": "No Approved Products Available" }
            )
        }
    } catch (error) {
        // Handle errors and send error response
        res.status(400).json(
            { "message": "Internal Server Error..Please Try Again" }
        )
    }
})

// Single Product Details
router.post("/productdetails/:id", async (req, res) => {
    // Extract product ID from request params
    const { id } = req.params
    // console.log(id)

    try {
        // Fetch product details from the database where ID matches
        const ProductDetails = await db.select().from(ProductTable).where(eq(ProductTable.id, Number(id)))
        // console.log(ProductDetails)

        // Check if product is found and send response
        if (ProductDetails.length > 0) {
            // Send response with product details
            res.status(200).json(
                { "ProductDetails": ProductDetails }
            )
        }

        // If no product found, send this message
        if (ProductDetails.length == 0) {
            res.status(200).json(
                { "message": "Product Not Found" }
            )
        }
    } catch (error) {
        // Handle errors and send error response
        res.status(400).json(
            { "message": "Internal Server Error..Please Try Again" }
        )
    }
})
export default router