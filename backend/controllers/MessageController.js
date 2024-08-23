const Message = require('../models/Message')

//helpers
const GetToken = require('../helpers/GetToken')
const GetUserByToken = require('../helpers/GetUserByToken')
const ObjectId = require('mongoose').Types.ObjectId

module.exports = class MessageController{

    static async SendMessage(req,res){
        const {message,from}= req.body
        if(!message){
            res.status(422).json({message:'A messagem não pode ser nula , por favor verifique o que foi digitado'})
            return
        }
        if(!from){
            res.status(422).json({message:'A messagem precisar ter origem, por favor verifique o que foi digitado'})
            return
        }

        const token = GetToken(req)
        const user = await GetUserByToken(token)

        if(user._id === from._id){
            res.status(422).json({message:'A messagem precisar ter origem e destino diferente, por favor verifique o que foi digitado'})
            return
        }

        const NewMessage = new Message({
            message,
            viewed:false,
            to:user,
            from:{
                _id:new ObjectId(from._id),
                name:from.name
            }
        })

        try{
            const NewMessageSend = await NewMessage.save()
            res.status(201).json({
                message:'Messagem enviada com sucesso',
                NewMessageSend
            })
        }catch(erro){
            res.status(500).json({message:error})
        }


    }

}