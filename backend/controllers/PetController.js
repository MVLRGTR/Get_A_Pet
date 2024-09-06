const Pet = require('../models/Pet')
const NotificationsController = require('../controllers/NotificationsController')
const EmailSend = require('../service/email/EmailSend')
const User = require('../models/User')

//helpers
const GetToken = require('../helpers/GetToken')
const GetUserByToken = require('../helpers/GetUserByToken')
const OrderPetsByCEP = require('../helpers/OrderPetsByCEP')
const Verifytoken = require('../helpers/Verify-token')
const ObjectId = require('mongoose').Types.ObjectId

//others
const fs = require('fs')
const path = require('path')

module.exports = class PetController {

    static async Create(req, res) {
        const { name, age, weight, color, description } = req.body
        const images = req.files
        const available = true //para que o pet cadastrado começe sendo disponivel para adoção
        // console.log(`Entrou aqui para verificar o req.user : ${JSON.stringify(req.user)}`)
        if (!name) {
            res.status(422).json({ message: 'O nome não pode ser nulo , por favor verifique o que foi digitado' })
            return
        }
        if (!age) {
            res.status(422).json({ message: 'A idade não pode ser nula , por favor verifique o que foi digitado' })
            return
        }
        if (!weight) {
            res.status(422).json({ message: 'O peso não pode ser nulo , por favor verifique o que foi digitado' })
            return
        }
        if (!color) {
            res.status(422).json({ message: 'A cor nao pode ser nula , por favor verifique o que foi digitado' })
            return
        }
        if (!images) {
            res.status(422).json({ message: 'pelo menos uma image é obrigatória , por favor verifique o que foi digitado' })
            return
        }

        const token = GetToken(req)
        const user = await GetUserByToken(token)
        if(!user){
            res.status(422).json({message:'Usuario não encontrado , por favor verifique o que foi digitado'})
            return
        }
        const userDb = await User.findById(user._id)

        if(!userDb.address){
            res.status(422).json({ message: 'Você não pode adicionar um pet na nossa plataforma sem ter um endereço cadastrado' })
            return
        }
        //console.log(`user : ${JSON.stringify(user)}`)

        const pet = new Pet({
            name,
            age,
            weight,
            color,
            images: [],
            available,
            description,
            user: {
                _id: user._id,
                name: user.name,
                img: user.img,
                phone: user.phone
            },
            address:userDb.address
        })

        for (let image of images) {
            pet.images.push(image.filename)
        }

        try {
            const NewPet = await pet.save()
            res.status(201).json({
                message: 'Pet Cadastrado com sucesso',
                NewPet
            })
            NotificationsController.CreateTo(`${user.name} seu pet ${pet.name} foi adicionado para adoção com sucesso !!!`,user._id,'Pet Criado com sucesso',pet.images[0],NewPet._id)
            EmailSend.EmailNewPetForAllUsers(pet)
        } catch (error) {
            res.status(500).json({ message: error })
        }

    }

    static async GetAllPets(req, res) {
        const cepUser = req.body.cep
        const pets = await Pet.find({available:true}).sort('-createdAt')

        if(cepUser){
            console.log(`cepUser :${cepUser} cepUser typeof : ${typeof cepUser} cepUser.lenght :${cepUser.toString().length}`)
            if(typeof cepUser === 'number' && cepUser.toString().length === 8){
                const PetsOrder = OrderPetsByCEP(pets,cepUser)
                res.status(200).json({
                    message: 'Pets retornados com sucesso !!!',
                    PetsOrder
                })
            }else{
                res.status(404).json({message:'Cep informado inválido , por favor verifique o que foi digitado'})
            }
        }else{
            res.status(200).json({
                message: 'Pets retornados com sucesso !!!',
                pets
            })
        }

    }

    static async GetAllUserPets(req, res) {
        const token = GetToken(req)
        const user = await GetUserByToken(token)
        if(!user){
            res.status(422).json({message:'Usuario não encontrado , por favor verifique o que foi digitado'})
            return
        }

        const pets = await Pet.find({ 'user._id': user._id }).sort('-createdAt')   //Para acessar sub-documents no mongodb fazemos a utilização dessa sintaxe

        if (!pets) {
            res.status(404).json({ message: 'Não existem pets para o usuario informado  no banco de dados , por favor verifique o que foi digitado' })
            return
        }

        res.status(200).json({
            message: 'Pets do usuario retornados com suscesso !!!',
            pets
        })

    }

    static async GetUserAdoptionsPets(req, res) {
        // Nesse endpoint faço o retorno de requisições de adoções bem como pets com adoção já concluidas para esse usuario , pets com adoção concluidas serão tratadas no front-end
        const token = GetToken(req)
        const user = await GetUserByToken(token)
        if(!user){
            res.status(422).json({message:'Usuario não encontrado , por favor verifique o que foi digitado'})
            return
        }
        try{
            const pets = await Pet.find({
                adopter:{
                    $elemMatch:{_id:user._id}
                }
            })
            if(!pets){
                res.status(404).json({message:'Nenhum pet encontrado para o id do adotante fornecido , por favor verifique o que foi digitado'})
                return 
            }
            res.status(200).json({message:'Pets do adotante retornado com sucesso',pets})
        }catch(erro){
            res.status(500).json({ message: 'Erro ao buscar os pets', erro })
            console.log(`erro : ${erro}`)
        }
    }

    static async PetById(req, res) {
        const id = req.params.id
    
        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'Id do pet inválido , por favor verifique o que foi digitado' })
            return
        }
        const pet = await Pet.findById(id)
        if (!pet) {
            res.status(404).json({ message: 'Pet não existe no banco de dados , por favor verifique o que foi digitado' })
            return
        }

        if(!pet.available){
            try{
                const token = GetToken(req)
                const user = await GetUserByToken(token)
                if(user._id.toString() === pet.user._id.toString()){
                    res.status(200).json({
                        message: 'Pet retornado com sucesso',
                        pet
                    })
                    return
                }
                if(pet.adopter[0]._id.toString() === user._id.toString() ){
                    res.status(200).json({
                        message: 'Pet retornado com sucesso',
                        pet
                    })
                    return
                }else{
                    res.status(404).json({ message: 'Erro ao processar sua operação , Não autorizado , por favor verifique o que foi digitado ' })
                }
                
            }catch(error) {
                res.status(404).json({ message: 'Erro ao processar sua operação , por favor verifique o que foi digitado ' })
            }
        }else{
            res.status(200).json({
                message: 'Pet retornado com sucesso',
                pet
            })
        }
    }

    static async DeletePetById(req, res) {
        const id = req.params.id

        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'Id do pet inválido , por favor verifique o que foi digitado' })
            return
        }
        const pet = await Pet.findOne({ _id: id })
        if (!pet) {
            res.status(404).json({ message: 'Pet não existe no banco de dados , por favor verifique o que foi digitado' })
            return
        }

        const token = GetToken(req)
        const user = await GetUserByToken(token)
        if(!user){
            res.status(422).json({message:'Usuario não encontrado , por favor verifique o que foi digitado'})
            return
        }

        if (pet.user._id.toString() !== user._id.toString()) {  //verificando se a requisição de exclusão vem do usuario que criou o pet
            res.status(422).json({ message: 'Erro ao processar sua operação , por favor verifique o que foi digitado' })
            return
        }

        if(pet.adopter.length != 0 && pet.available === false){
            res.status(422).json({ message: 'Erro ao processar sua operação ,o pet não pode ser excluido pois o mesmo já tem um adotante, por favor verifique o que foi digitado' })
            return
        }

        pet.images.map((image) => {
            const imagePath = path.join(__dirname, '..', 'public', 'images', 'pets', image);
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error('Erro ao excluir a imagem:', err);
                }
            })
        })

        await Pet.findByIdAndDelete(id)

        res.status(200).json({
            message: 'Pet exluido com sucesso'
        })

        if(pet.adopter.length > 0){
            pet.adopter.map((index) => {
                NotificationsController.CreateTo(`Infelizmente o pet : ${pet.name} ao qual você tinha interesse foi retirado da adoção pelo seu tutor , mas não se preocupe, pois você pode achar outros pets para doção em nossa plataforma `,index._id,`Pet retirado da adoção`)
            })
        }

    }

    static async UpdatePetById(req, res) {
        const id = req.params.id
        const { name, age, weight, color, description, available } = req.body
        const images = req.files
        const updateData = {}

        console.log(`req.files : ${req.files}`)

        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'Id do pet inválido , por favor verifique o que foi digitado' })
            return
        }

        const pet = await Pet.findOne({ _id: id })

        if (!pet) {
            res.status(404).json({ message: 'Pet não existe no banco de dados , por favor verifique o que foi digitado' })
            return
        }

        const token = GetToken(req)
        const user = await GetUserByToken(token)
        if(!user){
            res.status(422).json({message:'Usuario não encontrado , por favor verifique o que foi digitado'})
            return
        }

        if (pet.user._id.toString() !== user._id.toString()) {  //verificando se a requisição de edição vem do usuario que criou o pet mesma logica acima 
            res.status(422).json({ message: 'Erro ao processar sua operação , por favor verifique o que foi digitado' })
            return
        }

        if(!pet.available){
            res.status(422).json({ message: 'Você não pode editar um pet que já saiu da adoção, por favor verifique o que foi digitado' })
            return
        }

        if (!name) {
            res.status(422).json({ message: 'O nome não pode ser nulo , por favor verifique o que foi digitado' })
            return
        }
        updateData.name = name
        if (!age) {
            res.status(422).json({ message: 'A idade não pode ser nula , por favor verifique o que foi digitado' })
            return
        }
        updateData.age = age
        if (!weight) {
            res.status(422).json({ message: 'O peso não pode ser nulo , por favor verifique o que foi digitado' })
            return
        }
        updateData.weight = weight
        if (!color) {
            res.status(422).json({ message: 'A cor nao pode ser nula , por favor verifique o que foi digitado' })
            return
        }
        updateData.color = color
        if (!available) {
            res.status(422).json({ message: 'O satus da adoção nao pode ser nulo , por favor verifique o que foi digitado' })
            return
        }
        updateData.available = available
        updateData.description = description

        console.log(`images :${images}`)
        if (images.length > 0) {
            updateData.images = []
            for (let image of images) {
                updateData.images.push(image.filename)
            }
        }

        await Pet.findByIdAndUpdate(id, updateData)

        res.status(200).json({
            message: 'Pet atualizado com sucesso !!!'
        })
    }

    static async AdoptionRequest(req, res) {
        const id = req.params.id
        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'Id do pet inválido , por favor verifique o que foi digitado' })
            return
        }
        const pet = await Pet.findOne({ _id: id })
        if (!pet) {
            res.status(404).json({ message: 'Pet não existe no banco de dados , por favor verifique o que foi digitado' })
            return
        }
        if(!pet.available){
            res.status(422).json({ message: 'Pet não disponivél para adoção , por favor verifique o que foi digitado' })
            return
        }

        const token = GetToken(req)
        const user = await GetUserByToken(token)
        if(!user){
            res.status(422).json({message:'Usuario não encontrado , por favor verifique o que foi digitado'})
            return
        }
        const userDb = await User.findById(user._id)

        if(!userDb.address){
            res.status(422).json({ message: 'Você não pode adotar um pet na nossa plataforma sem ter um endereço cadastrado' })
            return
        }

        if (pet.user._id.toString() === user._id.toString()) {  //verificando se a requisição de adoção vem do usuario que criou o pet
            res.status(422).json({ message: 'Não podemos fazer um pedido de adoção para o seu proprio pet , por favor verifique o que foi digitado' })
            return
        }

        for (let index of pet.adopter) {
            if (index._id.toString() === user._id.toString()) {
                res.status(422).json({ message: 'Erro ao processar a sua solicitação, você já fez essa solicitação anteriormente, por favor verifique o que foi digitado' });
                return
            }
        }

        pet.adopter.push({
            _id: user._id,
            name: user.name,
            phone: user.phone,
            img: user.img
        })

        await Pet.findByIdAndUpdate(id, pet)

        res.status(200).json({
            message: `O pedido de adoção foi feito com sucesso , entre em contato com ${pet.user.name} no telefone ${pet.user.phone} para acertar os detelhes da adoção !!!`
        })

        NotificationsController.CreateTo(`Você tem uma nova solicitação de adoção para o seu pet ${pet.name} do possivél tutor ${user.name}`,pet.user._id,'Solicitação de adoção',pet.images[0],pet._id)

    }

    static async ConcludeAdoption(req, res) {
        const id = req.params.id
        const idAdoption = req.body.idadoption
        let AdoptionOk = ''
        let AdoptionsRelease = []

        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'Id do pet inválido , por favor verifique o que foi digitado' })
            return
        }
        const pet = await Pet.findOne({ _id: id })
        if (!pet) {
            res.status(404).json({ message: 'Pet não existe no banco de dados , por favor verifique o que foi digitado' })
            return
        }
        if (!idAdoption) {
            res.status(404).json({ message: 'Id do adotante não consta na requisição , por favor verifique o que foi digitado' })
            return
        }
        if(!pet.available){
            res.status(404).json({ message: 'Pet ja foi retirado da adoção , por favor verifique o que foi digitado' })
            return
        }

        const token = GetToken(req)
        const user = await GetUserByToken(token)
        if(!user){
            res.status(422).json({message:'Usuario não encontrado , por favor verifique o que foi digitado'})
            return
        }

        if (pet.user._id.toString() != user._id.toString()) {  //verificando se a requisição de cocnlusão de adoção vem do usuario que criou o pet
            res.status(422).json({ message: 'Erro ao processar sua operação , por favor verifique o que foi digitado' })
            return
        }

        pet.adopter.map((index) => {
            if (index._id.toString() === idAdoption.toString()) {
                AdoptionOk = index
            }else{
                AdoptionsRelease.push(index._id)
            }
        })

        if (!AdoptionOk) {
            res.status(422).json({ message: 'Erro ao processar sua operação ,Nenhum adotante com esse id fez a solicitação anteriormente, por favor verifique o que foi digitado' })
            return
        }

        console.log(`AdopterOk : ${JSON.stringify(AdoptionOk)}`)

        pet.adopter = AdoptionOk
        pet.available = false
        await Pet.findByIdAndUpdate(id,pet)

        res.status(200).json({
            message: `O pedido de adoção foi concuido com sucesso para o tutor ${AdoptionOk.name} !!!`
        })

        if(AdoptionsRelease.length > 0){
            AdoptionsRelease.map((index)=>{
                NotificationsController.CreateTo(`Infelizmente o pet ${pet.name} foi adotado por outro tutor , mas não se preocupe porque temos varios pets na nossa plataforma , encontre um e seja feliz`,index._id,`Pet retirado da adoção`)
            })
        }
        NotificationsController.CreateTo(`Parabéns !!! você agora é o novo tutor do pet ${pet.name}`,AdoptionOk._id,`Conclusão da adoção`,pet.images[0],pet._id)
            
    }

    static async CancellationRequestAdopter(req,res){
        const id = req.params.id
        let verifyAdoption = false
        let adoptions = []

        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'Id do pet inválido , por favor verifique o que foi digitado' })
            return
        }
        const pet = await Pet.findOne({ _id: id })
        if (!pet) {
            res.status(404).json({ message: 'Pet não existe no banco de dados , por favor verifique o que foi digitado' })
            return
        }
        if(!pet.available){
            res.status(422).json({ message: 'Pet ja foi adotado , por favor verifique o que foi digitado' })
            return
        }

        const token = GetToken(req)
        const user = await GetUserByToken(token)
        if(!user){
            res.status(422).json({message:'Usuario não encontrado , por favor verifique o que foi digitado'})
            return
        }

        pet.adopter.map((index) => {
            if(index._id.toString() === user._id.toString()){
                verifyAdoption = true
            }else{
                adoptions.push(index)
            }
        })

        if(verifyAdoption){
            pet.adopter = adoptions
            await Pet.findByIdAndUpdate(id,pet)
            res.status(200).json({message: `Exclusão do pedido de adoção  concuido com sucesso para o tutor ${user.name} !!!`})
            NotificationsController.CreateTo(`Tivemos a desistência da possivél adoção por parte do tutor ${user.name} para o pet ${pet.name}`,pet.user._id,`Desistência da adoção`,pet.images[0])
        }else{
            res.status(404).json({ message: 'Erro ao processar sua solicitação ,pois não existem solicitações desse usuario para adoção do pet informado, por favor verifique o que foi digitado' })
            return
        }
    }

    static async CancellationAdoptionByTutor(req,res){
        const id = req.params.id

        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'Id do pet inválido , por favor verifique o que foi digitado' })
            return
        }
        const pet = await Pet.findOne({ _id: id })
        if (!pet) {
            res.status(404).json({ message: 'Pet não existe no banco de dados , por favor verifique o que foi digitado' })
            return
        }

        const token = GetToken(req)
        const user = await GetUserByToken(token)
        if(!user){
            res.status(422).json({message:'Usuario não encontrado , por favor verifique o que foi digitado'})
            return
        }

        if(pet.user._id.toString() != user._id.toString()){
            res.status(422).json({ message: 'Pet não pertece ao usuario da solicitação , por favor verifique o que foi digitado' })
            return
        }
        if(!pet.available){
            res.status(422).json({ message: 'Pet já foi tirado do processo de adoção , por favor verifique o que foi digitado' })
            return
        }

        if(pet.adopter.length > 0){
            pet.adopter.map((index) => {
                NotificationsController.CreateTo(`Infelizmente o pet ${pet.name} foi retirado de adoção pelo tutor atual , mas não se preocupe temos outros pets em nossa plataforma.`,index._id,`Desistência da adoção`)
            })
        }

        pet.available = false
        pet.adopter = []
        await Pet.findByIdAndUpdate(id,pet)

        res.status(200).json({message: `Retirada de adoção o pet ${pet.name}  concluida  com sucesso , solicitado pelo tutor ${user.name} !!!`})
    }

    static async RenewAdoptionByTutor(req,res){
        const id = req.params.id

        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'Id do pet inválido , por favor verifique o que foi digitado' })
            return
        }
        const pet = await Pet.findOne({ _id: id })
        if (!pet) {
            res.status(404).json({ message: 'Pet não existe no banco de dados , por favor verifique o que foi digitado' })
            return
        }

        const token = GetToken(req)
        const user = await GetUserByToken(token)
        if(!user){
            res.status(422).json({message:'Usuario não encontrado , por favor verifique o que foi digitado'})
            return
        }

        if(pet.user._id.toString() != user._id.toString()){
            res.status(422).json({ message: 'Erro ao processar sua operação, por favor verifique o que foi digitado' })
            return
        }
        if(pet.available){
            res.status(422).json({ message: 'Pet já está no processo de adoção , por favor verifique o que foi digitado' })
            return
        }
        if(pet.adopter.length === 1){
            res.status(422).json({ message: 'Pet já foi adotado, por isso não é possivél coloca-lo novamente em um processo de adoção, por favor verifique o que foi digitado' })
            return
        }

        pet.available = true
        await Pet.findByIdAndUpdate(id,pet)

        res.status(200).json({message: `Renovação de adoção do pet ${pet.name}  concluida  com sucesso , solicitado pelo tutor ${user.name} !!!`})
    }

    static async AddFavoritePet(req,res){
        const petid = req.params.id

        if (!ObjectId.isValid(petid)) {
            res.status(422).json({ message: 'Id do pet inválido , por favor verifique o que foi digitado' })
            return
        }
        const pet = await Pet.findOne({ _id: petid }).select('_id name age weight images available description user address createdAt updatedAt')
        if (!pet) {
            res.status(404).json({ message: 'Pet não existe no banco de dados , por favor verifique o que foi digitado' })
            return
        }

        const token = GetToken(req)
        const user = await GetUserByToken(token)
        if(!user){
            res.status(422).json({message:'Usuario não encontrado , por favor verifique o que foi digitado'})
            return
        }
        const userDb = await User.findById(user._id)

        if(userDb._id.toString()===pet.user._id.toString()){
            res.status(422).json({ message: 'Erro ao processar a sua solicitação, você não pode adicionar seu próprio pet como favorito, por favor verifique o que foi digitado' });
            return
        }

        for(let index of userDb.favoritepets){
            if(index._id.toString() === pet._id.toString()){
                res.status(422).json({ message: 'Erro ao processar a sua solicitação, você já fez essa solicitação anteriormente, por favor verifique o que foi digitado' });
                return
            }
        }
        
        userDb.favoritepets.push(pet)
        await User.findByIdAndUpdate(user.id,userDb)

        res.status(200).json({
            message: `O pet ${pet.name} foi adicionado a sua lista de pets favoritos com sucesso !!!`
        })
    }

    static async RemoveFavoritePet(req,res){
        const petid = req.params.id
        let validation = false
        let favoritepets = []

        if (!ObjectId.isValid(petid)) {
            res.status(422).json({ message: 'Id do pet inválido , por favor verifique o que foi digitado' })
            return
        }
        const pet = await Pet.findOne({ _id: petid }).select('_id name age weight images available description user address createdAt updatedAt')
        if (!pet) {
            res.status(404).json({ message: 'Pet não existe no banco de dados , por favor verifique o que foi digitado' })
            return
        }

        const token = GetToken(req)
        const user = await GetUserByToken(token)
        if(!user){
            res.status(422).json({message:'Usuario não encontrado , por favor verifique o que foi digitado'})
            return
        }
        const userDb = await User.findById(user._id)

        for(let index of userDb.favoritepets){
            if(index._id.toString() === pet._id.toString()){
                validation = true
            }else{
                favoritepets.push(index)
            }
        }

        if(validation){
            userDb.favoritepets = favoritepets
            await User.findByIdAndUpdate(user._id,userDb)
            res.status(200).json({message: `Pet ${pet.name} excluido da sua lista de favoritos com sucesso !!!`})
        }else{
            res.status(404).json({ message: 'Pet não existe na sua lista de favoritos , por favor verifique o que foi digitado' })
            return
        }

    }

}