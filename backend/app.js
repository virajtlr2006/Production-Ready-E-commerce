import express from "express"
import adminAuthRouter from "./routes/authRoutes.js"
import userAuthRouter from "./routes/userRoutes.js"
import cors from "cors"

const app = express()

// Parse json 
app.use(express.json())

app.use(cors())

const port = 8080

app.get("/",(req,res) => {
    res.send("Hello World!")
})

app.listen(port, ()=> {
    console.log(`Port is listening on port ${port}`)
})

app.post("/post",(req,res) => {
    const {name,description} = req.body

    res.json(
        {
            "name":name,
            "description":description
        }
    )
})

app.use("/admin",adminAuthRouter)
app.use("/users",userAuthRouter)