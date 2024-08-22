const router = require ('express').Router()
const UserController = require('../controllers/UserController')

//middleware
const VerifyToken = require('../helpers/Verify-token') 
const {ImageUpload} = require('../helpers/ImageUpload')

router.post('/register',UserController.Register)
router.post('/login',UserController.Login)
router.post('/primarylogin',UserController.PrimaryLogin)
router.post('/forgotpassword',UserController.ForgotPassword)
router.get('/checkuser',UserController.CheckUser)
router.get('/:id',UserController.GetUserById)
router.patch('/edit/:id',VerifyToken,ImageUpload.single('image'),UserController.EditUser)

module.exports = router