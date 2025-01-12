const express=require("express")
const app=express()
require('dotenv').config();
const transactionRouter=require("./router/transactionRouter")
const PORT=process.env.port||3000
const resetAnalysis=require("./controllers/timeController")
const loginRouter=require("./router/loginUserRouter")
const createUserRouter=require("./router/createUserRouter")


app.use(express.json());

app.use(resetAnalysis)

app.use("/transactions",transactionRouter)

app.use("/create-user",createUserRouter)

app.use("/",loginRouter)


app.listen(PORT,()=>{console.log("server is running on "+PORT)})