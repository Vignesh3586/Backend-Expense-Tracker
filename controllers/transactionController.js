const transaction=require("../model/transactionSchema")

const getAllTransactions=async(req,res)=>{
    try{
        const allTransactions=await transaction.find({"userDetails.email":req.email,"userDetails.password":req.password})
        res.status(200).send({
            transactions:allTransactions.transactions,
            data:allTransactions.data})
    }catch(err){
        res.status(404).send({message:err.message})
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
    }catch(err){
        res.status(500).send({message:err.message})
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
    const{transactionType,transactionAmount,transactionName,email}=req.body
    const user=findUser(email)
    try{
       user.transactions.push(
        {transactionName:transactionName,
        transactionAmount:transactionAmount,
        tranasactionType:transactionType,
       })
       chooseTransaction(email,transactionType,transactionAmount)
       res.status(200).send({message:"Transaction created successfully"})
    }catch(err){
        res.status(404).send({message:err.message})
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
     }catch(err){
         req.status(404).send({message:err.message})
     }
}

const deleteTransaction=async(req,res)=>{
    try{
        const user=findUser(req.body.email)
        user.transactions=user.transactions.filter(entry=>entry._id!=req.params.id)
        await user.save()
        res.status(200).send({message:"Transaction deleted successfully"})
     }catch(err){
         res.status(404).send({message:err.message})
     }
}

module.exports={getAllTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
    insertTransaction}