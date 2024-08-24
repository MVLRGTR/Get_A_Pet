const Message = require('../models/Message')
const User = require('../models/User')

//helpers
const GetToken = require('../helpers/GetToken')
const GetUserByToken = require('../helpers/GetUserByToken')
const ObjectId = require('mongoose').Types.ObjectId

module.exports = class MessageController {

    static async SendMessage(req, res) {
        const { message, to } = req.body
        if (!message) {
            res.status(422).json({ message: 'A messagem não pode ser nula , por favor verifique o que foi digitado' })
            return
        }
        if (!to) {
            res.status(422).json({ message: 'A messagem precisar ter destino, por favor verifique o que foi digitado' })
            return
        }
        const toExist = await User.findById({ _id: to }).select('_id name img phone')
        if (!toExist) {
            res.status(404).json({ message: 'Usuário de origem não encontrado' })
            return
        }

        const token = GetToken(req)
        const user = await GetUserByToken(token)

        if (user._id.toString() === to.toString()) {
            res.status(422).json({ message: 'A messagem precisar ter origem e destino diferente, por favor verifique o que foi digitado' })
            return
        }

        const NewMessage = new Message({
            message,
            viewed: false,
            to: new ObjectId(to),
            from: user._id
        })

        try {
            const NewMessageSend = await NewMessage.save()
            res.status(201).json({
                message: 'Messagem enviada com sucesso',
                NewMessageSend
            })
        } catch (erro) {
            res.status(500).json({ message: error })
        }
    }

    static async ViewedMsg(req, res) {
        const id = req.body.id

        if (!id) {
            res.status(422).json({ message: 'A requisição precisa ter o id da mensagem, por favor verifique o que foi digitado' })
            return
        }

        try {
            const toMsgExist = await Message.findById({ _id: id }).select('_id to from')

            if (!toMsgExist) {
                res.status(422).json({ message: 'Mensagem não encontrada na nossa base, por favor verifique o que foi digitado' })
                return
            }

            const token = GetToken(req)
            const user = await GetUserByToken(token)

            //verificação se o usuario que está enviando a requisição de vizualização é o mesmo que recebeu a mensagem

            if (user._id.toString() != toMsgExist.to.toString()) {
                res.status(422).json({ message: 'Erro ao processar sua operação, por favor verifique o que foi digitado' })
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
        const to = req.body.to

        const token = GetToken(req)
        const user = await GetUserByToken(token)

        if (!to) {
            res.status(422).json({ message: 'A requisição precisa ter o campo de quem recebeu a mensagem, por favor verifique o que foi digitado' })
            return
        }

        try{
            const toExist = await User.findById(to).select('_id')
            if (!toExist) {
                res.status(422).json({ message: 'Erro ao processar sua operação, por favor verifique o que foi digitado' })
                return
            }
        }catch(erro){
                res.status(500).json({ message: 'Erro ao processar sua operação, por favor verifique o que foi digitado',erro:erro })
                return
        }

        const messagesChat = await Message.find({
            $or: [
                { to: new ObjectId(to), from: user._id },
                { to: user._id, from: new ObjectId(to) }
            ]
        }).sort({ createdAt: 1 })

        res.status(200).json({
            message:'Mensagens retornadas com sucesso',
            messagesChat,
            userMessageRequest:user._id
        })
        
    }
}