const express = require('express')
const cors = require('cors')
require('dotenv').config()
const EmailSend = require('./service/email/EmailSend')
const socketController = require('./helpers/Socket')

//Import Routes
const UserRoutes = require('./routes/UserRoutes')
const PetRoutes = require('./routes/PetRoutes')
const MessageRoutes = require('./routes/MessageRoutes')
const NotificationsRoutes = require('./routes/NotificationsRoutes')

const app = express()

//CONFIG JSON response
app.use(express.json())

//Serve
const http = require('http')
const server = http.createServer(app)

//Notifications
const {Server} = require('socket.io')
global.io = new Server(server, {
    cors: {
        origin: process.env.URL_FRONTEND, 
        methods: ["GET", "POST"],
    }
})

// Usei um arquivo a parte para a função abaixo

global.userConnectSocket = []

global.io.on('connection', (socket) => {
    console.log('Usuário conectado:', socket.id)

    socket.on('newUserCheck',async (token)=>{
        console.log(`entrou em newUserCheck com token : ${token}`)
        let checkUser = await socketController.newUserCheck(token)
        if(checkUser !== false){
            let newUserConnectSocket = [socket.id,checkUser[0],checkUser[1]]
            global.userConnectSocket.push(newUserConnectSocket)
            console.log('userConnectSocket : ', global.userConnectSocket)
        }
    })

    socket.on('disconnect', () => {
        global.userConnectSocket = global.userConnectSocket.filter((user)=> user[0] !== socket.id)
        console.log('Usuário desconectado:', socket.id)
        console.log('userConnectSocket atualizado : ', global.userConnectSocket)
    })
})

//io para as controllers

//Solve CORS
app.use(cors({Credential:true,origin: process.env.URL_FRONTEND}))

//Public forder images
app.use(express.static('public'))

//Routes
app.use('/users', UserRoutes)
app.use('/pets',PetRoutes)
app.use('/message',MessageRoutes)
app.use('/notifications',NotificationsRoutes)
app.use((req, res, next) => {
    res.status(404).json({ message: 'Rota não encontrada' })
})

//tratamento de erros , mas não 100%
app.use((err, req, res, next) => {
    console.error(`Erro: ${err.message}`)
    const status = err.status || 500
    res.status(status).json({ message: err.message || 'Erro interno no servidor.' })
})

setInterval(async () => {
    try{
        await EmailSend.EmailNewMessageChatNotification()
        console.log('Verificação de novos e-mails feita com sucesso')
    }catch(erro){
        console.log(`Erro ao verificar novos e-mails com o erro : ${erro}`)
    }
},5*60*1000) //5 minutos * 60 segundos * 1000 milisegundos

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
})

module.exports = {io}