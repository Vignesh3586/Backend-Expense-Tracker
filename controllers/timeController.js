const transaction = require("../model/transactionSchema")

// reset until month

const getTimeUntilNextMonth = () => {
    const now = new Date()
    const nextMonth = (now.getMonth() === 11) ? 0 : now.getMonth() + 1
    const year = (now.getMonth() === 11) ? now.getFullYear() + 1 : now.getFullYear()
    const nextMonthStart = new Date(year, nextMonth, 1)
    return nextMonthStart - now
}

// reset schedule

const scheduleReset = () => {
    const time = getTimeUntilNextMonth()
    const maxTimeout = 2147483647 

    setTimeout(async () => {
        try {
            const currentMonth = new Date().getMonth()
            
            if (currentMonth === 0) {
                await transaction.resetYear()
            }
            
            await transaction.resetMonth()
            console.log("Reset completed.")
        } catch (error) {
            console.error("Reset failed:", error)
        }

        scheduleReset()
    }, Math.min(time, maxTimeout))
}


const resetAnalysis = (req, res, next) => {
    scheduleReset()
    next()
}

module.exports = resetAnalysis
