const User = require('../models/User')
const bcrypt = require('bcrypt')
const z = require('zod')

//helpers
const LoginAuth = require('../helpers/LoginAuth')
const CreateUserToken = require('../helpers/CreatedUserToken')
const GetToken = require('../helpers/GetToken')
const GetUserByToken = require('../helpers/GetUserByToken')
const EmailSend = require('../service/email/EmailSend')
const ObjectId = require('mongoose').Types.ObjectId

//others
const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken')

module.exports = class UserController {

    static async Register(req, res) {

        function GenerateRandomFourDigitNumber() {
            return Math.floor(1000 + Math.random() * 9000);
        }

        const toNumber = (value) => {
            const number = Number(value)
            return isNaN(number) ? value : number
        }

        const deleteImg = (filename) =>{
            if(filename !== 'default.jpg'){
                const imagePath = path.join(__dirname, '..', 'public', 'images', 'users', filename);
                fs.unlink(imagePath, (err) => {
                    if (err) {
                        console.error('Erro ao excluir a imagem:', err);
                    }
                })
            }
        }

        let image = req.file

        if (!image) {
            image = 'default.jpg'
        } else {
            image = image.filename
        }

        const userParse = {
            name: req.body.name,
            email: req.body.email,
            phone: toNumber(req.body.phone),
            img: image,
            password: req.body.password,
            confirmpassword: req.body.confirmpassword,
        }

        const userSchema = z.object({
            name: z.string().min(3, { message: 'O nome precisa ter pelo menos 3 caracteres, por favor verifique o que foi digitado' }).max(25, { message: 'O nome pode ter no máximo 25 caracteres ,por favor verifique o que foi digitado' }),
            email: z.string().email({ message: 'Endereço de email inválido' }),
            phone: z.number({ message: 'Número com formato digitado inválido' }).min(11, { message: 'Número de telefone digitado inválido, certifique de colocar o ddd da sua localidade' }),
            img: z.string(),
            password: z.string().min(6, { message: 'Senha muito curta ,mínimo 6 characteres , por favor faça outra' }).max(28, { message: 'Senha muito grande , por favor faça outra' }),
        })

        try {
            userSchema.parse(userParse)
        } catch (error) {
            let returnErros = []
            if (error instanceof z.ZodError) {
                error.errors.map((index) => {
                    returnErros.push(index.message)
                    console.log(`erro : ${JSON.stringify(index.message)}`)
                })
                deleteImg(image)
                res.status(422).json({ message: 'Erros na requisição :', returnErros })
                return
            }
        }

        if (userParse.password !== userParse.confirmpassword) {
            deleteImg(image)
            res.status(422).json({ message: 'A senha e a sua confirmação não são iguais , por favor verifique o que foi digitado' })
            return
        }

        const UserExists = await User.findOne({ email: userParse.email })

        if (UserExists) {
            deleteImg(image)
            res.status(422).json({ message: 'E-mail já cadastrado , por favor utilize outro !!!' })
            return
        }

        const primaryLogin = false

        const salt = await bcrypt.genSalt(12)
        const PasswordHash = await bcrypt.hash(userParse.password, salt)
        const token = GenerateRandomFourDigitNumber()

        const user = new User({
            name: userParse.name,
            email: userParse.email,
            phone: userParse.phone,
            img: userParse.img,
            password: PasswordHash,
            primaryLogin,
            token
        })

        EmailSend.EmailPrimaryLogin(user.email, token)

        try {
            await user.save()
            res.status(200).json({ message: 'Usuário criado com sucesso' })
        } catch (erro) {
            deleteImg(image)
            console.log(erro)
            res.status(500).json({ message: erro })
        }
    }

    static async Login(req, res) {

        const { email, password } = req.body

        const ValidationLogin = await LoginAuth.LoginAuthentication(email, password)

        if (!ValidationLogin.validation) {
            res.status(422).json({ message: 'Usuário ou senha Incorreto , por favor verifique o que foi digitado !' })
            return
        }

        if (ValidationLogin.Userdb.primaryLogin === false) {
            res.status(422).json({ message: 'Por favor entre no seu e-mail e coloque o token infromado para validar a sua conta !' })
            return
        }

        await CreateUserToken(ValidationLogin.Userdb, req, res)
    }

    static async PrimaryLogin(req, res) {
        const { email, password, token } = req.body

        if (!email) {
            res.status(422).json({ message: 'O email não pode ser nulo , por favor verifique o que foi digitado' })
            return
        }
        if (!password) {
            res.status(422).json({ message: 'A senha não pode ser nula , por favor verifique o que foi digitado' })
            return
        }

        const ValidationLogin = await LoginAuth.LoginAuthentication(email, password)

        if (!ValidationLogin.validation) {
            res.status(422).json({ message: 'Usuário ou senha Incorreto , por favor verifique o que foi digitado !' })
            return
        }

        const NewPrimaryLogin = true

        console.log(`Valor token do Userdb : ${ValidationLogin.Userdb.token} Valor do token:${token}`)

        if (ValidationLogin.Userdb.primaryLogin === false) {
            if (ValidationLogin.Userdb.token === Number(token)) {
                try {
                    await User.findOneAndUpdate(
                        { _id: ValidationLogin.Userdb._id },
                        { $set: { primaryLogin: NewPrimaryLogin } }
                    )
                    await CreateUserToken(ValidationLogin.Userdb, req, res)
                } catch (erro) {
                    res.status(500).json({ message: erro })
                    console.log(`Erro de scopo :${erro}`)
                    return
                }

            } else {
                res.status(422).json({ message: 'Token com valor incorreto , por favor verifique o mesmo' })
                return
            }
        } else {
            res.status(422).json({ message: 'Sua conta já foi checada , por favor se redirecione para o login' })
            return
        }
    }

    static async ForgotPassword(req, res) {

        function GenerateRandomFourDigitNumber() {
            return Math.floor(1000 + Math.random() * 9000);
        }

        const email = req.body.email
        const Newtoken = GenerateRandomFourDigitNumber()

        const UserExists = await User.findOne({ email: email })

        if (!UserExists) {
            res.status(422).json({ message: 'E-mail não existe na nossa base de dados , por favor utilize outro !!!' })
            return
        }

        await User.findOneAndUpdate(
            { _id: UserExists._id },
            { $set: { token: Newtoken } }
        )

        EmailSend.EmailForgotPassword(UserExists.email, Newtoken)

        res.status(200).json({ message: 'Token enviado com sucesso para o e-mail cadastrado !!!' })

    }

    static async ForgotPasswordLogin(req, res) {
        const { email, password, confirmpassword, token } = req.body

        console.log(`email : ${email} , password = ${password} confirmpassword = ${confirmpassword} token = ${token}`)

        function GenerateRandomFourDigitNumber() {
            return Math.floor(1000 + Math.random() * 9000);
        }

        if (!email) {
            res.status(422).json({ message: 'O email não pode ser nulo , por favor verifique o que foi digitado' })
            return
        }
        if (password.length < 6) {
            console.log('entrou aqui')
            res.status(422).json({ message: 'A senha não pode ter menos de 6 characters , por favor verifique o que foi digitado' })
            return
        }
        if (password !== confirmpassword) {
            res.status(422).json({ message: 'A senha e a sua confirmação são diferentes , por favor verifique o que foi digitado' })
            return
        }

        let userDb
        userDb = await User.findOne({ email: email })
        if (userDb === undefined || userDb === null || !userDb) {
            res.status(422).json({ message: 'Usuario não encontrado , por favor verifique o que foi digitado' })
            return
        }

        if (userDb.token === Number(token)) {
            try {
                const salt = await bcrypt.genSalt(12)
                const PasswordHash = await bcrypt.hash(password, salt)
                const newToken = GenerateRandomFourDigitNumber()
                await User.findOneAndUpdate(
                    { _id: userDb._id },
                    { $set: { password: PasswordHash, token: newToken } }
                )
                await CreateUserToken(userDb, req, res)
            } catch (erro) {
                res.status(500).json({ message: erro })
                console.log(`Erro de scopo :${erro}`)
                return
            }

        } else {
            res.status(422).json({ message: 'Token com valor incorreto , por favor verifique o mesmo' })
            return
        }
    }

    static async CheckUser(req, res) {
        let CurrentUser

        console.log(`entrou em checkuser com Autorization : ${req.headers.authorization}`)

        if (req.headers.authorization) {
            const Token = GetToken(req)
            const Decoded = jwt.verify(Token, 'meutokenjwt')
            console.log(Decoded)
            CurrentUser = await User.findById(Decoded.id)
            CurrentUser.password = undefined

        } else {
            CurrentUser = null
        }

        res.status(200).send(CurrentUser)

    }

    static async GetUserById(req, res) {
        const id = req.params.id
        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'Id do usuario inválido , por favor verifique o que foi digitado ' })
            return
        }
        const user = await User.findById(id).select('-password') //elimando o campo do password 
        if (!user) {
            res.status(422).json({ message: 'Usuário não encontrado , por favor verifique o que foi digitado' })
            return
        }

        res.status(200).json({ user })
    }

    static async EditUser(req, res) {

        const toNumber = (value) => {
            const number = Number(value)
            return isNaN(number) ? value : number
        }

        const deleteImg = (filename) =>{
            if(filename !== 'default.jpg'){
                const imagePath = path.join(__dirname, '..', 'public', 'images', 'users', filename);
                fs.unlink(imagePath, (err) => {
                    if (err) {
                        console.error('Erro ao excluir a imagem:', err);
                    }
                })
            }
        }

        const toBoolean = (value) => {
            if (typeof value === 'boolean') {
                return value
            }
            if (typeof value === 'string') {
                const lowerValue = value.toLowerCase();
                if (lowerValue === 'true') {
                    return true
                } else if (lowerValue === 'false') {
                    return false
                }
            }
            return value
        }

        let image = req.file
        console.log(`image : ${JSON.stringify(image)}`)
        if (!image) {
            image = 'default.jpg'
            console.log('entrou aqui')
        } else {
            image = image.filename
        }

        const userParse = {
            name: req.body.name,
            email: req.body.email,
            phone: toNumber(req.body.phone),
            img: image,
            password: req.body.password,
            confirmpassword: req.body.confirmpassword,
            receiveremail: toBoolean(req.body.receiveremail)
        }

        const userSchema = z.object({
            name: z.string().min(3, { message: 'O nome precisa ter pelo menos 3 caracteres, por favor verifique o que foi digitado' }).max(25, { message: 'O nome pode ter no máximo 25 caracteres ,por favor verifique o que foi digitado' }),
            email: z.string().email({ message: 'Endereço de email inválido' }),
            phone: z.number({ message: 'Número com formato digitado inválido' }).min(11, { message: 'Número de telefone digitado inválido, certifique de colocar o ddd da sua localidade' }),
            img: z.string(),
            password: z.string().min(6, { message: 'Senha muito curta ,mínimo 6 characteres , por favor faça outra' }).max(28, { message: 'Senha muito grande , por favor faça outra' }),
            receiveremail: z.boolean({ message: 'Tipo de dado incorreto para o recebimento de e-mail , somente permitido true ou false' })
        })

        try {
            userSchema.parse(userParse)
        } catch (error) {
            let returnErros = []
            if (error instanceof z.ZodError) {
                error.errors.map((index) => {
                    returnErros.push(index.message)
                    console.log(`erro : ${JSON.stringify(index.message)}`)
                })
                res.status(422).json({ message: 'Erros na requisição :', returnErros })
                deleteImg(image)
                return
            }
        }

        let token, user, userDb
        try {
            token = GetToken(req)
            user = await GetUserByToken(token)
            userDb = await User.findById(user._id)
        } catch (Erro) {
            deleteImg(image)
            res.status(422).json({ message: 'Usuario não encontrado , por favor verifique o que foi digitado' })
            return
        }

        const UserExistsByEmail = await User.findOne({ email: userParse.email }).select('email')
        if (userDb.email !== userParse.email && UserExistsByEmail) {
            deleteImg(image)
            res.status(422).json({ message: 'E-mail inválido , por favor verifique o que foi digitado' })
            return
        }

        if (req.file) {
            // if (userDb.img !== 'default.jpg' && userDb.img) {
            //     const imagePath = path.join(__dirname, '..', 'public', 'images', 'users', userDb.img);
            //     fs.unlink(imagePath, (err) => {
            //         if (err) {
            //             console.error('Erro ao excluir a imagem:', err);
            //         }
            //     })
            // }
            if(userDb.img !== 'default.jpg' && userDb.img){
                deleteImg(userDb.img)
            }
            userDb.img = req.file.filename
        } else {
            // if (userDb.img !== 'default.jpg' && userDb.img) {
            //     const imagePath = path.join(__dirname, '..', 'public', 'images', 'users', userDb.img);
            //     fs.unlink(imagePath, (err) => {
            //         if (err) {
            //             console.error('Erro ao excluir a imagem:', err);
            //         }
            //     })
            // }
            if(userDb.img !== 'default.jpg' && userDb.img){
                deleteImg(userDb.img)
            }
            userDb.img = userParse.img
        }

        userDb.name = userParse.name
        userDb.email = userParse.email
        userDb.phone = userParse.phone
        userDb.receiveremail = userParse.receiveremail


        if (userParse.password != userParse.confirmpassword) {
            deleteImg(image)
            res.status(422).json({ message: 'As senhas não conferem , por favor verifique o que foi digitado' })
            return
        } else if (userParse.password === userParse.confirmpassword && userParse.password != null) {
            const salt = await bcrypt.genSalt(12)
            const PasswordHash = await bcrypt.hash(userParse.password, salt)
            userDb.password = PasswordHash
        }

        console.log(`userDb antes de atualizar : ${userDb.img}`)

        try {
            await User.findOneAndUpdate(
                { _id: userDb.id },
                { $set: userDb },
                // {new:true}
            )
            res.status(200).json({ message: 'Usuario atualizado com sucesso !!!' })
        } catch (erro) {
            deleteImg(image)
            res.status(500).json({ message: erro })
            return
        }

    }

    static async EditUserAddress(req, res) {

        const toNumber = (value) => {
            const number = Number(value)
            return isNaN(number) ? value : number
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

        const adrressParse = {
            cep: req.body.cep,
            street: req.body.street,
            number: toNumber(req.body.number),
            complement: req.body.complement
        }

        const addressSchema = z.object({
            cep: z.string().length(8, { message: 'O CEP deve conter exatamente 8 dígitos' }).regex(/^\d+$/, { message: 'O CEP deve conter apenas números' }),
            street: z.string().min(6, { message: 'Rua muito pequena, por favor verifique o que foi digitado' }).max(100, { message: 'Rua muita grande , por favor verifique o que foi digitado' }),
            number: z.number({ message: 'Digite um número valido por favor' }).max(100000000000, { message: 'Número muito grande' }),
            complement: z.string().max(800, { message: 'Complemento muito grande ' })
        })

        try {
            addressSchema.parse(adrressParse)
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

        userDb.address = adrressParse
        await User.findByIdAndUpdate(userDb._id, userDb)

        res.status(200).json({
            message: 'Endereço atualizado com sucesso !!!'
        })

    }

    static async ReceiverEmail(req, res) {
        const receiveremail = req.body.receiveremail

        let token, user, userDb
        try {
            token = GetToken(req)
            user = await GetUserByToken(token)
            userDb = await User.findById(user._id)
        } catch (Erro) {
            res.status(422).json({ message: 'Usuario não encontrado , por favor verifique o que foi digitado' })
            return
        }


        if (receiveremail === true || receiveremail === false) {
            userDb.receiveremail = receiveremail
            await User.findByIdAndUpdate(userDb._id, userDb)
            res.status(200).json({ message: 'Notificações por e-mail foram atualizadas com sucesso !!!' })
        } else {
            res.status(422).json({ message: 'Erro ao processar sua operação , por favor verifique o que foi digitado !' })
        }
    }

    static async SearchUser(req, res) {

        const toNumber = (value) => {
            const number = Number(value)
            return isNaN(number) ? value : number
        }

        const searchUser = req.params.search
        const page = toNumber(req.params.page)
        const limit = 15

        if (!page || typeof page != 'number') {
            res.status(422).json({ message: 'Pagina de envio Inválida  , por favor verifique o que foi digitado' })
            return
        }
        if (!searchUser) {
            res.status(422).json({ message: 'O campo de busca não pode ser nulo , por favor verifique o que foi digitado' })
            return
        }

        const totalUsers = await User.countDocuments({
            name: { $regex: `.*${searchUser}.*`, $options: 'i' }
        })
        const totalPages = Math.ceil(totalUsers / limit)

        const users = await User.find({
            name: { $regex: `.*${searchUser}.*`, $options: 'i' }
        }).select('_id name email phone ')

        if (users.length === 0) {
            res.status(404).json({ message: 'Nenhum usuario encontrado !!!' })
            return
        }

        res.status(200).json({
            message: 'Usuarios retornados com sucesso',
            users, totalUsers, totalPages
        })
    }

}