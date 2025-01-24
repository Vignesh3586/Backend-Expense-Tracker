const express=require("express")
const app=express()
require('dotenv').config();
const mongoose=require('mongoose')
const transactionRouter=require("./router/transactionRouter")
const loginRouter=require("./router/loginUserRouter")
const createUserRouter=require("./router/createUserRouter")
const resetAnalysis=require("./controllers/timeController")
const cors = require("cors");
app.use(cors());

const port=process.env.PORT 



mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("database connected")
})

app.use(express.json());

app.use(resetAnalysis)

app.use("/transactions",transactionRouter)

app.use("/create-user",createUserRouter)

app.use("/",loginRouter)


app.listen(port,()=>{console.log("server is running on "+port)})