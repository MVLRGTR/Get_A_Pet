const User = require('../models/User')
const bcrypt = require('bcrypt')

//helpers
const CreateUserToken = require('../helpers/CreatedUserToken')
const GetToken = require('../helpers/GetToken')
const GetUserByToken = require('../helpers/GetUserByToken')

const jwt = require('jsonwebtoken')

module.exports = class UserController{
    static async Register(req,res){

        const {name,email,phone,password,confirmpassword} = req.body

        if(!name){
            res.status(422).json({message:'O nome não pode ser nulo , por favor verifique o que foi digitado'})
            return
        }
        if(!email){
            res.status(422).json({message:'O email não pode ser nulo , por favor verifique o que foi digitado'})
            return
        }
        if(!phone){
            res.status(422).json({message:'O telefone não pode ser nulo , por favor verifique o que foi digitado'})
            return
        }
        if(!password){
            res.status(422).json({message:'A senha não pode ser nula , por favor verifique o que foi digitado'})
            return
        }
        if(!confirmpassword){
            res.status(422).json({message:'A confirmação de senha não pode ser nula , por favor verifique o que foi digitado'})
            return
        }
        if(password!==confirmpassword){
            res.status(422).json({message:'A senha e a sua confirmação não são iguais , por favor verifique o que foi digitado'})
        }

        const UserExists = await User.findOne({email:email})

        if(UserExists){
            res.status(422).json({message:'E-mail já cadastrado , por favor utilize outro !!!'})
            return
        }

        const salt = await bcrypt.genSalt(12)
        const PasswordHash = await bcrypt.hash(password,salt)

        const user = new User({
            name,
            email,
            phone,
            password:PasswordHash
        })

        try{
            const NewUser = await user.save()
            await CreateUserToken(NewUser,req,res)
        }catch(erro){
            console.log(erro)
            res.status(500).json({message:erro})
        }
    }

    static async Login(req,res){

        const {email,password} = req.body

        if(!email){
            res.status(422).json({message:'O email não pode ser nulo , por favor verifique o que foi digitado'})
            return
        }
        if(!password){
            res.status(422).json({message:'A senha não pode ser nula , por favor verifique o que foi digitado'})
            return
        }
        const UserExists = await User.findOne({email:email})

        if(!UserExists){
            res.status(422).json({message:'Não existe nenhum usuário com esse e-mail , por favor verifique o que foi digitado'})
            return
        }

        const CheckPassword = await bcrypt.compare(password,UserExists.password)

        if(!CheckPassword){
            res.status(422).json({
                message:"Senha Inválida !!!"
            })
            return
        }

        await CreateUserToken(UserExists,req,res)
    }

    static async CheckUser(req,res){
        let CurrentUser 

        console.log(req.headers.authorization)

        if(req.headers.authorization){
            const Token = GetToken(req)
            const Decoded =jwt.verify(Token,'meutokenjwt')
            console.log(Decoded)
            CurrentUser = await User.findById(Decoded.id)
            CurrentUser.password = undefined

        }else{
            CurrentUser = null
        }

        res.status(200).send(CurrentUser)

    }

    static async GetUserById(req,res){
        const id = req.params.id
        const user = await User.findById(id).select('-password') //elimando o campo do password 
        console.log(user)
        if(!user){
            console.log('entrou aqui')
            res.status(422).json({message:'Usuário não encontrado , por favor verifique o que foi digitado'})
            return
        }

        res.status(200).json({user})
    }

    static async EditUser(req,res){
        const id = req.params.id

        const token = GetToken(req)
        const user = await GetUserByToken(token)

        const {name,email,phone,password,confirmpassword} = req.body


        if(req.file){
            console.log(`entrou aqui , valor req.file.filename :${req.file.filename} valor req.file : ${req.file}`)
            user.img = req.file.filename
        }

        console.log(`valor user.image :${user.image} user:${user}`)

        if(!name){
            res.status(422).json({message:'O nome não pode ser nulo , por favor verifique o que foi digitado'})
            return
        }

        user.name = name

        if(!email){
            res.status(422).json({message:'O email não pode ser nulo , por favor verifique o que foi digitado'})
            return
        }
        const UserExistsByEmail = await User.findOne({email:email})
        if(user.email !== email && UserExistsByEmail){
            res.status(422).json({message:'E-mail inválido, já cadastro para outro usuario , por favor verifique o que foi digitado'})
            return
        }

        user.email = email

        if(!phone){
            res.status(422).json({message:'O telefone não pode ser nulo , por favor verifique o que foi digitado'})
            return
        }

        user.phone = phone

        console.log(`user :${user}`)

        if(password != confirmpassword){
            res.status(422).json({message:'As senhas não conferem , por favor verifique o que foi digitado'})
            return
        }else if(password == confirmpassword && password != null){
            const salt = await bcrypt.genSalt(12)
            const PasswordHash = await bcrypt.hash(password,salt)
            user.password = PasswordHash
        }

        try{
            await User.findOneAndUpdate(
                {_id:user.id},
                {$set:user},
                {new:true}
            )
            res.status(200).json({message:'Usuario atualizado com sucesso !!!'})
        }catch(erro){
            res.status(500).json({message:erro})
            return
        }

        
    }

}