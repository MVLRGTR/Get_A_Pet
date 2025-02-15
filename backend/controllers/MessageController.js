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
        const urlImage = 'http://localhost:5000/images/users/msg.png'

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
            NotificationController.CreateTo(`Você tem um nova mensagem do tutor(a) ${userDb.name}`,to,'Nova menssagem',urlImage)
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

        const to = req.params.to

        const page = toNumber(req.params.page)
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

        let toExist = undefined

        try{
            toExist = await User.findById(to).select('_id img')
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

        if(toExist.img === undefined){
            toExist.img = 'default.jpg'
        }

        res.status(200).json({
            message:'Mensagens retornadas com sucesso',
            messagesChat,
            unreadMessage:unread,
            totalPages : totalPages,
            userMessageRequest:userDb._id,
            to:to,
            imgTo: toExist.img,
            currentPage : page
        })
        
    }

    static async activeChatsUser(req, res) {
        const toNumber = (value) => {
            const number = Number(value)
            return isNaN(number) ? value : number
        }
    
        const page = toNumber(req.params.page)
        const limit = 10
    
        if (!page || typeof page !== "number") {
            res.status(422).json({
                message: "Página inválida. Por favor, verifique o que foi digitado.",
            })
            return
        }
    
        try {
            const token = GetToken(req)
            const user = await GetUserByToken(token)
            const userDb = await User.findById(user._id)
    
            if (!userDb) {
                res.status(422).json({ message: "Usuário não encontrado." })
                return
            }
    
            const userId = userDb._id
    
            const activeChats = await Message.aggregate([
                {
                    $match: {
                        $or: [{ from: userId }, { to: userId }],
                    },
                },
                {
                    $sort: { createdAt: -1 },
                },
                {
                    $group: {
                        _id: {
                            from: { $cond: [{ $gt: ["$from", "$to"] }, "$from", "$to"] },
                            to: { $cond: [{ $gt: ["$from", "$to"] }, "$to", "$from"] },
                        },
                        lastMessage: { $first: "$message" },
                        lastMessageAt: { $first: "$createdAt" },
                        lastMessageFrom: { $first: "$from" },
                        lastMessageTo: { $first: "$to" },
                        participants: { $addToSet: "$from" },
                        participantsTo: { $addToSet: "$to" },
                    },
                },
                {
                    $project: {
                        _id: 1,
                        lastMessage: 1,
                        lastMessageAt: 1,
                        lastMessageFrom: 1,
                        lastMessageTo: 1,
                        participants: { $setUnion: ["$participants", "$participantsTo"] },
                    },
                },
                // Lookup para obter informações do destinatário da última mensagem
                {
                    $lookup: {
                        from: "users",
                        localField: "lastMessageTo",
                        foreignField: "_id",
                        as: "toUser",
                    },
                },
                {
                    $unwind: {
                        path: "$toUser",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                // Lookup para obter informações do remetente da última mensagem
                {
                    $lookup: {
                        from: "users",
                        localField: "lastMessageFrom",
                        foreignField: "_id",
                        as: "fromUser",
                    },
                },
                {
                    $unwind: {
                        path: "$fromUser",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $sort: { lastMessageAt: -1 },
                },
                {
                    $facet: {
                        metadata: [{ $count: "totalMessages" }],
                        messages: [{ $skip: (page - 1) * limit }, { $limit: limit }],
                    },
                },
            ])
    
            // console.log(`activeChats: ${JSON.stringify(activeChats)}`)
    
            const totalChats =
                activeChats[0].metadata.length > 0
                    ? activeChats[0].metadata[0].totalMessages
                    : 0
            const totalPages = Math.ceil(totalChats / limit)
    
            const chats = activeChats[0].messages.map((chat) => ({
                ...chat,
                toUser: chat.toUser
                    ? { _id: chat.toUser._id, name: chat.toUser.name, img: chat.toUser.img }
                    : null,
                fromUser: chat.fromUser
                    ? { _id: chat.fromUser._id, name: chat.fromUser.name, img: chat.fromUser.img }
                    : null,
            }))
    
            res.status(chats.length > 0 ? 200 : 404).json({
                message:
                    chats.length > 0
                        ? "Chats retornados com sucesso!"
                        : "Não existem chats para o usuário informado no banco de dados.",
                totalChats,
                totalPages,
                chats,
                requestingUser: userId,
            })
        } catch (error) {
            console.error("Erro ao buscar chats:", error)
            res.status(500).json({ message: "Erro interno do servidor" })
        }
    }
}