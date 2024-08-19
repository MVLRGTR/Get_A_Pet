const router = require('express').Router()
const PetController = require('../controllers/PetController')

//middleware
const VerifyToken = require('../helpers/Verify-token') 
const {ImageUpload} = require('../helpers/ImageUpload')



router.post('/create',VerifyToken,ImageUpload.array('images'),PetController.Create)
router.get('/',PetController.GetAllPets)
router.get('/mypets',VerifyToken,PetController.GetAllUserPets)
router.get('/myadoptions',VerifyToken,PetController.GetUserAdoptionsPets)
router.get('/:id',PetController.PetById)
router.delete('/:id',VerifyToken,PetController.DeletePetById)
router.patch('/:id',VerifyToken ,ImageUpload.array('images'),PetController.UpdatePetById)
router.patch('/schedule/:id',VerifyToken,PetController.ScheduleVisity)
router.patch('/concludeadopter/:id',VerifyToken,PetController.ConcludeAdoption)

module.exports = router