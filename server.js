const express=require("express")
const app=express()
require('dotenv').config();
const mongoose=require('mongoose')
const transactionRouter=require("./router/transactionRouter")
const loginRouter=require("./router/loginUserRouter")
const createUserRouter=require("./router/createUserRouter")
const resetAnalysis=require("./controllers/timeController")

const PORT=process.env.port || 3000

app.use(express.json());

mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(()=>{
    console.log("database connected")
})

app.use(resetAnalysis)

app.use("/transactions",transactionRouter)

app.use("/create-user",createUserRouter)

app.use("/",loginRouter)


app.listen(PORT,()=>{console.log("server is running on "+PORT)})