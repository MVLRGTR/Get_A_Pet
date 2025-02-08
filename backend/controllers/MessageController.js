const Message = require('../models/Message')
const User = require('../models/User')
const NotificationController = require('../controllers/NotificationsController')

//helpers
const GetToken = require('../helpers/GetToken')
const GetUserByToken = require('../helpers/GetUserByToken')
const ObjectId = require('mongoose').Types.ObjectId
const socketController = require('../helpers/Socket')

module.exports = class MessageController {

    static async SendMessage(req, res) {
        const { message, to } = req.body

        function isString(value){
            return typeof value === 'string';
        }

        if (!message || !isString(message)) {
            res.status(422).json({ message: 'A messagem não pode ser nula, ou enviado com formato inválido , por favor verifique o que foi digitado' })
            return
        }
        if (!ObjectId.isValid(to)) {
            res.status(422).json({ message: 'A messagem precisar ter destino valido, por favor verifique o id do usuario que foi digitado' })
            return
        }
        const toExist = await User.findById({ _id: to }).select('_id name img phone')
        if (!toExist) {
            res.status(404).json({ message: 'Usuário  não encontrado para receber a mensagem' })
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

        if (userDb._id.toString() === to.toString()) {
            console.log(`userDb._id = ${userDb._id} to : ${to}`)
            res.status(422).json({ message: 'A messagem precisar ter origem e destino diferente, por favor verifique o que foi digitado' })
            return
        }

        const NewMessage = new Message({
            message,
            viewed: false,
            to: new ObjectId(to),
            from: userDb._id
        })

        try {
            const NewMessageSend = await NewMessage.save()
            res.status(201).json({
                message: 'Messagem enviada com sucesso',
                NewMessageSend
            })
            NotificationController.CreateTo(`Você tem um nova mensagem do tutor(a) ${userDb.name}`,to,'Nova menssagem')
            console.log(`NewMessageSend : ${NewMessageSend} e newMessage : ${NewMessage}`)
            socketController.sendNewMessageChat(NewMessageSend)
        } catch (error) {
            res.status(500).json({ message: error })
        }
    }

    static async ViewedMsg(req, res) {
        const id = req.body.id

        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'A requisição precisa ter o id da mensagem valido, por favor verifique o que foi digitado' })
            return
        }

        try {
            const toMsgExist = await Message.findById({ _id: id }).select('_id to from viewed')

            if (!toMsgExist) {
                res.status(422).json({ message: 'Mensagem não encontrada na nossa base, por favor verifique o que foi digitado' })
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

            //verificação se o usuario que está enviando a requisição de vizualização é o mesmo que recebeu a mensagem
            console.log(`userDb._id : ${userDb._id} toMsgExist.to : ${toMsgExist.to}`)
            if (userDb._id.toString() != toMsgExist.to.toString()) {
                res.status(422).json({ message: 'Erro ao processar sua operação,você não vizualizar uma menssagen que não foi enviada para você , por favor verifique o que foi digitado' })
                return
            }

            if(toMsgExist.viewed){
                res.status(422).json({ message: 'Erro ao processar sua operação , messagem já vizualizada, por favor verifique o que foi digitado' })
                return
            }

            try {
                await Message.findOneAndUpdate(
                    { _id: id },
                    { viewed: true },
                )
                res.status(200).json({ message: 'Status da mensagem atualizado com sucesso !!!' })
            } catch (erro) {
                res.status(500).json({ message: erro })
                return
            }
        } catch (erro) {
            res.status(422).json({ message: 'Mensagem não encontrada na nossa base, por favor verifique o que foi digitado' })
            return
        }

    }

    static async GetAllMessageChat(req,res){

        const toNumber = (value) => {
            const number = Number(value)
            return isNaN(number) ? value : number
        }

        const to = req.body.to

        const page = toNumber(req.body.page)
        const limit = 200

        if (!page || typeof page != 'number') {
            res.status(422).json({ message: 'Paginação das mensagens de envio Inválida  , por favor verifique o que foi digitado' })
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

        if (!ObjectId.isValid(to)) {
            res.status(422).json({ message: 'A requisição precisa ter o campo de quem recebeu a mensagem valido, por favor verifique o que foi digitado' })
            return
        }

        try{
            const toExist = await User.findById(to).select('_id')
            if (!toExist) {
                res.status(422).json({ message: 'Erro ao processar sua operação,usuario de destino inexistente, por favor verifique o que foi digitado' })
                return
            }
        }catch(erro){
                res.status(500).json({ message: 'Erro ao processar sua operação, por favor verifique o que foi digitado',erro:erro })
                return
        }

        const unread = await Message.countDocuments({
            viewed :false,
            to:new ObjectId(to),
            from :  userDb._id
        })

        const totalMesages = await Message.countDocuments({
            to: new ObjectId(to),
            from : userDb._id
        })

        const messagesChat = await Message.find({
            $or: [
                { to: new ObjectId(to), from: userDb._id },
                { to: userDb._id, from: new ObjectId(to) }
            ]
        }).sort({ createdAt: 1 }).skip((page - 1) * limit).limit(limit)

        const totalPages = Math.ceil(totalMesages/limit)

        res.status(200).json({
            message:'Mensagens retornadas com sucesso',
            messagesChat,
            unreadMessage:unread,
            totalPages : totalPages,
            userMessageRequest:userDb._id
        })
        
    }
}