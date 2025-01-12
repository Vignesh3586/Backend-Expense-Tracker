const transaction=require("../model/transactionSchema")

const getTimeUntillNextMonth=()=>{
    const now=new Date()
    const nextMonth=(now.getMonth()==11)? 0 : now.getMonth()+1
    const year=(now.getMonth()==11)?now.getFullYear()+1:now.getFullYear()
    return new Date(year,nextMonth,1)-now
}

const resetAnalysis=(req,res,next)=>{
    const time=getTimeUntillNextMonth()
     
    const resetFunction=async()=>{
            if(new Date().getMonth()==0){
              await transaction.resetYear()
            }
           await transaction.resetMonth()
    }


    setInterval(resetFunction,time)
    next()
}

module.exports=resetAnalysis