const router = require('express').Router()
const MessageController = require('../controllers/MessageController')

//middleware
const VerifyToken = require('../helpers/Verify-token') 

router.get('/getallmessagechat',VerifyToken,MessageController.GetAllMessageChat)
router.get('/activechats/:page',VerifyToken,MessageController.activeChatsUser)
router.post('/create',VerifyToken,MessageController.SendMessage)
router.patch('/view',VerifyToken,MessageController.ViewedMsg)


module.exports = router
