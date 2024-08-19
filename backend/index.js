const express = require('express')
const cors = require('cors')

//Import Routes
const UserRoutes = require('./routes/UserRoutes')
const PetRoutes = require('./routes/PetRoutes')

const app = express()

//CONFIG JSON response
app.use(express.json())

//Solve CORS
app.use(cors({Credential:true,origin:'http://localhost:3000'}))

//Public forder images
app.use(express.static('public'))

//Routes
app.listen(5000)
app.use('/users',UserRoutes)
app.use('/pets',PetRoutes)