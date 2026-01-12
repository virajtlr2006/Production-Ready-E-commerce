import express from "express"
import { db } from "../index.js"
import { ProductTable, UserTable } from "../db/schema.js"
import { eq } from "drizzle-orm"

const router = express.Router()

// Signup for users
router.post("/signup", async (req, res) => {

    // Get user details from body
    const { username, email, phone_no, password } = req.body

    // console.log(username, email, phone_no, password)
    try {
        const CheckUser = await db.select().from(UserTable).where(eq(UserTable.email, email))

        if (CheckUser.length > 0) {
            res.status(400).json(
                { "message": "User already exists" }
            )
        } else {
            // Insert user details in database using this query
            await db.insert(UserTable).values({ username, email, phone_no, password })

            // If User Created Pass response : User Created
            res.status(200).json(
                { "message": "SignUp Successful" }
            )
        }
    } catch (error) {
        // If User not created pass this response
        // console.log(error)
        res.status(400).json(
            { "message": "Internal Server Error" }
        )
    }
})

// Signin for users
router.post("/signin", async (req, res) => {
    // Take inputs of email and password from body
    const { email, password } = req.body
    // console.log(email,password)

    // If any field is missing in body, it shows This response
    if (!email || !password) {
        res.status(400).json(
            { "message": "Please Fill Required Fields" }
        )
    }

    try {

        // Checks User i db through the email
        const CheckUser = await db.select().from(UserTable).where(eq(UserTable.email, email))

        // If User not found then shows this response
        if (CheckUser.length == 0) {
            res.status(400).json(
                { "message": "Please SignUp First" }
            )
        }

        // If User Password matches with the password of db , then login successfull
        if (CheckUser[0].password == password) {
            res.status(200).json(
                { "message": "Login Successful" }
            )
        }
        else {
            // This response shows when the password is incorrect
            res.status(400).json(
                { "message": "Incorrect Password" }
            )
        }
    } catch (error) {
        // When there is some internal server error , it shows this response
        res.status(400).json(
            { "message": "Please Retry" }
        )
    }
})

// User's Profile
router.post("/profile", async (req, res) => {
    const { email } = req.body
    // console.log(email)

    if (!email) {
        res.status(400).json(
            { "message": "Email not found" }
        )
    }

    try {
        // Checks the user in db through email
        const CheckUser = await db.select().from(UserTable).where(eq(UserTable.email, email))

        // console.log(CheckUser.length)

        // If no user found then send sthis response
        if (CheckUser.length == 0) {
            res.status(400).json(
                { "message": "Invalid Email" }
            )
        }
        // If user found profile is send in response
        else {
            res.status(200).json(
                { "profile": CheckUser[0] }
            )
        }
    } catch (error) {
        // If there is some internal server error the this response will be sent
        res.status(400).json(
            { "message": "Internal Server Error" }
        )
    }
})

// Edit User's Profile
router.post("/profile/edit", async (req, res) => {

    // Take inputs in body
    const { email, username, phone_no, profile_pic } = req.body
    // console.log(email,username,phone_no,profile_pic)

    try {
        // Find user's profile in db through email
        const UpdateUserProfile = await db.update(UserTable).set({ username, phone_no, profile_pic }).where(eq(UserTable.email, email)).returning()

        // console.log(UpdateUserProfile)

        // If email not found ,sends this response
        if (UpdateUserProfile.length == 0) {
            res.status(400).json(
                { "message": "Invalid Email" }
            )
        }
        // If Profile Updated Successfully , it send this response
        else {
            res.status(200).json(
                { "Updated Profile": UpdateUserProfile[0] }
            )
        }
    } catch (error) {
        // If there is internal server error
        res.status(400).json(
            { "message": "Internal Server Error" }
        )
    }
})

// Update User's Password
router.post("/newpass", async (req, res) => {
    // Take inputs from body
    const { password, oldPassword, email } = req.body

    // Check all inputs filled or not
    if (!oldPassword || !password) {
        res.status(400).json(
            { "message": "Fill all required fields" }
        )
    }

    try {
        // Checks user in db through email
        const CheckPassword = await db.select().from(UserTable).where(eq(UserTable.email, email))

        // If old password and new password matches then update password
        if (CheckPassword[0].password === oldPassword) {
            const newPassword = await db.update(UserTable).set({ password }).where(eq(UserTable.email, email)).returning()

            // Then this response is sent
            res.status(200).json(
                { "message": "Password Updated Successfully" }
            )
        }
        else {
            // If old password is incorrect in body
            res.status(400).json(
                { "message": "Incorrect Old Password" }
            )
        }
    } catch (error) {
        // Gives this response if unexpected error occured
        res.status(400).json(
            { "message": "Internal Server Error" }
        )
    }
})

// User All Products
router.post("/userproducts", async (req, res) => {
    // Take email from body
    const { email } = req.body
    // console.log(email)

    // If email not found in body
    if (!email) {
        req.status(400).json(
            // Send this response
            { "message": "Email not found" }
        )
    }

    try {
        // Check user in db through email
        const CheckUser = await db.select().from(UserTable).where(eq(UserTable.email, email))
        // console.log(CheckUser)

        // If no user found then send this response
        if (CheckUser.length == 0) {
            res.status(400).json(
                { "message": "Please Login First" }
            )
        }
        else {
            // If user found then fetch all products of that user through email
            const userProducts = await db.select().from(ProductTable).where(eq(ProductTable.email, email))
            // console.log(userProducts.length)

            // If no products found for that user then send this response
            if (userProducts.length == 0) {
                res.status(400).json(
                    { "message": "No User Found" }
                )
            }
            else {
                // If products found then send all products in response 
                res.status(200).json(
                    { "userproducts": userProducts }
                )
            }
        }
    } catch (error) {
        // If unexpected error occured then send this response
        req.status.json(
            {"message":"Unexpected Error Occured...Please try again"}
        )
    }
})

export default router