const router = require('express').Router()
const MessageController = require('../controllers/MessageController')

//middleware
const VerifyToken = require('../helpers/Verify-token') 

router.post('/create',VerifyToken,MessageController.SendMessage)

module.exports = router
