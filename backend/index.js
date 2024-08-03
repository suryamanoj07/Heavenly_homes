import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import userRouter from './routes/userroutes.js'
import authRouter from './routes/authroutes.js'
import listingRouter from './routes/listingroutes.js'
import bodyParser from 'body-parser'

mongoose.connect("mongodb+srv://manojsurya463:BjxbMbniGwKlMbmT@cluster0.tjaza.mongodb.net/MERN-estate")
        .then(()=>console.log("Database connected"))
        .catch((e)=>console.log(e.message))

const app = express()
app.use(express.json())
app.use(cors())

app.get("/",(req,res)=>{
    res.send("welcome to MERN estate")
})

app.use("/api/user",userRouter)
app.use("/api/auth",authRouter)
app.use("/api/listing",listingRouter)


app.listen(3000,()=>console.log("Server is running on port 3000"))