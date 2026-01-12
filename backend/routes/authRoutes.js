import express from "express"
import { adminTable, UserTable } from "../db/schema.js"
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
            { "message": "Please Login First" }
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
            res.status(400).json(
                { "message": "Please SignUp First" }
            )
        }

        // If password matches, it will show success message
        if (CheckAdmin[0].password === password) {
            res.status(200).json({ "message": "Login Successful" })
        }
        // If wrong then show this esponse
        else {
            res.status(400).json({ "message": "Incorrect Password" })
        }
    } catch (error) {
        // If unexpected error occurs
        res.status(400).json(
            { "message": "Incorrect Password" }
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
            { "message": "Unexpected error occured" }
        )
    }
}
)

// All Users List from usertable
router.get("/allusers", async (req, res) => {

    try {
        // Fetch all users from the UserTable
        const FetchUsers = await db.select().from(UserTable)
        // console.log(FetchUsers)

        // If users are present then show this response
        if (FetchUsers.length > 0) {
            res.status(200).json(
                { "Users": FetchUsers }
            )
        }
        // If no users are present then show this response
        if (FetchUsers.length == 0) {
            res.status(400).json(
                { "message": "No Users" }
            )
        }
    } catch (error) {
        // If unexpected error occurs
        res.status(400).json(
            { "message": "Error Occured" }
        )
    }

})

// Delete User by id
router.delete("/deleteuser/:id", async (req, res) => {
    const { id } = req.params

    try {
        // Delete user from UserTable where id matches
        await db.delete(UserTable).where(eq(UserTable.id, Number(id)))

        // Response after successful deletion
        res.status(200).json(
            { "message": "User Deleted Successfully" }
        )
    } catch (error) {
        // If unexpected error occurs
        res.status(400).json(
            { "message": "Error Occured" }
        )
    }
})

export default router