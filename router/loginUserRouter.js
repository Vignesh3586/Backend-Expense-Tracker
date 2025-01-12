const express=require("express")
const { loginUser, existsEmail } = require("../controllers/userController")

const router=express.Router()


router
   .get("/",loginUser)
   .get("/:email",existsEmail)
   .put("/:email",updatePassword)