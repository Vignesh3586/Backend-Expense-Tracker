const express=require("express")
const { loginUser, existsEmail,updatePassword } = require("../controllers/userController")

const router=express.Router()


router
   .get("/",loginUser)
   .get("/:email",existsEmail)
   .put("/",updatePassword)