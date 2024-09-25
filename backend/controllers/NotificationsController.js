const Notifications = require('../models/Notifications')
const User = require('../models/User')

//helpers
const GetToken = require('../helpers/GetToken')
const GetUserByToken = require('../helpers/GetUserByToken')
const ObjectId = require('mongoose').Types.ObjectId

module.exports = class NotificationsController{

    //o tratamento da regra para notificações do sistema é diferente para as notificações de açoes do usuario no sistema
    //sendo a terminação all indicada para notificações globais para todos os usuarios e to para usuarios direcionados

    static async GetAllAndToNotificationsUser(req,res){
        // trazer todas as notificações
        const toNumber = (value) => {
            const number = Number(value)
            return isNaN(number) ? value : number
        }

        const page = toNumber(req.params.page)
        const limit = 10

        if (!page || typeof page != 'number') {
            res.status(422).json({ message: 'Pagina de envio Inválida  , por favor verifique o que foi digitado' })
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

        const unread = await Notifications.countDocuments({
            $or: [
                { 
                  to: user._id, 
                  viewed: false 
                },
                { 
                  to: 'all', 
                  userviewed: { $ne: user._id } 
                }
              ]
        })

        const notifications = await Notifications.find({
            $or: [
                { to: user._id },  
                { to: 'all' }      
            ]
        }).sort('-createdAt').skip((page - 1) * limit).limit(limit)

        const totalNotifications = await Notifications.countDocuments({
            $or: [
                { to: user._id },  
                { to: 'all' }      
            ]
        })

        const totalPages = Math.ceil(totalNotifications / limit)

        if (!notifications) {
            res.status(404).json({ message: 'Notificação não existe no banco de dados , por favor verifique o que foi digitado' })
            return
        }

        res.status(200).json({message:'Notificações retornadas com sucesso',notifications,unread,totalNotifications,totalPages})
    }

    static async CreateAll(text,type,image,link){
        try{
            const notification = new Notifications({message:text,type:type})
            if(link){
                notification.link = link
            }
            if(image){
                notification.image = image
            }
            await Notifications.create(notification)
        }catch(erro){
            console.log(`erro apresentado : ${erro}`)
        }
    }

    static async GetAllNotificationsUser(req,res){
        let token, user, userDb
        try {
            token = GetToken(req)
            user = await GetUserByToken(token)
            userDb = await User.findById(user._id)
        } catch (Erro) {
            res.status(422).json({ message: 'Usuario não encontrado , por favor verifique o que foi digitado' })
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
        let token, user, userDb
        try {
            token = GetToken(req)
            user = await GetUserByToken(token)
            userDb = await User.findById(user._id)
        } catch (Erro) {
            res.status(422).json({ message: 'Usuario não encontrado , por favor verifique o que foi digitado' })
            return
        }

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

        try {
            userDb = await User.findById(to)
        } catch (Erro) {
            res.status(422).json({ message: 'Usuario não encontrado , por favor verifique o que foi digitado' })
            return
        }

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
            await Notifications.create(notification)
        }catch(erro){
            console.log(erro)
        }
    }

    static async GetToNotificationsUser(req,res){
        let token, user, userDb
        try {
            token = GetToken(req)
            user = await GetUserByToken(token)
            userDb = await User.findById(user._id)
        } catch (Erro) {
            res.status(422).json({ message: 'Usuario não encontrado , por favor verifique o que foi digitado' })
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
        let token, user, userDb
        try {
            token = GetToken(req)
            user = await GetUserByToken(token)
            userDb = await User.findById(user._id)
        } catch (Erro) {
            res.status(422).json({ message: 'Usuario não encontrado , por favor verifique o que foi digitado' })
            return
        }

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