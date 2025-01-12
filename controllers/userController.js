const transaction=require("../model/transactionSchema")

const findUser=async(email)=>{
    await transaction.findOne({email})
}

const existsEmail=(req,res)=>{
    const {email}=req.params
    const user=findUser(email)
    try{
        if(user){
            res.status(200).json(user)
         }else{
            res.status(400).json({messsage:"This email does not exisist"})
         }
       }catch(error){
        res.status(404).json({messsage:error.message})
       }
    }

const loginUser=async(req,res)=>{
    const email=req.body.email
    const password=req.body.password
    try{
        const user=findUser(email)
        if(!user){
            return res.status(404).send({message:"Email not found"})
        }
        const isMatchPassword=await user.comparePassword(password)
        if(!isMatchPassword){
            return res.status(401).send({message:"Invalid Password"})
        }

        return res.status(200).send({message:"Login successful"})
    }catch(error){
        res.status(500).send({message:error.message})
    }
}

const updatePassword=async(req,res)=>{
    const {email,password}=req.body
    try{
        const user=findUser(email)
        await user.updateOne({email:email},{$set:{"userDetails.password":password}})
        res.status(200).send({message:"Password updated successfully"})
    }catch(error){
        res.status(404).send({message:error.message})
    }
  
}

const createUser=async(req,res)=>{
    
    const {email,password}=req.body
    try{
        const newUser=new transaction({userData:{email:email,password:password}})
        await newUser.save()
        res.status(201).send({message:"User created Scccessfully"})
    }catch(error){
        res.status(500).send({message:error.message})
    }
}


module.exports={existsEmail,createUser,loginUser,updatePassword}