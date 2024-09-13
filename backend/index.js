const express = require('express')
const cors = require('cors')
require('dotenv').config()
const EmailSend = require('./service/email/EmailSend')

//Import Routes
const UserRoutes = require('./routes/UserRoutes')
const PetRoutes = require('./routes/PetRoutes')
const MessageRoutes = require('./routes/MessageRoutes')
const NotificationsRoutes = require('./routes/NotificationsRoutes')

const app = express()

//CONFIG JSON response
app.use(express.json())

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
    res.status(404).json({ message: 'Rota não encontrada' });
})
app.use((err, req, res, next) => {
    console.error(`Erro: ${err.message}`);
    res.status(500).json({ message: 'Erro interno no servidor.' });
})

setInterval(async () => {
    try{
        await EmailSend.EmailNewMessageChatNotification()
        console.log('Verificação de novos e-mails feita com sucesso')
    }catch(erro){
        console.log(`Erro ao verificar novos e-mails com o erro : ${erro}`)
    }
},5*60*1000) //5 minutos * 60 segundos * 1000 milisegundos

app.listen(process.env.PORT)