import express from "express"
import adminAuthRouter from "./routes/authRoutes.js"
import userAuthRouter from "./routes/userRoutes.js"
import productRouter from "./routes/productRoutes.js"
import payRouter from "./routes/paymentRoutes.js"
import cors from "cors"
import { db } from "./index.js"
import { NotificationTable } from "./db/schema.js"
import { eq } from "drizzle-orm"

const app = express()

// Parse json 
app.use(express.json())

app.use(cors())

const port = 8080

app.get("/", (req, res) => {
    res.send("Hello World!")
})


app.post("/post", (req, res) => {
    const { name, description } = req.body

    res.json(
        {
            "name": name,
            "description": description
        }
    )
})

app.listen(port, () => {
    console.log(`Port is listening on port ${port}`)
})

app.post("/notification", async (req, res) => {

    const {email} = req.body

    try {      
        const FetchNotifications = await db.select().from(NotificationTable).where(eq(NotificationTable.user_id,email))
    
        console.log(FetchNotifications)
    
        res.status(200).json(
            {"AllNotifs":FetchNotifications}
        )
    } catch (error) {
        console.log(error)
    }

})

app.use("/admin", adminAuthRouter)
app.use("/users", userAuthRouter)
app.use("/products", productRouter)
app.use("/pay", payRouter)