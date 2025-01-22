const transaction=require("../model/transactionSchema")

const findUser=async(email)=>{
    const user=await transaction.findOne({"userDetails.email":email})
   
    if(!user){
        return ;
    }
    return user
}

const existsEmail=async(req,res)=>{
    const {email}=req.query
    const user=await findUser(email)
    try{
        if(user){
            res.status(200).json(user)
         }else{
            res.status(400).json({messsage:"This email does not exsist"})
         }
       }catch(error){
        res.status(404).json({messsage:error.message})
       }
    }

const isMatchPasswordAndEmail=async(req,res)=>{
    const {email,password}=req.query
    const isEmail=await findUser(email)
    if(isEmail){
      if(isEmail.userDetails.password==password){
        res.status(200).send({message:"Password match"})
      }else{
        res.status(400).send({message:"Invalid password"})
      }
    }else{
        res.status(404).send({message:"This email does not exists"})
    }
}

const loginUser=async(req,res)=>{
    const email=req.query.email
    const password=req.query.password
    try{
        const user=await findUser(email)
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
        const user=await findUser(email)
        if(!user){
            res.status(404).send({message:"User not found"})
        }
        await transaction.updateOne({"userDetails.email":email},{$set:{"userDetails.password":password}})
        res.status(200).send({message:"Password updated successfully"})
    }catch(error){
        res.status(404).send({message:error.message})
    }
  
}

const createUser=async(req,res)=>{
     const {email,password}=req.body
    try{
        const isAlreadyExsistEmail=await findUser(email)
        if(!isAlreadyExsistEmail){
            const newUser=new transaction({userDetails:{email:email,password:password}})
            await newUser.save()
            res.status(201).send({message:"User created Scccessfully"})
        }else{
            res.status(400).send({message:"This mail already exsists"})
        }    
    }catch(error){
        res.status(500).send({message:error.message})
    }
}


module.exports={existsEmail,createUser,loginUser,updatePassword,isMatchPasswordAndEmail}