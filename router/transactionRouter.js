const express=require("express")
const router=express.Router()
const { getAllTransactions, getTransactionById, insertTransaction, updateTransaction, deleteTransaction }=require("../controllers/transactionController")

router
  .get("/",getAllTransactions)
  .get("/:id",getTransactionById)
  .post("/",insertTransaction)
  .put("/:id",updateTransaction)
  .delete("/:id",deleteTransaction)


module.exports=router