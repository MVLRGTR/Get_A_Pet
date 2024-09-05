const express = require('express')
const cors = require('cors')
require('dotenv').config()

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
app.listen(process.env.PORT)
app.use('/users',UserRoutes)
app.use('/pets',PetRoutes)
app.use('/message',MessageRoutes)
app.use('/notifications',NotificationsRoutes)
app.use((req, res, next) => {
    res.status(404).json({ message: 'Rota não encontrada' });
})