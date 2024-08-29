const Pet = require('../models/Pet')
const NotificationsController = require('../controllers/NotificationsController')

//helpers
const GetToken = require('../helpers/GetToken')
const GetUserByToken = require('../helpers/GetUserByToken')
const ObjectId = require('mongoose').Types.ObjectId


module.exports = class PetController {

    static async Create(req, res) {
        const { name, age, weight, color, description } = req.body
        const images = req.files
        const available = true //para que o pet cadastrado começe sendo disponivel para adoção
        console.log(`Entrou aqui para verificar o req.user : ${JSON.stringify(req.user)}`)
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


        console.log(`Images : ${images} images.lenght : ${images.length}`)

        if (!images) {
            res.status(422).json({ message: 'pelo menos uma image é obrigatória , por favor verifique o que foi digitado' })
            return
        }

        const token = GetToken(req)
        const user = await GetUserByToken(token)
        console.log(`user : ${JSON.stringify(user)}`)

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
            }
        })

        for (let image of images) {
            pet.images.push(image.filename)
            console.log(`image.filename :${image.filename}`)
        }

        console.log(`pet ${pet} e pet.images :${pet.images}`)

        try {
            const NewPet = await pet.save()
            res.status(201).json({
                message: 'Pet Cadastrado com sucesso',
                NewPet
            })
            NotificationsController.CreateAll(`Temos um novo pet para adoção que se chama ${pet.name}`)
        } catch (error) {
            res.status(500).json({ message: error })
        }

    }

    static async GetAllPets(req, res) {
        const pets = await Pet.find().sort('-createdAt')
        res.status(200).json({
            message: 'Pets retornados com sucesso !!!',
            pets
        })
    }

    static async GetAllUserPets(req, res) {
        const token = GetToken(req)
        const user = await GetUserByToken(token)

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

        try{
            const pets = await Pet.find({
                adopter:{
                    $elemMatch:{_id:user._id}
                }
            })

            if(!pets){
                return res.status(404).json({message:'Nenhum pet encontrado para o id do adotante fornecido , por favor verifique o que foi digitado'})
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
        res.status(200).json({
            message: 'Pet retornado com sucesso',
            pet
        })
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

        if (pet.user._id.toString() !== user._id.toString()) {  //verificando se a requisição de exclusão vem do usuario que criou o pet
            res.status(422).json({ message: 'Erro ao processar sua operação , por favor verifique o que foi digitado' })
            return
        }

        if(pet.adopter.length != 0 && pet.available === false){
            res.status(422).json({ message: 'Erro ao processar sua operação ,o pet não pode ser excluido pois o mesmo já tem um adotante, por favor verifique o que foi digitado' })
            return
        }

        await Pet.findByIdAndDelete(id)

        res.status(200).json({
            message: 'Pet exluido com sucesso'
        })

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

        if (pet.user._id.toString() !== user._id.toString()) {  //verificando se a requisição de edição vem do usuario que criou o pet mesma logica acima 
            res.status(422).json({ message: 'Erro ao processar sua operação , por favor verifique o que foi digitado' })
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

        if (pet.user._id.toString() === user._id.toString()) {  //verificando se a requisição de adoção vem do usuario que criou o pet
            res.status(422).json({ message: 'Não podemos fazer um pedido de adoção para o seu proprio pet , por favor verifique o que foi digitado' })
            return
        }

        for (let index of pet.adopter) {
            if (index._id.toString() === user._id.toString()) {
                res.status(422).json({ message: 'Erro ao processar a sua solicitação, você já fez essa solicitação anteriormente, por favor verifique o que foi digitado' });
                return;
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

    }

    static async ConcludeAdoption(req, res) {
        const id = req.params.id
        const idAdoption = req.body.idadoption
        let AdoptionOk = ''

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

        if (pet.user._id.toString() != user._id.toString()) {  //verificando se a requisição de cocnlusão de adoção vem do usuario que criou o pet
            res.status(422).json({ message: 'Erro ao processar sua operação , por favor verifique o que foi digitado' })
            return
        }

        pet.adopter.map((index) => {
            if (index._id.toString() === idAdoption.toString()) {
                AdoptionOk = index
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

        if(pet.user._id.toString() != user._id.toString()){
            res.status(422).json({ message: 'Pet não pertece ao usuario da solicitação , por favor verifique o que foi digitado' })
            return
        }
        if(!pet.available){
            res.status(422).json({ message: 'Pet já foi tirado do processo de adoção , por favor verifique o que foi digitado' })
            return
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

        if(pet.user._id.toString() != user._id.toString()){
            res.status(422).json({ message: 'Pet não pertece ao usuario da solicitação , por favor verifique o que foi digitado' })
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

}