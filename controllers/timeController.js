const transaction = require("../model/transactionSchema")

// Calculate milliseconds until next month
const getTimeUntilNextMonth = () => {
    const now = new Date()
    const nextMonth = (now.getMonth() === 11) ? 0 : now.getMonth() + 1
    const year = (now.getMonth() === 11) ? now.getFullYear() + 1 : now.getFullYear()
    const nextMonthStart = new Date(year, nextMonth, 1)
    return nextMonthStart - now
}

// Recursively schedule reset to avoid timeout overflow
const scheduleReset = () => {
    const time = getTimeUntilNextMonth()
    const maxTimeout = 2147483647 // Max setTimeout limit (about 24.8 days)

    setTimeout(async () => {
        try {
            const currentMonth = new Date().getMonth()
            
            if (currentMonth === 0) { // January
                await transaction.resetYear()
            }
            
            await transaction.resetMonth()
            console.log("Reset completed.")
        } catch (error) {
            console.error("Reset failed:", error)
        }

        // Schedule the next reset
        scheduleReset()
    }, Math.min(time, maxTimeout))
}

// Middleware to kick off the reset scheduler
const resetAnalysis = (req, res, next) => {
    scheduleReset()
    next()
}

module.exports = resetAnalysis
