//helpers 
const GetUserByToken = require('../helpers/GetUserByToken')
const ObjectId = require('mongoose').Types.ObjectId


module.exports = class socketController{
    static async newUserCheck(token){
        const user = await GetUserByToken(token)
        if(user){
            const checkUser = [user._id, user.name]
            console.log(`user : ${user}`)
            return checkUser
        }else{
            return false
        }
    }

    static sendNotificationAll(notification){
        global.io.emit('newNotification', notification)
    }

    static sendNotificationTo(notification){
        const userSocket = global.userConnectSocket.find((user)=> user[1].toString() === notification.to.toString())
        if(userSocket !== undefined){
            global.io.to(userSocket[0]).emit('newNotification',notification)
            console.log(`Notificação enviada para o usuário: ${userSocket[2]}, Socket ID: ${userSocket[0]}`)
        }else{
            console.log(`Usuário com ID ${notification.to} não está conectado.`)
        }
    }

    static sendNewMessageChat(message){
        const userSocket = global.userConnectSocket.find((user)=> user[1].toString() === message.to.toString())
        if(userSocket !== undefined){
            global.io.to(userSocket[0]).emit('newMessage',message)
            console.log(`Mensagem enviada para o usuário: ${userSocket[2]}, Socket ID: ${userSocket[0]}`)
        }else{
            console.log(`Usuário com ID ${notification.to} não está conectado.`)
        }

    }
}