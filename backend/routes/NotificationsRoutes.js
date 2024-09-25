const router = require('express').Router()
const NotificationsController = require('../controllers/NotificationsController')

//middleware
const VerifyToken = require('../helpers/Verify-token') 

router.get('/getall',VerifyToken,NotificationsController.GetAllNotificationsUser)
router.get('/getallandto/:page',VerifyToken,NotificationsController.GetAllAndToNotificationsUser)
router.post('/viewedall/:id',VerifyToken,NotificationsController.ViewedAll)
router.get('/getto',VerifyToken,NotificationsController.GetToNotificationsUser)
router.post('/viewedto/:id',VerifyToken,NotificationsController.ViewedTo)


module.exports = router