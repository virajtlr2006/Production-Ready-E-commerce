import express from "express"
import { db } from "../index.js"
import { PaymentTable, ProductTable } from "../db/schema.js"
import { eq } from "drizzle-orm"

const router = express.Router()

// Create new payment
router.post("/newpayment", async (req, res) => {
    const { buyer_email, product_id, amount, quantity, type, card_no, UPI_ID } = req.body
    console.log(buyer_email,product_id,amount,quantity,type,card_no,UPI_ID)

    // Validate required fields
    if (!buyer_email || !product_id || !amount || !quantity || !type) {
            res.status(400).json(
                { "message": "All Fields care required" }
            )
        }
    if(type == "Card" && !card_no){
        res.status(400).json(
            {"message":"Card No. is Required"}
        )
    }

    if(type == "UPI" && !UPI_ID){
        res.status(400).json(
            {"message":"UPI ID is Required "}
        )
    }

    const FetchProduct = await db.select().from(ProductTable).where(eq(ProductTable.id,Number(product_id)))
    // console.log(FetchProduct)

    if(FetchProduct[0].stock <= quantity){
        res.status(400).json(
            {"message":"Insufficient Stock"}
        )
    }

    try {
        // Insert new payment into the database
        const NewPayment = await db.insert(PaymentTable).values({ buyer_email, product_id, amount, quantity, type, card_no, UPI_ID }).returning()

        const newstock = FetchProduct[0].stock - quantity
        const UpdateStock = await db.update(ProductTable).set({stock:newstock}).where(eq(ProductTable.id,product_id))
        // console.log(NewPayment)

        // Send success response
        res.status(200).json(
            { "message": "Payment Done Successfully" }
        )
    } catch (error) {
        console.log(error)
        res.status(400).json(
            // Handle errors and send error response
            {"message":"Please Retry"}
        )
    }

})

export default router