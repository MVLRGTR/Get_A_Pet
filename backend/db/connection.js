const mongoose = require('mongoose')
require('dotenv').config()

async function main(){
    await mongoose.connect(process.env.URL_DATABASE)
    console.log('Conectou ao Mongoose!')
}

try{
    main()
}catch(erro){
    console.log(`Erro de conexão apresentado : ${erro}`)
}

module.exports = mongoose


// const mongoose = require('mongoose');
// require('dotenv').config();

// async function connectWithRetry() {
//     try {
//         await mongoose.connect(process.env.URL_DATABASE, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });
//         console.log('Conectou ao Mongoose!');
//     } catch (erro) {
//         console.error(`Erro de conexão apresentado: ${erro}`);
//         console.log('Tentando reconectar ao MongoDB em 5 segundos...');
//         setTimeout(connectWithRetry, 5000); // Tenta reconectar após 5 segundos
//     }
// }

// connectWithRetry();

// module.exports = mongoose;