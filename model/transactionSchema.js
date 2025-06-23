const mongoose=require("mongoose")
const bcrypt=require('bcrypt')

const userDetailsSchema=new mongoose.Schema({
   email:{
      type:String,
      required:true,
      unique:true,
      lowercase:true,
      match:[/^\S+@\S+\.\S+$/,"Invalid email format"],
   },
   password:{
      type:String,
      required:true,
      minlength:6,
   }
})

userDetailsSchema.pre("save",async function(next){
if(!this.isModified("password")){
   return next()
}
try{
   const salt=await bcrypt.genSalt(10)
   this.password=await bcrypt.hash(this.password,salt)
   next()
}catch(error){
   next(error)
}
})

userDetailsSchema.methods.comparePassword=async function(userPassword){
   return bcrypt.compare(userPassword,this.password)
}



const dataSchema=new mongoose.Schema({
   expense:{
       type:Number,
       default:0
   },
   income:{
       type:Number,
       default:0
   },
   balance:{
       type:Number,
       default:0
   },
   trackByMonth:{
     monthExpense:{
      type:Number,
      default:0
     },
     monthIncome:{
      type:Number,
      default:0
     }

   },
   trackByYear:{
        yearExpense:{
         type:Number,
         default:0
        },
        yearIncome:{
         type:Number,
         default:0
        }
   }
})


const entrySchema=new mongoose.Schema({
   _id:{
      type:mongoose.Schema.Types.ObjectId,
      default:()=> new mongoose.Types.ObjectId()
   },
   transactionName:{
    type:String,
    required:true,
   },
   transactionAmount:{
    type:Number,
    required:true
   },
   transactionCreatedDate:{
    type:Date,
    default:Date.now,
    immutable:true
   },
   transactionUpdateDate:{
      type:Date,
      default:Date.now,
      required:false,
   },
   transactionType:{
    type:String,
    enum:["Income","Expense"],
    required:true
   }
})

const transactionSchema=new mongoose.Schema({
   userDetails:userDetailsSchema,
   data:{
      type:dataSchema,
      default:()=>({})
   },
   transactions:{
      type:[entrySchema],
      required:false,
      default:[]
   }
})

transactionSchema.pre("save",function(next){
   if(this.transactions.length>20){
     this.transactions.shift()
   }
   next()
})

dataSchema.statics.resetYear=function(){
   return this.updateMany({},{$set:{"trackByYear.yearExpense":0,"trackByYear.yearIncome":0}})
  }
  
  dataSchema.statics.resetMonth=function(){
     return this.updateMany({},{$set:{"trackByMonth.monthExpense":0,"trackByMonth.monthIncome":0}})
    }



module.exports=mongoose.model("Transaction",transactionSchema)