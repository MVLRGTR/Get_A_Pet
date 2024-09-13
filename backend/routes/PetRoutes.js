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
    router.patch('/adoptionrequest/:id',VerifyToken,PetController.AdoptionRequest)
    router.patch('/concludeadopter/:id',VerifyToken,PetController.ConcludeAdoption)
    router.patch('/cancellationrequestadopter/:id',VerifyToken,PetController.CancellationRequestAdopter)
    router.patch('/cancellationadoptionbytutor/:id',VerifyToken,PetController.CancellationAdoptionByTutor)
    router.patch('/renewadoptionbytutor/:id',VerifyToken,PetController.RenewAdoptionByTutor)
    router.patch('/addfavoritepet/:id',VerifyToken,PetController.AddFavoritePet)
    router.patch('/removefavoritepet/:id',VerifyToken,PetController.RemoveFavoritePet)


module.exports = router