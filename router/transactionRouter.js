const express = require("express")
const router = express.Router()
const { getAllTransactions, getTransactionById, insertTransaction, updateTransaction, deleteTransaction } = require("../controllers/transactionController")

router
  .get("/:email", getAllTransactions)
  .get("/:id", getTransactionById)
  .post("/:email", insertTransaction)
  .put("/:id", updateTransaction)
  .delete("/:id", deleteTransaction)


module.exports = router