const Pet = require('../models/Pet')

//helpers
const GetToken = require('../helpers/GetToken')
const GetUserByToken = require('../helpers/GetUserByToken')
const ObjectId = require('mongoose').Types.ObjectId

module.exports = class PetController{

    static async Create(req,res){
        const {name , age , weight , color , description } = req.body
        const images = req.files
        const available = true //para que o pet cadastrado começe sendo disponivel para adoção

        if(!name){
            res.status(422).json({message:'O nome não pode ser nulo , por favor verifique o que foi digitado'})
            return
        }
        if(!age){
            res.status(422).json({message:'A idade não pode ser nula , por favor verifique o que foi digitado'})
            return
        }
        if(!weight){
            res.status(422).json({message:'O peso não pode ser nulo , por favor verifique o que foi digitado'})
            return
        }
        if(!color){
            res.status(422).json({message:'A cor nao pode ser nula , por favor verifique o que foi digitado'})
            return
        }


        console.log(`Images : ${images} images.lenght : ${images.length}`)

        if(!images){
            res.status(422).json({message:'pelo menos uma image é obrigatória , por favor verifique o que foi digitado'})
            return
        }

        const token = GetToken(req)
        const user = await GetUserByToken(token)

        const pet = new Pet({
            name,
            age,
            weight,
            color,
            images:[],
            available,
            description,
            user:{
                _id:user._id,
                name:user.name,
                img:user.img,
                phone:user.phone
            }
        })

        for(let image of images){
            pet.images.push(image.filename)
            console.log(`image.filename :${image.filename}`)
        }
        
        console.log(`pet ${pet} e pet.images :${pet.images}`)

        try {
            const NewPet = await pet.save()
            res.status(201).json({
                message:'Pet Cadastrado com sucesso',
                NewPet
            })
        } catch (error) {
            res.status(500).json({message:error})
        }
        
    }

    static async GetAllPets(req,res){
        const pets = await Pet.find().sort('-createdAt')
        res.status(200).json({
            message:'Pets retornados com sucesso !!!',
            pets
        })
    }

    static async GetAllUserPets(req,res){
        const token = GetToken(req)
        const user = await GetUserByToken(token)

        const pets = await Pet.find({'user._id':user._id}).sort('-createdAt')   //Para acessar sub-documents no mongodb fazemos a utilização dessa sintaxe

        res.status(200).json({
            message:'Pets do usuario retornados com suscesso !!!',
            pets
        })

    }

    static async GetUserAdoptionsPets(req,res){
        const token = GetToken(req)
        const user = await GetUserByToken(token)

        const pets = await Pet.find({'adopter._id':user._id}).sort('-createdAt')

        res.status(200).json({
            message:'Pets adotados do usuario retornados com suscesso !!!',
            pets
        })
    }

    static async PetById(req,res){
        const id = req.params.id
        if(!ObjectId.isValid(id)){
            res.status(422).json({message:'Id do pet inválido , por favor verifique o que foi digitado'})
            return
        }
        const pet = await Pet.findById(id)
        if(!pet){
            res.status(404).json({message:'Pet não existe no banco de dados , por favor verifique o que foi digitado'})
            return
        }
        res.status(200).json({
            message:'Pet retornado com sucesso',
            pet
        })
    }

    static async DeletePetById(req,res){
        const id = req.params.id
        if(!ObjectId.isValid(id)){
            res.status(422).json({message:'Id do pet inválido , por favor verifique o que foi digitado'})
            return
        }
        const pet = await Pet.findOne({_id:id})
        if(!pet){
            res.status(404).json({message:'Pet não existe no banco de dados , por favor verifique o que foi digitado'})
            return
        }

        const token = GetToken(req)
        const user = await GetUserByToken(token)

        if(pet.user._id.toString() !== user._id.toString()){  //verificando se a requisição de exclusão vem do usuario que criou o pet
            res.status(422).json({message:'Erro ao processar sua operação , por favor verifique o que foi digitado'})
            return
        }

        await Pet.findByIdAndDelete(id)

        res.status(200).json({
            message:'Pet exluido com sucesso'
        })

    }

    static async UpdatePetById(req,res){
        const id = req.params.id
        const {name , age , weight , color ,description, available} = req.body
        const images = req.files
        const updateData = {}

        console.log(`req.files : ${req.files}`)

        if(!ObjectId.isValid(id)){
            res.status(422).json({message:'Id do pet inválido , por favor verifique o que foi digitado'})
            return
        }

        const pet = await Pet.findOne({_id:id})

        if(!pet){
            res.status(404).json({message:'Pet não existe no banco de dados , por favor verifique o que foi digitado'})
            return
        }

        const token = GetToken(req)
        const user = await GetUserByToken(token)

        if(pet.user._id.toString() !== user._id.toString()){  //verificando se a requisição de edição vem do usuario que criou o pet mesma logica acima 
            res.status(422).json({message:'Erro ao processar sua operação , por favor verifique o que foi digitado'})
            return
        }

        if(!name){
            res.status(422).json({message:'O nome não pode ser nulo , por favor verifique o que foi digitado'})
            return
        }
        updateData.name = name
        if(!age){
            res.status(422).json({message:'A idade não pode ser nula , por favor verifique o que foi digitado'})
            return
        }
        updateData.age = age
        if(!weight){
            res.status(422).json({message:'O peso não pode ser nulo , por favor verifique o que foi digitado'})
            return
        }
        updateData.weight = weight
        if(!color){
            res.status(422).json({message:'A cor nao pode ser nula , por favor verifique o que foi digitado'})
            return
        }
        updateData.color = color
        if(!available){
            res.status(422).json({message:'O satus da adoção nao pode ser nulo , por favor verifique o que foi digitado'})
            return
        }
        updateData.available = available
        updateData.description = description

        console.log(`images :${images}`)
        if(images.length > 0){
            updateData.images = []
            for(let image of images){
                updateData.images.push(image.filename)
            }
        }

        await Pet.findByIdAndUpdate(id,updateData)

        res.status(200).json({
            message:'Pet atualizado com sucesso !!!'
        })
    }

    static async ScheduleVisity(req,res){
        const id = req.params.id
        if(!ObjectId.isValid(id)){
            res.status(422).json({message:'Id do pet inválido , por favor verifique o que foi digitado'})
            return
        }
        const pet = await Pet.findOne({_id:id})
        if(!pet){
            res.status(404).json({message:'Pet não existe no banco de dados , por favor verifique o que foi digitado'})
            return
        }

        const token = GetToken(req)
        const user = await GetUserByToken(token)

        if(pet.user._id.toString() === user._id.toString()){  //verificando se a requisição de adoção vem do usuario que criou o pet
            res.status(422).json({message:'Não podemos agendar uma visita para o seu proprio pet , por favor verifique o que foi digitado'})
            return
        }

        if(pet.adopter){  //verificando se o usuario já não fez essa ação antes

            if(pet.adopter._id.toString() === user._id.toString()){
                res.status(422).json({message:'Você ja agendou uma visita para esse Pet , por favor verifique o que foi digitado'})
                return
            }else{
                res.status(422).json({message:'Esse pet ja tem um adotante , por favor verifique o que foi digitado'})
                return
            }
            
        }

        pet.adopter={
            _id:user._id,
            name : user.name,
            phone :user.phone,
            img : user.img
        }

        await Pet.findByIdAndUpdate(id,pet)

        res.status(200).json({
            message:`A visita foi agendada com sucesso , entre em contato com ${pet.user.name} no telefone ${pet.user.phone} para acertar os detelhes da visita !!!`
        })

    }

    static async ConcludeAdoption(req,res){
        const id = req.params.id
        if(!ObjectId.isValid(id)){
            res.status(422).json({message:'Id do pet inválido , por favor verifique o que foi digitado'})
            return
        }
        const pet = await Pet.findOne({_id:id})
        if(!pet){
            res.status(404).json({message:'Pet não existe no banco de dados , por favor verifique o que foi digitado'})
            return
        }

        const token = GetToken(req)
        const user = await GetUserByToken(token)

        if(pet.user._id.toString() !== user._id.toString()){  //verificando se a requisição de adoção vem do usuario que criou o pet
            res.status(422).json({message:'Erro ao processar sua operação , por favor verifique o que foi digitado'})
            return
        }

        pet.available = false

        await Pet.findByIdAndUpdate(id,pet)

        res.status(200).json({
            message:`O ciclo de adoção foi finalizado com sucesso entre você e ${pet.adopter.name}`
        })

    }

}