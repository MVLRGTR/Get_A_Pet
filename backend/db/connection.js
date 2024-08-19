const mongoose = require('mongoose')

async function main(){
    await mongoose.connect('mongodb://localhost:27017/getapet')
    console.log('Conectou ao Mongoose!')
}

try{
    main()
}catch(erro){
    console.log(`O erro apresentado foi ${erro}`)
}

module.exports = mongoose