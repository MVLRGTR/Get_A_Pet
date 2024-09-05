const mongoose = require('mongoose')
require('dotenv').config()

async function main(){
    await mongoose.connect(process.env.URL_DATABASE)
    console.log('Conectou ao Mongoose!')
}

try{
    main()
}catch(erro){
    console.log(`O erro apresentado foi ${erro}`)
}

module.exports = mongoose