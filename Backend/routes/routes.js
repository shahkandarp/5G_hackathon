const express = require('express')
const router = express.Router()
const userMiddleware = require('../middleware/authentication_user')
const {testController,getFailCounts,getFailedDetails,getFailedDayWiseBarData,dailyEmmitedGasPie,login,totalGasEmmitedPerDayPerUser,getAverageEmmisionDayWiseLineChartData,getAverageEmmisionDayWiseLineChartForUser} = require('../controllers/controller')

router.route('/').get(testController)
router.route('/getFailCounts').get(getFailCounts)
router.route('/getFailedDetails/:category').get(getFailedDetails)
router.route('/getFailedDayWiseBarData').get(getFailedDayWiseBarData)
router.route('/dailyEmmitedGasPie').get(dailyEmmitedGasPie)
router.route('/login').post(login)
router.route('/totalGasEmmitedPerDayPerUser').get(userMiddleware,totalGasEmmitedPerDayPerUser)
router.route('/getAverageEmmisionDayWiseLineChartData').get(getAverageEmmisionDayWiseLineChartData)
router.route('/getAverageEmmisionDayWiseLineChartForUser').get(userMiddleware,getAverageEmmisionDayWiseLineChartForUser)

module.exports = router