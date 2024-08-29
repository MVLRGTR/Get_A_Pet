const Notifications = require('../models/Notifications')

//helpers
const GetToken = require('../helpers/GetToken')
const GetUserByToken = require('../helpers/GetUserByToken')
const ObjectId = require('mongoose').Types.ObjectId

module.exports = class NotificationsController{

    static async CreateAll(text){
        try{
            const notification = new Notifications({message:text})
            Notifications.create(notification)
        }catch(erro){
            console.log(`erro apresentado : ${erro}`)
        }
    }

    static async GetAllNotificationsUser(req,res){
        const token = GetToken(req)
        const user = await GetUserByToken(token)
        
        if (!user) {
            res.status(422).json({ message: 'Nenhum usuario encontrado , por favor verifique o que foi digitado' })
            return
        }

        const notification = await Notifications.find({
            to:'all',
            userviewed:{$nin:[user._id]}
        }).sort('-createdAt') 

        res.status(200).json({message:'Notificações retornadas com sucesso',notification})
    }

    static async ViewedAll(req,res){
        const idnotification = req.params.id
        const token = GetToken(req)
        const user = await GetUserByToken(token)

        if(!ObjectId.isValid(idnotification)){
            res.status(422).json({ message: 'O id da notificação  invalido , por favor verifique o que foi digitado' })
            return
        }

        const notificationUser = await Notifications.findOne({
            _id:idnotification,
            to:'all'
        }).sort('-createdAt') 

        if (!notificationUser) {
            res.status(404).json({ message: 'Notificação não existe no banco de dados , por favor verifique o que foi digitado' })
            return
        }

        if (!notificationUser.userviewed.includes(user._id)) {
            notificationUser.userviewed.push(user._id)
            await notificationUser.save()
            res.status(200).json({message:'Notificação visualizada com sucesso !!!'})
            return
        }else{
            res.status(422).json({ message: 'Solicitação de vizualização já feita anteriormente , por favor verifique o que foi digitado' })
            return
        }

        

    }
}