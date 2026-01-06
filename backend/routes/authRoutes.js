import express from "express"
import { adminTable } from "../db/schema.js"
import { db } from "../index.js"
import { eq } from "drizzle-orm"
import { Check } from "drizzle-orm/gel-core"

const router = express.Router()

// Sign Up
router.post("/signup", async (req, res) => {

    // Get data from body
    const { email, password, name } = req.body

    // insert data into db
    try {
        await db.insert(adminTable).values({ email, password, name })

        // Gives response for The Successful SignUp
        res.status(200).json(
            { "message": "Admin SignUp Successful" }
        )
    } catch (error) {
        // Unsuccessful signup
        res.status(400).json(
            { "message": error }
        )
    }
})

// Sign In
router.post("/signin", async (req, res) => {

    // Request data from body
    const { email, password } = req.body

    // If email or password not given , it shows a response
    if (!email || !password) {
        res.json({
            "message": "All Fields Are Required"
        })
    }

    // Checks the user using email in db
    try {
        const CheckAdmin = await db.select().from(adminTable).where(eq(adminTable.email, email))

        // console.log(CheckAdmin)

        // If no email in db 
        if (CheckAdmin.length == 0) {
            res.status(200).json(
                { "message": "Please SignUp First" }
            )
        }

        // If password matches, it will show success message
        if (CheckAdmin[0].password === password) {
            res.status(200).json({ "message": "Login Successful" })
        }
        // If wrong then show this esponse
        else {
            res.status(400).json({ "message": "Wrong Password" })
        }
    } catch (error) {
        // If unexpected error occurs
        res.status(400).json(
            { "message": error }
        )
    }
})


// Update Password
router.post("/newpass", async (req, res) => {
    // takes data from body
    const { password, oldPassword, email } = req.body

    try {
        // Checks user through email in db
        const CheckPassword = await db.select().from(adminTable).where(eq(adminTable.email, email))

        // If newpassword and oldpassword matches 
        if (CheckPassword[0].password === oldPassword) {
            const newPassword = await db.update(adminTable).set({ password }).where(eq(adminTable.email, email)).returning()

            //Then response is this
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
            {"message":"Unexpected error occured"}
        )
    }
}
)

export default router