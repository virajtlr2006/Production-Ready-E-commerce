import express from "express"
import adminAuthRouter from "./routes/authRoutes.js"

const app = express()

// Parse json 
app.use(express.json())

const port = 3000

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