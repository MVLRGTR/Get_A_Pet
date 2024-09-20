const Pet = require('../models/Pet')
const NotificationsController = require('../controllers/NotificationsController')
const EmailSend = require('../service/email/EmailSend')
const User = require('../models/User')
const z = require('zod')

//helpers
const GetToken = require('../helpers/GetToken')
const GetUserByToken = require('../helpers/GetUserByToken')
const OrderPetsByCEP = require('../helpers/OrderPetsByCEP')
const ObjectId = require('mongoose').Types.ObjectId

//others
const fs = require('fs')
const path = require('path')
require('dotenv').config()

module.exports = class PetController {

    static async Create(req, res) {

        const toNumber = (value) => {
            const number = Number(value)
            return isNaN(number) ? value : number
        }

        const petParse = {
            name: req.body.name,
            age: toNumber(req.body.age),
            weight: toNumber(req.body.weight),
            color: req.body.color,
            images: [],
            available: true,
            description: req.body.description
        }

        const images = req.files

        for (let image of images) {
            petParse.images.push(image.filename)
        }

        const petSchema = z.object({
            name: z.string().min(3, { message: 'O nome precisa ter pelo menos 3 caracteres, por favor verifique o que foi digitado' }).max(25, { message: 'O nome pode ter no máximo 25 caracteres ,por favor verifique o que foi digitado' }),
            age: z.number({ message: 'Formato da idade digita é inválida' }).min(1, { message: 'A idade minima é um 1 mês, por favor verifique o que foi digitado' }).max(30, { message: 'A idade maxima para animais é 30 anos' }),
            weight: z.number({ message: 'Formato do peso inválido' }).min(1, { message: 'Peso minimo 1kg' }).max(50, { message: 'Peso maximo 50kg' }),
            color: z.string().min(3, { message: 'Cor inválida' }).max(12, { message: 'Cor inválida' }),
            images: z.array(z.string()).min(1, { message: 'Pelo menos imagem precisa ser enviada do Pet' }),
            description: z.string().max(700, { message: 'Número de caracteres não pode ser superior a 700' })
        })

        try {
            petSchema.parse(petParse)
        } catch (error) {
            let returnErros = []
            if (error instanceof z.ZodError) {
                error.errors.map((index) => {
                    returnErros.push(index.message)
                    console.log(`erro : ${JSON.stringify(index.message)}`)
                })
                res.status(422).json({ message: 'Erros na requisição :', returnErros })
                return
            }
        }

        let token, user, userDb
        try {
            token = GetToken(req)
            user = await GetUserByToken(token)
            userDb = await User.findById(user._id)
            if (!userDb.address) {
                res.status(422).json({ message: 'Você não pode adicionar um pet na nossa plataforma sem ter um endereço cadastrado' })
                return
            }
        } catch (Erro) {
            res.status(422).json({ message: 'Usuario não encontrado , por favor verifique o que foi digitado' })
            return
        }

        const pet = new Pet({
            name: petParse.name,
            age: petParse.age,
            weight: petParse.weight,
            color: petParse.color,
            images: petParse.images,
            available: petParse.available,
            description: petParse.description,
            user: {
                _id: userDb._id,
                name: userDb.name,
                img: userDb.img,
                phone: userDb.phone
            },
            address: userDb.address
        })

        try {
            const NewPet = await pet.save()
            res.status(201).json({
                message: 'Pet Cadastrado com sucesso',
                NewPet
            })
            NotificationsController.CreateAll(`O pet ${pet.name} está esperendo por você , venha conhecer o seu proximo amigo !!!`, `Novo Pet disponível`, `${process.env.URL_API}/images/pets/${pet.images[0]}`, `${process.env.URL_FRONTEND}/pets/${pet._id}`)
            EmailSend.EmailNewPetForAllUsers(pet)
        } catch (error) {
            res.status(500).json({ message: error })
        }

    }

    static async GetAllPets(req, res) {
        const cepUser = req.body.cep
        const pets = await Pet.find({ available: true }).sort('-createdAt')

        if (cepUser) {
            console.log(`cepUser :${cepUser} cepUser typeof : ${typeof cepUser} cepUser.lenght :${cepUser.toString().length}`)
            if (typeof cepUser === 'number' && cepUser.toString().length === 8) {
                const PetsOrder = OrderPetsByCEP(pets, cepUser)
                res.status(200).json({
                    message: 'Pets retornados com sucesso !!!',
                    PetsOrder
                })
            } else {
                res.status(404).json({ message: 'Cep informado inválido , por favor verifique o que foi digitado' })
            }
        } else {
            res.status(200).json({
                message: 'Pets retornados com sucesso !!!',
                pets
            })
        }

    }

    static async GetAllUserPets(req, res) {
        const token = GetToken(req)
        const user = await GetUserByToken(token)
        const userDb = await User.findById(user._id)
        if (!userDb) {
            res.status(422).json({ message: 'Usuario não encontrado , por favor verifique o que foi digitado' })
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
        let token, user, userDb
        try {
            token = GetToken(req)
            user = await GetUserByToken(token)
            userDb = await User.findById(user._id)
        } catch (Erro) {
            res.status(422).json({ message: 'Usuario não encontrado , por favor verifique o que foi digitado' })
            return
        }

        try {
            const pets = await Pet.find({
                adopter: {
                    $elemMatch: { _id: user._id }
                }
            })
            if (pets.length === 0) {
                res.status(404).json({ message: 'Nenhum pet encontrado para o id do adotante fornecido', pets })
                return
            }
            res.status(200).json({ message: 'Pets do adotante retornado com sucesso', pets })
        } catch (erro) {
            res.status(500).json({ message: 'Erro ao buscar os pets', erro })
            console.log(`erro : ${erro}`)
        }
    }

    static async PetById(req, res) {
        const id = req.params.id

        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'Id do pet inválido , por favor verifique o que foi digitado ' })
            return
        }
        const pet = await Pet.findById(id)
        if (!pet) {
            res.status(404).json({ message: 'Pet não existe no banco de dados , por favor verifique o que foi digitado' })
            return
        }

        if (!pet.available) {
            try {
                const token = GetToken(req)
                const user = await GetUserByToken(token)
                if (!user) {
                    res.status(422).json({ message: 'Usuario não encontrado , por favor verifique o que foi digitado' })
                    return
                }
                if (user._id.toString() === pet.user._id.toString()) {
                    res.status(200).json({
                        message: 'Pet retornado com sucesso',
                        pet
                    })
                    return
                }
                console.log(`petAdopter :${pet.adopter}`)
                if (pet.adopter[0]._id.toString() === user._id.toString()) {
                    res.status(200).json({
                        message: 'Pet retornado com sucesso',
                        pet
                    })
                    return
                } else {
                    res.status(404).json({ message: 'Erro ao processar sua operação , Não autorizado , por favor verifique o que foi digitado ' })
                }

            } catch (error) {
                res.status(404).json({ message: 'Erro ao processar sua operação , por favor verifique o que foi digitado ' })
            }
        } else {
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

        let token, user, userDb
        try {
            token = GetToken(req)
            user = await GetUserByToken(token)
            userDb = await User.findById(user._id)
        } catch (Erro) {
            res.status(422).json({ message: 'Usuario não encontrado , por favor verifique o que foi digitado' })
            return
        }

        if (pet.user._id.toString() !== user._id.toString()) {  //verificando se a requisição de exclusão vem do usuario que criou o pet
            res.status(422).json({ message: 'Erro ao processar sua operação , por favor verifique o que foi digitado' })
            return
        }

        if (pet.adopter.length != 0 && pet.available === false) {
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

        if (pet.adopter.length > 0) {
            pet.adopter.map((index) => {
                NotificationsController.CreateTo(`Infelizmente o pet : ${pet.name} ao qual você tinha interesse foi retirado da adoção pelo seu tutor , mas não se preocupe, pois você pode achar outros pets para doção em nossa plataforma `, index._id, `Pet retirado da adoção`, `${process.env.URL_API}/images/pets/icongetapet.jpg`, `${process.env.URL_FRONTEND}`)
                EmailSend.EmailCancellationAdopterByTutor(pet,index)
            })
        }

    }

    static async UpdatePetById(req, res) {
        const id = req.params.id
        const images = req.files
        let petDb = {}

        const toNumber = (value) => {
            const number = Number(value)
            return isNaN(number) ? value : number
        }

        try {
            petDb = await Pet.findById({ _id: id })
            if (!petDb.available) {
                res.status(422).json({ message: 'Você não pode editar um pet que foi retirado da adoção' })
                return
            }
            if (!petDb) {
                res.status(404).json({ message: 'Pet não existe no banco de dados , por favor verifique o que foi digitado' })
                return
            }
        } catch (erro) {
            res.status(422).json({ message: 'Id do pet inválido , por favor verifique o que foi digitado' })
            return
        }

        const petParse = {
            name: req.body.name,
            age: toNumber(req.body.age),
            weight: toNumber(req.body.weight),
            color: req.body.color,
            images: [],
            available: true,
            description: req.body.description
        }

        for (let image of images) {
            petParse.images.push(image.filename)
        }

        const petSchema = z.object({
            name: z.string().min(3, { message: 'O nome precisa ter pelo menos 3 caracteres, por favor verifique o que foi digitado' }).max(25, { message: 'O nome pode ter no máximo 25 caracteres ,por favor verifique o que foi digitado' }),
            age: z.number({ message: 'Formato da idade digita é inválida' }).min(1, { message: 'A idade minima é um 1 mês, por favor verifique o que foi digitado' }).max(30, { message: 'A idade maxima para animais é 30 anos' }),
            weight: z.number({ message: 'Formato do peso inválido' }).min(1, { message: 'Peso minimo 1kg' }).max(50, { message: 'Peso maximo 50kg' }),
            color: z.string().min(3, { message: 'Cor inválida' }).max(30, { message: 'Cor inválida' }),
            images: z.array(z.string()).min(1, { message: 'Pelo menos uma imagem precisa ser enviada do Pet' }),
            description: z.string().max(700, { message: 'Número de caracteres não pode ser superior a 700' })
        })

        try {
            petSchema.parse(petParse)
        } catch (error) {
            let returnErros = []
            if (error instanceof z.ZodError) {
                error.errors.map((index) => {
                    returnErros.push(index.message)
                    console.log(`erro : ${JSON.stringify(index.message)}`)
                })
                res.status(422).json({ message: 'Erros na requisição :', returnErros })
                return
            }
        }

        let token, user, userDb
        try {
            token = GetToken(req)
            user = await GetUserByToken(token)
            userDb = await User.findById(user._id)
        } catch (Erro) {
            res.status(422).json({ message: 'Usuario não encontrado , por favor verifique o que foi digitado' })
            return
        }

        if (petDb.user._id.toString() !== userDb._id.toString()) {  //verificando se a requisição de edição vem do usuario que criou o pet mesma logica acima 
            res.status(422).json({ message: 'Erro ao processar sua operação , por favor verifique o que foi digitado' })
            return
        }

        await Pet.findByIdAndUpdate(id,petParse)

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
        if (!pet.available) {
            res.status(422).json({ message: 'Pet não disponivél para adoção , por favor verifique o que foi digitado' })
            return
        }

        let token, user, userDb
        try {
            token = GetToken(req)
            user = await GetUserByToken(token)
            userDb = await User.findById(user._id)
            if (!userDb.address) {
                res.status(422).json({ message: 'Você não pode adicionar um pet na nossa plataforma sem ter um endereço cadastrado' })
                return
            }
        } catch (Erro) {
            res.status(422).json({ message: 'Usuario não encontrado , por favor verifique o que foi digitado' })
            return
        }

        if (!userDb.address) {
            res.status(422).json({ message: 'Você não pode adotar um pet na nossa plataforma sem ter um endereço cadastrado' })
            return
        }

        if (pet.user._id.toString() === userDb._id.toString()) {  //verificando se a requisição de adoção vem do usuario que criou o pet
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
            _id: userDb._id,
            name: userDb.name,
            phone: userDb.phone,
            img: userDb.img
        })

        await Pet.findByIdAndUpdate(id, pet)
        const userTutor = await User.findById(pet.user._id).select('email name phone receiveremail')


        res.status(200).json({
            message: `O pedido de adoção foi feito com sucesso , entre em contato com ${pet.user.name} no telefone ${pet.user.phone} para acertar os detelhes da adoção !!!`
        })
        NotificationsController.CreateTo(`Você tem uma nova solicitação de adoção para o seu pet ${pet.name} do possivél tutor ${user.name}`, pet.user._id, 'Solicitação de adoção', `${process.env.URL_API}/images/pets/${pet.images[0]}`, `${process.env.URL_FRONTEND}/pets/mypets/${pet._id}`)
        EmailSend.EmailNewRequestAdopter(pet, userTutor)
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
        if (!ObjectId(idAdoption)) {
            res.status(404).json({ message: 'Id do adotante inválido , por favor verifique o que foi digitado' })
            return
        }
        const AdopterDb = await User.findById(idAdoption).select('_id name email ')
        if (!AdopterDb) {
            res.status(422).json({ message: 'Usuario adotante não encontrado , por favor verifique o que foi digitado' })
            return
        }
        if (!pet.available) {
            res.status(404).json({ message: 'Pet ja foi retirado da adoção , por favor verifique o que foi digitado' })
            return
        }

        let token, user, userDb
        try {
            token = GetToken(req)
            user = await GetUserByToken(token)
            userDb = await User.findById(user._id)
            if (!userDb.address) {
                res.status(422).json({ message: 'Você não pode adicionar um pet na nossa plataforma sem ter um endereço cadastrado' })
                return
            }
        } catch (Erro) {
            res.status(422).json({ message: 'Usuario não encontrado , por favor verifique o que foi digitado' })
            return
        }

        if (pet.user._id.toString() != userDb._id.toString()) {  //verificando se a requisição de cocnlusão de adoção vem do usuario que criou o pet
            res.status(422).json({ message: 'Erro ao processar sua operação , por favor verifique o que foi digitado' })
            return
        }

        pet.adopter.map((index) => {
            if (index._id.toString() === idAdoption.toString()) {
                AdoptionOk = index
            } else {
                AdoptionsRelease.push(index._id)
            }
        })

        if (!AdoptionOk) {
            res.status(422).json({ message: 'Erro ao processar sua operação ,Nenhum adotante com esse id fez a solicitação anteriormente, por favor verifique o que foi digitado' })
            return
        }

        pet.adopter = AdoptionOk
        pet.available = false
        await Pet.findByIdAndUpdate(id, pet)

        res.status(200).json({
            message: `O pedido de adoção foi concuido com sucesso para o tutor ${AdoptionOk.name} !!!`
        })

        if (AdoptionsRelease.length > 0) {
            AdoptionsRelease.map((index) => {
                NotificationsController.CreateTo(`Infelizmente o pet ${pet.name} foi adotado por outro tutor , mas não se preocupe porque temos varios pets na nossa plataforma , encontre um e seja feliz`, index._id, `Pet retirado da adoção`)
                EmailSend.EmailPetRemovedFromAdoption(pet, index)
            })
        }
        //Adotante
        EmailSend.EmailConcludeAdopter(pet, user, 'adopter')
        NotificationsController.CreateTo(`Parabéns !!! você agora é o novo tutor do pet ${pet.name}`, AdoptionOk._id, `Conclusão da adoção`, pet.images[0], pet._id)

        //Tutor
        EmailSend.EmailConcludeAdopter(pet, user)
        NotificationsController.CreateTo(`Adoção para o pet ${pet.name} foi concluida com sucesso , para o adotante :${AdopterDb.name}`, 'Adcoção concluida', `${process.env.URL_API}/images/pets/${pet.images[0]}`, `${process.env.URL_FRONTEND}/pets/mypets/${pet._id}`)
    }

    static async CancellationRequestAdopter(req, res) {
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
        if (!pet.available) {
            res.status(422).json({ message: 'Pet ja foi adotado , por favor verifique o que foi digitado' })
            return
        }

        let token, user, userDb
        try {
            token = GetToken(req)
            user = await GetUserByToken(token)
            userDb = await User.findById(user._id)
        } catch (Erro) {
            res.status(422).json({ message: 'Usuario não encontrado , por favor verifique o que foi digitado' })
            return
        }

        pet.adopter.map((index) => {
            if (index._id.toString() === userDb._id.toString()) {
                verifyAdoption = true
            } else {
                adoptions.push(index)
            }
        })

        if (verifyAdoption) {
            pet.adopter = adoptions
            await Pet.findByIdAndUpdate(id, pet)
            res.status(200).json({ message: `Exclusão do pedido de adoção  concuido com sucesso para o tutor ${userDb.name} !!!` })
            NotificationsController.CreateTo(`Tivemos a desistência da possivél adoção por parte do tutor ${userDb.name} para o pet ${pet.name}`, pet.user._id, `Desistência da adoção`, `${process.env.URL_API}/images/pets/${pet.images[0]}`, `${process.env.URL_FRONTEND}/pets/mypets/${pet._id}`)
            EmailSend.EmailCancellationRequestAdopter(user, pet)
        } else {
            res.status(404).json({ message: 'Erro ao processar sua solicitação ,pois não existem solicitações desse usuario para adoção do pet informado, por favor verifique o que foi digitado' })
            return
        }
    }

    static async CancellationAdoptionByTutor(req, res) {
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

        let token, user, userDb
        try {
            token = GetToken(req)
            user = await GetUserByToken(token)
            userDb = await User.findById(user._id)
            if (!userDb.address) {
                res.status(422).json({ message: 'Você não pode adicionar um pet na nossa plataforma sem ter um endereço cadastrado' })
                return
            }
        } catch (Erro) {
            res.status(422).json({ message: 'Usuario não encontrado , por favor verifique o que foi digitado' })
            return
        }

        if (pet.user._id.toString() != user._id.toString()) {
            res.status(422).json({ message: 'Pet não pertece ao usuario da solicitação , por favor verifique o que foi digitado' })
            return
        }
        if (!pet.available) {
            res.status(422).json({ message: 'Pet já foi tirado do processo de adoção , por favor verifique o que foi digitado' })
            return
        }

        if (pet.adopter.length > 0) {
            pet.adopter.map((index) => {
                NotificationsController.CreateTo(`Infelizmente o pet ${pet.name} foi retirado de adoção pelo tutor atual , mas não se preocupe temos outros pets em nossa plataforma.`, index._id, `Desistência da adoção`)
                EmailSend.EmailCancellationAdopterByTutor(pet, index)
            })
        }

        pet.available = false
        pet.adopter = []
        await Pet.findByIdAndUpdate(id, pet)

        res.status(200).json({ message: `Retirada de adoção o pet ${pet.name}  concluida  com sucesso , solicitado pelo tutor ${user.name} !!!` })
    }

    static async RenewAdoptionByTutor(req, res) {
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

        let token, user, userDb
        try {
            token = GetToken(req)
            user = await GetUserByToken(token)
            userDb = await User.findById(user._id)
            if (!userDb.address) {
                res.status(422).json({ message: 'Você não pode adicionar um pet na nossa plataforma sem ter um endereço cadastrado' })
                return
            }
        } catch (Erro) {
            res.status(422).json({ message: 'Usuario não encontrado , por favor verifique o que foi digitado' })
            return
        }

        if (pet.user._id.toString() != user._id.toString()) {
            res.status(422).json({ message: 'Erro ao processar sua operação, por favor verifique o que foi digitado' })
            return
        }
        if (pet.available) {
            res.status(422).json({ message: 'Pet já está no processo de adoção , por favor verifique o que foi digitado' })
            return
        }
        if (pet.adopter.length === 1) {
            res.status(422).json({ message: 'Pet já foi adotado, por isso não é possivél coloca-lo novamente em um processo de adoção, por favor verifique o que foi digitado' })
            return
        }

        pet.available = true
        await Pet.findByIdAndUpdate(id, pet)

        res.status(200).json({ message: `Renovação de adoção do pet ${pet.name}  concluida  com sucesso , solicitado pelo tutor ${user.name} !!!` })
    }

    static async AddFavoritePet(req, res) {
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

        let token, user, userDb
        try {
            token = GetToken(req)
            user = await GetUserByToken(token)
            userDb = await User.findById(user._id)
            if (!userDb.address) {
                res.status(422).json({ message: 'Você não pode adicionar um pet na nossa plataforma sem ter um endereço cadastrado' })
                return
            }
        } catch (Erro) {
            res.status(422).json({ message: 'Usuario não encontrado , por favor verifique o que foi digitado' })
            return
        }
        if (userDb._id.toString() === pet.user._id.toString()) {
            res.status(422).json({ message: 'Erro ao processar a sua solicitação, você não pode adicionar seu próprio pet como favorito, por favor verifique o que foi digitado' });
            return
        }

        for (let index of userDb.favoritepets) {
            if (index._id.toString() === pet._id.toString()) {
                res.status(422).json({ message: 'Erro ao processar a sua solicitação, você já fez essa solicitação anteriormente, por favor verifique o que foi digitado' });
                return
            }
        }

        userDb.favoritepets.push(pet)
        await User.findByIdAndUpdate(user.id, userDb)

        res.status(200).json({
            message: `O pet ${pet.name} foi adicionado a sua lista de pets favoritos com sucesso !!!`
        })
    }

    static async RemoveFavoritePet(req, res) {
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

        let token, user, userDb
        try {
            token = GetToken(req)
            user = await GetUserByToken(token)
            userDb = await User.findById(user._id)
            if (!userDb.address) {
                res.status(422).json({ message: 'Você não pode adicionar um pet na nossa plataforma sem ter um endereço cadastrado' })
                return
            }
        } catch (Erro) {
            res.status(422).json({ message: 'Usuario não encontrado , por favor verifique o que foi digitado' })
            return
        }

        for (let index of userDb.favoritepets) {
            if (index._id.toString() === pet._id.toString()) {
                validation = true
            } else {
                favoritepets.push(index)
            }
        }

        if (validation) {
            userDb.favoritepets = favoritepets
            await User.findByIdAndUpdate(user._id, userDb)
            res.status(200).json({ message: `Pet ${pet.name} excluido da sua lista de favoritos com sucesso !!!` })
        } else {
            res.status(404).json({ message: 'Pet não existe na sua lista de favoritos , por favor verifique o que foi digitado' })
            return
        }

    }

    static async SearchPet(req,res){

        const searchPet = req.params.search
        if(!searchPet){
            res.status(422).json({ message: 'O campo de busca não pode ser nulo , por favor verifique o que foi digitado' })
            return
        }

        const pets = await Pet.find({
            name: { $regex: `.*${searchPet}.*`, $options: 'i' }
        }).select('-adopter')

        if(pets.length === 0){
            res.status(404).json({ message: 'Nenhum pet encontrado !!!' })
            return
        }

        res.status(200).json({
            message: 'Pets retornados com sucesso',
            pets
        })
    }

}