const transaction=require("../model/transactionSchema")

const getAllTransactions=async(req,res)=>{
    try{
        const allTransactions=await transaction.find({"userDetails.email":req.email,"userDetails.password":req.password})
        res.status(200).send({
            transactions:allTransactions.transactions,
            data:allTransactions.data})
    }catch(error){
        res.status(404).send({message:error.message})
    }
}


const findUser=async(email)=>{
    await transaction.findOne({"userDetails.email":email})
}



const getTransactionById=(req,res)=>{
    try{
        const user=findUser(req.body.email)
        const transaction=user.transactions.find((transaction)=>transaction._id.toString()===req.params.id)
        res.status(201).send(transaction)
    }catch(error){
        res.status(500).send({message:error.message})
    }
}

const chooseTransaction=async(email,tranasactionType,transactionAmount)=>{
   const user=findUser(email)
   const findBalance=async()=>{
     await user.findOne({"userDetails.key":balance})
   }
   if(tranasactionType=="income"){
    const balance=findBalance()
    const balanceOfNow=Number(balance.balance) + Number(transactionAmount)
    const income=Number(balance.income) + Number(transactionAmount)
    const updateFields={
        balance:balanceOfNow,
        income:income
    }
    await user.updateOne({"userDetails.key":"balance"},{$set:updateFields})
   }else{
    const balance=await transaction.data.findOne({key:balance})
    const balanceOfNow=Number(balance.balance) - Number(transactionAmount)
    const expense=Number(balance.expense) + Number(transactionAmount)
    const updateFields={
            balance:balanceOfNow,
            expense:expense
        }
    await user.updateOne({"userDetails.key":"balance"},{$set:updateFields})
   }
}

const insertTransaction=(req,res)=>{
    const {transactionType,transactionAmount,transactionName}=req.body
    const {email}=req.params
    const user=findUser(email)
    try{
       user.transactions.push(
        {transactionName:transactionName,
        transactionAmount:transactionAmount,
        tranasactionType:transactionType,
       })
       chooseTransaction(email,transactionType,transactionAmount)
       res.status(200).send({message:"Transaction created successfully"})
    }catch(error){
        res.status(404).send({message:error.message})
    }
}

const updateTransaction=async(req,res)=>{
    const user=findUser()
    try{
        const findEntryById=user.transactions.find((entry)=> entry._id==req.params.id)
        findEntryById.transactionName=req.transactionName,
        findEntryById.transactionAmount=req.transactionAmount,
        findEntryById.tranasactionType=req.tranasactionType,
        await user.save()
        res.status(200).send({message:"Transaction updated successfully"})
     }catch(error){
         req.status(404).send({message:error.message})
     }
}

const deleteTransaction=async(req,res)=>{
    try{
        const user=findUser(req.body.email)
        user.transactions=user.transactions.filter(entry=>entry._id!=req.params.id)
        await user.save()
        res.status(200).send({message:"Transaction deleted successfully"})
     }catch(error){
         res.status(404).send({message:error.message})
     }
}

module.exports={getAllTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
    insertTransaction}