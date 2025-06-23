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

const chooseTransaction=async(email,transactionType,transactionAmount)=>{
   const user=await findUser(email)

   if(!user){
    throw new Error("User not found")
   }
   const number=Number(transactionAmount)
   if(isNaN(number) || number<=0){
    throw new Error("Invalid Number")
   }
 
   if(transactionType=="Income"){
    user.data.balance+=number
    user.data.income+=number
    user.data.trackByMonth.monthIncome+=number
    user.data.trackByYear.yearIncome+=number
   }else if(transactionType=="Expense"){
    user.data.balance-=number
    user.data.expense+=number
    user.data.trackByMonth.monthExpense+=number
    user.data.trackByYear.yearExpense+=number
   }else{
    throw new Error("Transactiontype not found")
   }

   user.markModified("data")
   await user.save()
}

const insertTransaction=async(req,res)=>{
    const {transactionType,transactionAmount,transactionName}=req.body
    const {email}=req.params

  
    const user=await findUser(email)

    if (!user.transactions) {
       user.transactions = [];
     }
     
 
    try{
       user.transactions.push(
        {transactionName:transactionName,
        transactionAmount:transactionAmount,
        transactionType:transactionType,
       })
       await chooseTransaction(email,transactionType,transactionAmount)
       await user.save()
       console.log(user)
       res.status(200).send({
        transactions:user.transactions,
        data:user.data,
       })
    }catch(error){
        res.status(404).send({message:error.message})
        console.error(error.message)
    }
}

const updateTransaction=async(req,res)=>{
    const user=await findUser()
    try{
        const findEntryById=user.transactions.find((entry)=> entry._id==req.params.id)
        findEntryById.transactionName=req.transactionName,
        findEntryById.transactionAmount=req.transactionAmount,
        findEntryById.transactionType=req.tranasactionType,
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