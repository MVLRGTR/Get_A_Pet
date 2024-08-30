const router = require('express').Router()
const NotificationsController = require('../controllers/NotificationsController')

//middleware
const VerifyToken = require('../helpers/Verify-token') 
const {ImageUpload} = require('../helpers/ImageUpload')


router.get('/getall',VerifyToken,NotificationsController.GetAllNotificationsUser)
router.post('/viewedall/:id',VerifyToken,NotificationsController.ViewedAll)
router.get('/getto',VerifyToken,NotificationsController.GetToNotificationsUser)
router.post('/viewedto/:id',VerifyToken,NotificationsController.ViewedTo)


module.exports = router