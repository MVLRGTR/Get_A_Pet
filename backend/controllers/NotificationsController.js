const Notifications = require('../models/Notifications')

//helpers
const GetToken = require('../helpers/GetToken')
const GetUserByToken = require('../helpers/GetUserByToken')
const ObjectId = require('mongoose').Types.ObjectId

module.exports = class NotificationsController{

    //o tratamento da regra para notificações do sistema é diferente para as notificações de açoes do usuario no sistema
    //sendo a terminação all indicada para notificações globais para todos os usuarios e to para usuarios direcionados

    static async CreateAll(text,type,image,link){
        try{
            const notification = new Notifications({message:text,type:type})
            if(link){
                notification.link = link
            }
            if(image){
                notification.image = image
            }
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

        const notifications = await Notifications.find({
            to:'all',
            // userviewed:{$nin:[user._id]}
        }).sort('-createdAt').select('_id message to createdAt updatedAt') 

        if (!notifications) {
            res.status(404).json({ message: 'Notificação não existe no banco de dados , por favor verifique o que foi digitado' })
            return
        }

        res.status(200).json({message:'Notificações retornadas com sucesso',notifications})
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

    static async CreateTo(text,to,type,image,link){
        try{
            const notification = new Notifications({
                message:text,
                to:to,
                userviewed:[to],
                type:type
            })
            if(link){
                notification.link = link
            }
            if(image){
                notification.image = image
            }
            Notifications.create(notification)
        }catch(erro){
            console.log(erro)
        }
    }

    static async GetToNotificationsUser(req,res){
        const token = GetToken(req)
        const user = await GetUserByToken(token)
        
        if (!user) {
            res.status(422).json({ message: 'Nenhum usuario encontrado , por favor verifique o que foi digitado' })
            return
        }

        const notifications = await Notifications.find({
            to:'to',
            userviewed:user._id
        }).sort('-createdAt').select('_id message to createdAt updatedAt') 

        if (!notifications) {
            res.status(404).json({ message: 'Notificação não existe no banco de dados , por favor verifique o que foi digitado' })
            return
        }

        res.status(200).json({message:'Notificações retornadas com sucesso',notifications})
    }

    static async ViewedTo(req,res){
        const idnotification = req.params.id
        const token = GetToken(req)
        const user = await GetUserByToken(token)

        if(!ObjectId.isValid(idnotification)){
            res.status(422).json({ message: 'O id da notificação  invalido , por favor verifique o que foi digitado' })
            return
        }

        const notificationUser = await Notifications.findOne({
            _id:idnotification,
            to:'to'
        }).sort('-createdAt') 

        if (!notificationUser) {
            res.status(404).json({ message: 'Notificação não existe no banco de dados , por favor verifique o que foi digitado' })
            return
        }
        if(notificationUser.userviewed[0].toString() != user._id.toString()){
            res.status(422).json({ message: 'Erro ao processar sua operação , por favor verifique o que foi digitado' })
            return
        }
        if(notificationUser.viewed === true){
            res.status(422).json({ message: 'Essa solicitação já foi feita anteriormente , por favor verifique o que foi digitado' })
            return
        }

        notificationUser.viewed =true
        notificationUser.save()

        res.status(200).json({message:'Notificação visualizada com sucesso !!!'})
        return
    }
}