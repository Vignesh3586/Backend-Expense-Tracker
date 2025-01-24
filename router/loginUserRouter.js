const express=require("express")
const { loginUser,fetchdataWithEmail,updatePassword } = require("../controllers/userController")

const router=express.Router()


router
   .get("/",loginUser)
   .get("/:email",fetchdataWithEmail)
   .put("/",updatePassword)

module.exports=router