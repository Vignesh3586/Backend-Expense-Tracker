const Transaction=require("../model/transactionSchema")

const getAllTransactions=async(req,res)=>{
    try{
        const allTransactions=await Transaction.findOne({"userDetails.email":req.params.email})
        res.status(200).send({
            transactions:allTransactions.transactions})
    }catch(error){
        res.status(404).send({message:error.message})
    }
}


const findUser=async(email)=>{
   return  await Transaction.findOne({"userDetails.email":email})
}



const getTransactionById=async(req,res)=>{
    try{
        const user=await findUser(req.query.email)
        const transaction=user.transactions.find((transaction)=>transaction._id.toString()===req.params.id)
        res.status(201).send(transaction)
    }catch(error){
        res.status(500).send({message:error.message})
    }
}

const chooseTransaction=async(email,tranasactionType,transactionAmount)=>{
   const user=await findUser(email)
   if(!user){
    throw new Error("User not found")
   }
  
   if(tranasactionType=="income"){
    user.data.balance+=Number(transactionAmount)
    user.data.income+=Number(transactionAmount)
   }else if(tranasactionType=="expense"){
    user.data.balance-=Number(transactionAmount)
    user.data.expense+=Number(transactionAmount)
   }
   await user.save()
}

const insertTransaction=async(req,res)=>{
    const {transactionType,transactionAmount,transactionName}=req.body
    const {email}=req.params
    const user=await findUser(email)
    try{
       user.transactions.push(
        {transactionName:transactionName,
        transactionAmount:transactionAmount,
        tranasactionType:transactionType,
       })
       await chooseTransaction(email,transactionType,transactionAmount)
       res.status(200).send({message:"Transaction created successfully"})
    }catch(error){
        res.status(404).send({message:error.message})
    }
}

const updateTransaction=async(req,res)=>{
    const user=await findUser()
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