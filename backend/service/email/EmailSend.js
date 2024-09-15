const Send = require('./Nodemailer')
const User = require('../../models/User')
const Message = require('../../models/Message')
require('dotenv').config()

module.exports = class SendEmail {

    static EmailPrimaryLogin(to, token) {
        
        const Email = `<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Validação de conta</title>
    <style>
        body {
            font-family: Helvetica;
            min-height: 100vh;
            max-width: 900px;
            margin: auto;
            padding: 0;
        }

        section {
            max-width: 900px;
            margin: auto;
        }

        .header {
            height: 95px;
            background-color: #ffd400;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .header img {
            border-radius: 50%;
            padding: 10px;
            width: 80px;
        }

        .header p {
            color: #16479d;
            font-size: 1.7em;
            padding-right: 15px;
        }

        .content {
            display: flex;
            flex-direction: row;
            margin: auto;
            height: 500px;
        }

        .content p{
            line-height: 1.2;
        }

        .content strong{
            color: #ffd400;
        }

        .content img {
            max-width: 300px;
        }

        .content article {
            padding-left: 10px;
            display: flex;
            flex-direction: column;
            background-color: #85731d79;
            flex-grow: 1;
            align-items: center;
        }

        .content h2 {
            margin: auto;
        }

        .content p {
            display: flex;
            padding-top: 20px;
            justify-content: center;
            align-items: center;
        }

        .img-user-container{
            display: flex;
            justify-content: center;
            margin-top: 20px;
        }

        .img-user-container img {
            width: 140px;
            height: 140px;
            border-radius: 50%;
        }

        .btn-container {
            display: flex;
            width: 300px;
            height: 40px;
            background-color: #ffd400;
            margin: auto;
            border-radius: 10px;
            justify-content: center;
            align-items: center;
        }

        .btn-container a {
            margin: auto;
            text-decoration: none;
            color: black;
        }

        .footer {
            height: 200px;
            background-color: #ffd400;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .footer img {
            border-radius: 50%;
            padding: 10px;
            height: 80px;
            width: 80px;
        }

        .footer p {
            line-height: 1.8;
        }

        @media (max-width: 650px) {
            .header p {
                font-size: 1.2em;
            }

            .content img {
                max-width: 230px;
            }

            .img-user-container img {
                width: 80px;
                height: 80px;
            }

            .btn-container {
                width: 250px;
                height: 40px;
            }

            .footer {
                flex-direction: column;
                align-items: center;
            }

            .footer img {
                height: 60px;
                width: 60px;
            }

            .footer p {
                padding: 10px;
                text-align: center;
            }
        }

        @media (max-width: 520px) {
            .header p {
                font-size: 1.2em;
            }

            .content h2{
                font-size: 18px;
            }

            .content img {
                max-width: 140px;
            }

            .img-user-container img {
                width: 80px;
                height: 80px;
            }

            .btn-container {
                width: 190px;
                height: 40px;
            }

            .footer {
                flex-direction: column;
                align-items: center;
            }

            .footer img {
                height: 60px;
                width: 60px;
            }

            .footer p {
                padding: 10px;
                text-align: center;
                line-height: 1.2;
            }
        }

    </style>
</head>
<body>
    <section class="header">
       <img src="${process.env.URL_API}/images/pets/icongetapet.jpg" alt="icon">
        <p>Valide sua conta </p>
    </section>
    <section class="content">
        <img src="${process.env.URL_API}/images/pets/dogbodyemail.jpg" alt="dog">
        <article>
            <h2>Validação de conta 🐾</h2>
            <p>Ficamos muito felizes em tê-lo(a) conosco em nossa comunidade de amantes dos animais! Agora você pode explorar e conhecer os pets disponíveis para adoção, salvar seus favoritos e muito mais.
            Para acessar sua conta e aproveitar todos os recursos da plataforma, utilize o token de autenticação abaixo
            </p>
            <div class="img-user-container">
                <p style="margin: auto;">
                    <strong>${token}</strong>
                </p>
            </div>
            <div class="btn-container">
                <a href="${process.env.URL_FRONTEND}/login/primarylogin">Valide sua conta aqui</a>
            </div>
        </article>
    </section>
    <section class="footer">
        <section style="flex-basis: 50%; display: flex; align-items: center;">
            <img src="${process.env.URL_API}/images/pets/icongetapet.jpg" alt="icon">
            <h2>Get A Pet</h2>
        </section>
        <section style="flex-basis: 50%; display: flex; align-items: center;">
            <p>Por favor, não responda a este e-mail. Você está recebendo este e-mail porque criou uma conta Get A Pet em www.getapet.tech ou em nosso aplicativo móvel.</p>
        </section>
    </section>
</body>
</html>`

        Send(to, "E-mail de Validação", Email)
        console.log(`E-mail enviado com sucesso !!!`)
    }

    static async EmailForgotPassword(to,token) {
        const Email = `
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recuperação de conta</title>
    <style>
        body {
            font-family: Helvetica;
            min-height: 100vh;
            max-width: 900px;
            margin: auto;
            padding: 0;
        }

        section {
            max-width: 900px;
            margin: auto;
        }

        .header {
            height: 95px;
            background-color: #ffd400;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .header img {
            border-radius: 50%;
            padding: 10px;
            width: 80px;
        }

        .header p {
            color: #16479d;
            font-size: 1.7em;
            padding-right: 15px;
        }

        .content {
            display: flex;
            flex-direction: row;
            margin: auto;
            height: 500px;
        }

        .content p{
            line-height: 1.2;
        }

        .content strong{
            color: #ffd400;
        }

        .content img {
            max-width: 300px;
        }

        .content article {
            padding-left: 10px;
            display: flex;
            flex-direction: column;
            background-color: #85731d79;
            flex-grow: 1;
            align-items: center;
        }

        .content h2 {
            margin: auto;
        }

        .content p {
            display: flex;
            padding-top: 20px;
            justify-content: center;
            align-items: center;
        }

        .img-user-container{
            display: flex;
            justify-content: center;
            margin-top: 20px;
        }

        .img-user-container img {
            width: 140px;
            height: 140px;
            border-radius: 50%;
        }

        .btn-container {
            display: flex;
            width: 300px;
            height: 40px;
            background-color: #ffd400;
            margin: auto;
            border-radius: 10px;
            justify-content: center;
            align-items: center;
        }

        .btn-container a {
            margin: auto;
            text-decoration: none;
            color: black;
        }

        .footer {
            height: 200px;
            background-color: #ffd400;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .footer img {
            border-radius: 50%;
            padding: 10px;
            height: 80px;
            width: 80px;
        }

        .footer p {
            line-height: 1.8;
        }

        @media (max-width: 650px) {
            .header p {
                font-size: 1.2em;
            }

            .content img {
                max-width: 230px;
            }

            .img-user-container img {
                width: 80px;
                height: 80px;
            }

            .btn-container {
                width: 250px;
                height: 40px;
            }

            .footer {
                flex-direction: column;
                align-items: center;
            }

            .footer img {
                height: 60px;
                width: 60px;
            }

            .footer p {
                padding: 10px;
                text-align: center;
            }
        }

        @media (max-width: 520px) {
            .header p {
                font-size: 1.2em;
            }

            .content h2{
                font-size: 18px;
            }

            .content img {
                max-width: 140px;
            }

            .img-user-container img {
                width: 80px;
                height: 80px;
            }

            .btn-container {
                width: 190px;
                height: 40px;
            }

            .footer {
                flex-direction: column;
                align-items: center;
            }

            .footer img {
                height: 60px;
                width: 60px;
            }

            .footer p {
                padding: 10px;
                text-align: center;
                line-height: 1.2;
            }
        }

    </style>
</head>
<body>
    <section class="header">
       <img src="${process.env.URL_API}/images/pets/icongetapet.jpg" alt="icon">
        <p>Recupere sua conta </p>
    </section>
    <section class="content">
        <img src="${process.env.URL_API}/images/pets/dogbodyemail.jpg" alt="dog">
        <article>
            <h2>Recupere  sua conta do Get A Pet! 🐾</h2>
            <p>Estamos prontos para ajudá-lo(a) a voltar a utilizar sua conta na nossa plataforma. Para recuperar sua conta e aproveitar todos os recursos que o Get A Pet tem para  oferece a você, utilize o token de recuperação abaixo:
            </p>
            <div class="img-user-container">
                <p style="margin: auto;">
                    <strong>${token}</strong>
                </p>
            </div>
            <div class="btn-container">
                <a href="${process.env.URL_FRONTEND}/forgotpassword">Recupere aqui sua conta</a>
            </div>
        </article>
    </section>
    <section class="footer">
        <section style="flex-basis: 50%; display: flex; align-items: center;">
            <img src="${process.env.URL_API}/images/pets/icongetapet.jpg" alt="icon">
            <h2>Get A Pet</h2>
        </section>
        <section style="flex-basis: 50%; display: flex; align-items: center;">
            <p>Por favor, não responda a este e-mail. Você está recebendo este e-mail porque criou uma conta Get A Pet em www.getapet.tech ou em nosso aplicativo móvel.</p>
        </section>
    </section>
</body>
</html>`
        Send(to, "Recuperação de Senha", Email)
        console.log(`E-mail enviado com sucesso !!!`)

    }

    static async EmailNewPetForAllUsers(pet){
        const usersEmail = await User.find({receiveremail:'true'}).select('email')

        const Email = `<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Novo Pet na Plataforma</title>
    <style>
        body {
            font-family: Helvetica;
            min-height: 100vh;
            max-width: 900px;
            margin: auto;
            padding: 0;
        }

        section {
            max-width: 900px;
            margin: auto;
        }

        .header {
            height: 95px;
            background-color: #ffd400;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .header img {
            border-radius: 50%;
            padding: 10px;
            width: 80px;
        }

        .header p {
            color: #16479d;
            font-size: 1.7em;
            padding-right: 15px;
        }

        .content {
            display: flex;
            flex-direction: row;
            margin: auto;
            height: 500px;
        }

        .content p{
            line-height: 1.2;
        }

        .content strong{
            color: #ffd400;
        }

        .content img {
            max-width: 300px;
        }

        .content article {
            padding-left: 10px;
            display: flex;
            flex-direction: column;
            background-color: #85731d79;
            flex-grow: 1;
            align-items: center;
        }

        .content h2 {
            margin: auto;
        }

        .content p {
            display: flex;
            padding-top: 20px;
            justify-content: center;
            align-items: center;
        }

        .img-user-container{
            display: flex;
            justify-content: center;
            margin-top: 20px;
        }

        .img-user-container img {
            width: 140px;
            height: 140px;
            border-radius: 50%;
        }

        .btn-container {
            display: flex;
            width: 300px;
            height: 40px;
            background-color: #ffd400;
            margin: auto;
            border-radius: 10px;
            justify-content: center;
            align-items: center;
        }

        .btn-container a {
            margin: auto;
            text-decoration: none;
            color: black;
        }

        .footer {
            height: 200px;
            background-color: #ffd400;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .footer img {
            border-radius: 50%;
            padding: 10px;
            height: 80px;
            width: 80px;
        }

        .footer p {
            line-height: 1.8;
        }

        @media (max-width: 650px) {
            .header p {
                font-size: 1.2em;
            }

            .content img {
                max-width: 230px;
            }

            .img-user-container img {
                width: 80px;
                height: 80px;
            }

            .btn-container {
                width: 250px;
                height: 40px;
            }

            .footer {
                flex-direction: column;
                align-items: center;
            }

            .footer img {
                height: 60px;
                width: 60px;
            }

            .footer p {
                padding: 10px;
                text-align: center;
            }
        }

        @media (max-width: 520px) {
            .header p {
                font-size: 1.2em;
            }

            .content h2{
                font-size: 18px;
            }

            .content img {
                max-width: 160px;
            }

            .img-user-container img {
                width: 80px;
                height: 80px;
            }

            .btn-container {
                width: 160px;
                height: 40px;
            }

            .footer {
                flex-direction: column;
                align-items: center;
            }

            .footer img {
                height: 60px;
                width: 60px;
            }

            .footer p {
                padding: 10px;
                text-align: center;
                line-height: 1.2;
            }
        }

    </style>
</head>
<body>
    <section class="header">
        <img src="${process.env.URL_API}/images/pets/icongetapet.jpg" alt="icon">
        <p>Temos um novo pet disponível </p>
    </section>
    <section class="content">
       <img src="${process.env.URL_API}/images/pets/dogbodyemail.jpg" alt="dog">
        <article>
            <h2>${pet.name} 🐾</h2>
            <p>Esse novo amigo peludo está esperando por você! Acabamos de adicionar esse pet adorável em nossa plataforma, pronto para encontrar um lar cheio de amor.
                Não perca a chance de conhecer esse novo companheiro e dar a ele uma nova casa. Clique no Link abaixo e venha conhecer o novo pet!
            </p>
            <div class="img-user-container">
                <a href="${process.env.URL_FRONTEND}/pets/${pet._id}">
                    <img src="${process.env.URL_API}/images/pets/${pet.images[0]}" alt="imgPet">
                </a>
            </div>
            <div class="btn-container">
                <a href="${process.env.URL_FRONTEND}/pets/${pet._id}">Clique aqui para ver</a>
            </div>
        </article>
    </section>
    <section class="footer">
        <section style="flex-basis: 50%; display: flex; align-items: center;">
            <img src="${process.env.URL_API}/images/pets/icongetapet.jpg" alt="icon">
            <h2>Get A Pet</h2>
        </section>
        <section style="flex-basis: 50%; display: flex; align-items: center;">
            <p>Por favor, não responda a este e-mail. Você está recebendo este e-mail porque criou uma conta Get A Pet em www.getapet.tech ou em nosso aplicativo móvel.</p>
        </section>
    </section>
</body>
</html>`
        
        for(const user of usersEmail){
            await Send(user.email, "Venha ver o novo pet", Email)
        }
    }

    static async EmailNewMessageChatNotification(){
        const users = await User.find({receiveremail:'true'}).select('_id email')

        // aqui pego todos os usuarios e percorro pelas messagens de cada usuario e verifico quantas conversas diferentes ele tem para enviar o e-mail para n conversar difirentes
        for(const user of users){
            // console.log('Processando usuário:', user.email)
            const messages = await Message.find({
                viewed:false,
                notification:false,
                to:user._id
            })

            let from = []

            await Promise.all(messages.map(async (message) => {
                await Message.findByIdAndUpdate(message._id, { notification: true })
                
                if (!from.includes(message.from)) {
                    from.push(message.from)
                }
            }))
    
            // console.log(`from :${from}`)
            await Promise.all(from.map(async (index) => {
                const userFrom = await User.findById(index).select('_id name img')
                const Email = `<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nova notificação</title>
    <style>
        body {
            font-family: Helvetica;
            min-height: 100vh;
            max-width: 900px;
            margin: auto;
            padding: 0;
        }

        section {
            max-width: 900px;
            margin: auto;
        }

        /* Estilos gerais */
        .header {
            height: 95px;
            background-color: #ffd400;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .header img {
            border-radius: 50%;
            padding: 10px;
            width: 80px;
        }

        .header p {
            color: #16479d;
            font-size: 1.7em;
            padding-right: 15px;
        }

        .content {
            display: flex;
            flex-direction: row;
            margin: auto;
        }

        .content strong{
            color: #ffd400;
        }

        .content img {
            width: 100%;
            max-width: 300px;
        }

        .content article {
            padding-left: 10px;
            display: flex;
            flex-direction: column;
            background-color: #85731d79;
            flex-grow: 1;
        }

        .content h2 {
            margin: auto;
        }

        .img-user-container {
            display: flex;
            padding-top: 20px;
            justify-content: center;
            align-items: center;
        }

        .img-user-container img {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            margin: auto;
        }

        .btn-container {
            display: flex;
            width: 320px;
            height: 50px;
            background-color: #ffd400;
            margin: auto;
            border-radius: 10px;
            justify-content: center;
            align-items: center;
        }

        .btn-container a {
            margin: auto;
            text-decoration: none;
            color: black;
        }

        .footer {
            height: 200px;
            background-color: #ffd400;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .footer img {
            border-radius: 50%;
            padding: 10px;
            height: 80px;
            width: 80px;
        }

        .footer p {
            line-height: 1.8;
        }

        /* Media Queries */

        /* Mobile */
        @media (max-width: 650px) {
            .header p {
                font-size: 1.2em;
            }

            .content img {
                max-width: 230px;
            }

            .img-user-container img {
                width: 80px;
                height: 80px;
            }

            .btn-container {
                width: 250px;
                height: 40px;
            }

            .footer {
                flex-direction: column;
                align-items: center;
            }

            .footer img {
                height: 60px;
                width: 60px;
            }

            .footer p {
                padding: 10px;
                text-align: center;
            }
        }

        @media (max-width: 520px) {
            .header p {
                font-size: 1.2em;
            }

            .content h2{
                font-size: 18px;
            }

            .content img {
                max-width: 180px;
            }

            .img-user-container img {
                width: 80px;
                height: 80px;
            }

            .btn-container {
                width: 160px;
                height: 40px;
            }

            .footer {
                flex-direction: column;
                align-items: center;
            }

            .footer img {
                height: 60px;
                width: 60px;
            }

            .footer p {
                padding: 10px;
                text-align: center;
                line-height: 1.2;
            }
        }

    </style>
</head>
<body>
    <section class="header">
        <img src="${process.env.URL_API}/images/pets/icongetapet.jpg" alt="icon">
        <p>Nova Mensagem</p>
    </section>
    <section class="content">
        <img src="${process.env.URL_API}/images/pets/dogbodyemail.jpg" alt="dog">
        <article>
            <h2>Você tem uma nova mensagem de <strong>${userFrom.name}</strong></h2>
            <div class="img-user-container">
                <a href="${process.env.URL_FRONTEND}/messages/${userFrom._id}">
                    <img src="${process.env.URL_API}/images/users/${userFrom.img}" alt="imgUser">
                </a>
            </div>
            <div class="btn-container">
                <a href="${process.env.URL_FRONTEND}/messages/${userFrom.id}">Clique aqui para ver</a>
            </div>
        </article>
    </section>
    <section class="footer">
        <section style="flex-basis: 50%; display: flex; align-items: center;">
            <img src="${process.env.URL_API}/images/pets/icongetapet.jpg" alt="icon">
            <h2>Get A Pet</h2>
        </section>
        <section style="flex-basis: 50%; display: flex; align-items: center;">
            <p>Por favor, não responda a este e-mail. Você está recebendo este e-mail porque criou uma conta Get A Pet em www.getapet.tech ou em nosso aplicativo móvel.</p>
        </section>
    </section>
</body>
</html>
`
                // console.log(`Enviando e-mail para ${user.email}, mensagem de ${userFrom.name}`)
                await Send(user.email, "Nova mensagem", Email)
            }))

            // console.log(`Finalizado para usuário: ${user.email}`)
        }
    }

    static async EmailNewRequestAdopter(pet,user){

        const Email = `<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Requisição de adoção</title>
    <style>
        body {
            font-family: Helvetica;
            min-height: 100vh;
            max-width: 900px;
            margin: auto;
            padding: 0;
        }

        section {
            max-width: 900px;
            margin: auto;
        }

        .header {
            height: 95px;
            background-color: #ffd400;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .header img {
            border-radius: 50%;
            padding: 10px;
            width: 80px;
        }

        .header p {
            color: #16479d;
            font-size: 1.7em;
            padding-right: 15px;
        }

        .content {
            display: flex;
            flex-direction: row;
            margin: auto;
            height: 500px;
        }

        .content p{
            line-height: 1.2;
        }

        .content strong{
            color: #ffd400;
        }

        .content img {
            max-width: 300px;
        }

        .content article {
            padding-left: 10px;
            display: flex;
            flex-direction: column;
            background-color: #85731d79;
            flex-grow: 1;
            align-items: center;
        }

        .content h2 {
            margin: auto;
        }

        .content p {
            display: flex;
            padding-top: 20px;
            justify-content: center;
            align-items: center;
        }

        .img-user-container{
            display: flex;
            justify-content: center;
            margin-top: 20px;
        }

        .img-user-container img {
            width: 140px;
            height: 140px;
            border-radius: 50%;
        }

        .btn-container {
            display: flex;
            width: 300px;
            height: 40px;
            background-color: #ffd400;
            margin: auto;
            border-radius: 10px;
            justify-content: center;
            align-items: center;
        }

        .btn-container a {
            margin: auto;
            text-decoration: none;
            color: black;
        }

        .footer {
            height: 200px;
            background-color: #ffd400;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .footer img {
            border-radius: 50%;
            padding: 10px;
            height: 80px;
            width: 80px;
        }

        .footer p {
            line-height: 1.8;
        }

        @media (max-width: 650px) {
            .header p {
                font-size: 1.2em;
            }

            .content img {
                max-width: 230px;
            }

            .img-user-container img {
                width: 80px;
                height: 80px;
            }

            .btn-container {
                width: 250px;
                height: 40px;
            }

            .footer {
                flex-direction: column;
                align-items: center;
            }

            .footer img {
                height: 60px;
                width: 60px;
            }

            .footer p {
                padding: 10px;
                text-align: center;
            }
        }

        @media (max-width: 520px) {
            .header p {
                font-size: 1.2em;
            }

            .content h2{
                font-size: 18px;
            }

            .content img {
                max-width: 160px;
            }

            .img-user-container img {
                width: 80px;
                height: 80px;
            }

            .btn-container {
                width: 160px;
                height: 40px;
            }

            .footer {
                flex-direction: column;
                align-items: center;
            }

            .footer img {
                height: 60px;
                width: 60px;
            }

            .footer p {
                padding: 10px;
                text-align: center;
                line-height: 1.2;
            }
        }

    </style>
</head>
<body>
    <section class="header">
        <img src="${process.env.URL_API}/images/pets/icongetapet.jpg" alt="icon">
        <p>Você tem um nova requisição de adoção </p>
    </section>
    <section class="content">
       <img src="${process.env.URL_API}/images/pets/dogbodyemail.jpg" alt="dog">
        <article>
            <h2>Nova solicitação para : ${pet.name} 🐾</h2>
            <p>Você tem uma nova requisição de adoção para o seu pet ${pet.name} , clique no botão abaixo para poder ver na nossa plataforma
            </p>
            <div class="img-user-container">
                <a href="${process.env.URL_FRONTEND}/pets/mypets/${pet._id}">
                    <img src="${process.env.URL_API}/images/pets/${pet.images[0]}" alt="imgPet">
                </a>
            </div>
            <div class="btn-container">
                <a href="${process.env.URL_FRONTEND}/pets/mypets/${pet._id}">Clique aqui para ver</a>
            </div>
        </article>
    </section>
    <section class="footer">
        <section style="flex-basis: 50%; display: flex; align-items: center;">
            <img src="${process.env.URL_API}/images/pets/icongetapet.jpg" alt="icon">
            <h2>Get A Pet</h2>
        </section>
        <section style="flex-basis: 50%; display: flex; align-items: center;">
            <p>Por favor, não responda a este e-mail. Você está recebendo este e-mail porque criou uma conta Get A Pet em www.getapet.tech ou em nosso aplicativo móvel.</p>
        </section>
    </section>
</body>
</html>`

        if(user.receiveremail){
            console.log(`entrou aqui com user.email : ${user.email}`)
            await Send(user.email,"Nova Solicitação de adoção",Email)
        }

    }

    static async EmailConcludeAdopter(pet,user,type){

        let p  = ``
        if(type === 'adopter'){
            p = `Temos uma ótima notícia! A sua solicitação de adoção para o pet ${pet.name} foi aceita  com a ajuda da plataforma Get A Pet. Agradecemos imensamente por confiar em nós para ajudar a encontrar a família perfeita para seu novo amigo peludo.
            Você pode visualizar os detalhes da adoção clicando no botão abaixo:`
        }else{
            p = `Temos uma ótima notícia! O seu pet ${pet.name} encontrou um novo lar com a ajuda da plataforma Get A Pet. Agradecemos imensamente por confiar em nós para ajudar a encontrar a família perfeita para seu amigo peludo. 
                Você pode visualizar os detalhes da adoção clicando no botão abaixo:`
        }

        const Email = `<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Conclusão de Adoção</title>
    <style>
        body {
            font-family: Helvetica;
            min-height: 100vh;
            max-width: 900px;
            margin: auto;
            padding: 0;
        }

        section {
            max-width: 900px;
            margin: auto;
        }

        .header {
            height: 95px;
            background-color: #ffd400;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .header img {
            border-radius: 50%;
            padding: 10px;
            width: 80px;
        }

        .header p {
            color: #16479d;
            font-size: 1.7em;
            padding-right: 15px;
        }

        .content {
            display: flex;
            flex-direction: row;
            margin: auto;
            height: 500px;
        }

        .content p{
            line-height: 1.2;
        }

        .content strong{
            color: #ffd400;
        }

        .content img {
            max-width: 300px;
        }

        .content article {
            padding-left: 10px;
            display: flex;
            flex-direction: column;
            background-color: #85731d79;
            flex-grow: 1;
            align-items: center;
        }

        .content h2 {
            margin: auto;
        }

        .content p {
            display: flex;
            padding-top: 20px;
            justify-content: center;
            align-items: center;
        }

        .img-user-container{
            display: flex;
            justify-content: center;
            margin-top: 20px;
        }

        .img-user-container img {
            width: 140px;
            height: 140px;
            border-radius: 50%;
        }

        .btn-container {
            display: flex;
            width: 300px;
            height: 40px;
            background-color: #ffd400;
            margin: auto;
            border-radius: 10px;
            justify-content: center;
            align-items: center;
        }

        .btn-container a {
            margin: auto;
            text-decoration: none;
            color: black;
        }

        .footer {
            height: 200px;
            background-color: #ffd400;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .footer img {
            border-radius: 50%;
            padding: 10px;
            height: 80px;
            width: 80px;
        }

        .footer p {
            line-height: 1.8;
        }

        @media (max-width: 650px) {
            .header p {
                font-size: 1.2em;
            }

            .content img {
                max-width: 230px;
            }

            .img-user-container img {
                width: 80px;
                height: 80px;
            }

            .btn-container {
                width: 250px;
                height: 40px;
            }

            .footer {
                flex-direction: column;
                align-items: center;
            }

            .footer img {
                height: 60px;
                width: 60px;
            }

            .footer p {
                padding: 10px;
                text-align: center;
            }
        }

        @media (max-width: 520px) {
            .header p {
                font-size: 1.2em;
            }

            .content h2{
                font-size: 18px;
            }

            .content img {
                max-width: 160px;
            }

            .img-user-container img {
                width: 80px;
                height: 80px;
            }

            .btn-container {
                width: 160px;
                height: 40px;
            }

            .footer {
                flex-direction: column;
                align-items: center;
            }

            .footer img {
                height: 60px;
                width: 60px;
            }

            .footer p {
                padding: 10px;
                text-align: center;
                line-height: 1.2;
            }
        }

    </style>
</head>
<body>
    <section class="header">
        <img src="${process.env.URL_API}/images/pets/icongetapet.jpg" alt="icon">
        <p>Sua adoção foi concluida</p>
    </section>
    <section class="content">
       <img src="${process.env.URL_API}/images/pets/dogbodyemail.jpg" alt="dog">
        <article>
            <h2>Parabéns o seu pet ${pet.name} tem um novo lar🐾</h2>
            <p>${p}</p>
            <div class="img-user-container">
                <a href="${process.env.URL_FRONTEND}/pets/mypets/${pet._id}">
                    <img src="${process.env.URL_API}/images/pets/${pet.images[0]}" alt="imgPet">
                </a>
            </div>
            <div class="btn-container">
                <a href="${process.env.URL_FRONTEND}/pets/mypets/${pet._id}">Clique aqui para ver</a>
            </div>
        </article>
    </section>
    <section class="footer">
        <section style="flex-basis: 50%; display: flex; align-items: center;">
            <img src="${process.env.URL_API}/images/pets/icongetapet.jpg" alt="icon">
            <h2>Get A Pet</h2>
        </section>
        <section style="flex-basis: 50%; display: flex; align-items: center;">
            <p>Por favor, não responda a este e-mail. Você está recebendo este e-mail porque criou uma conta Get A Pet em www.getapet.tech ou em nosso aplicativo móvel.</p>
        </section>
    </section>
</body>
</html>`
        if(user.receiveremail){
            await Send(user.email,"Adoção Concluida",Email)
        }
    }

    static async EmailCancellationRequestAdopter(user,pet){

        const CurrentTutor = await User.findById(pet.user._id).select('receiveremail email name')

        const Email = `<!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Cancelamento de adoção</title>
            <style>
                body {
                    font-family: Helvetica;
                    min-height: 100vh;
                    max-width: 900px;
                    margin: auto;
                    padding: 0;
                }
        
                section {
                    max-width: 900px;
                    margin: auto;
                }
        
                .header {
                    height: 95px;
                    background-color: #ffd400;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
        
                .header img {
                    border-radius: 50%;
                    padding: 10px;
                    width: 80px;
                }
        
                .header p {
                    color: #16479d;
                    font-size: 1.7em;
                    padding-right: 15px;
                }
        
                .content {
                    display: flex;
                    flex-direction: row;
                    margin: auto;
                    height: 500px;
                }
        
                .content p{
                    line-height: 1.2;
                }
        
                .content strong{
                    color: #ffd400;
                }
        
                .content img {
                    max-width: 300px;
                }
        
                .content article {
                    padding-left: 10px;
                    display: flex;
                    flex-direction: column;
                    background-color: #85731d79;
                    flex-grow: 1;
                    align-items: center;
                }
        
                .content h2 {
                    margin: auto;
                }
        
                .content p {
                    display: flex;
                    padding-top: 20px;
                    justify-content: center;
                    align-items: center;
                }
        
                .img-user-container{
                    display: flex;
                    justify-content: center;
                    margin-top: 20px;
                }
        
                .img-user-container img {
                    width: 140px;
                    height: 140px;
                    border-radius: 50%;
                }
        
                .btn-container {
                    display: flex;
                    width: 300px;
                    height: 40px;
                    background-color: #ffd400;
                    margin: auto;
                    border-radius: 10px;
                    justify-content: center;
                    align-items: center;
                }
        
                .btn-container a {
                    margin: auto;
                    text-decoration: none;
                    color: black;
                }
        
                .footer {
                    height: 200px;
                    background-color: #ffd400;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
        
                .footer img {
                    border-radius: 50%;
                    padding: 10px;
                    height: 80px;
                    width: 80px;
                }
        
                .footer p {
                    line-height: 1.8;
                }
        
                @media (max-width: 650px) {
                    .header p {
                        font-size: 1.2em;
                    }
        
                    .content img {
                        max-width: 230px;
                    }
        
                    .img-user-container img {
                        width: 80px;
                        height: 80px;
                    }
        
                    .btn-container {
                        width: 250px;
                        height: 40px;
                    }
        
                    .footer {
                        flex-direction: column;
                        align-items: center;
                    }
        
                    .footer img {
                        height: 60px;
                        width: 60px;
                    }
        
                    .footer p {
                        padding: 10px;
                        text-align: center;
                    }
                }
        
                @media (max-width: 520px) {
                    .header p {
                        font-size: 1.2em;
                    }
        
                    .content h2{
                        font-size: 18px;
                    }
        
                    .content img {
                        max-width: 160px;
                    }
        
                    .img-user-container img {
                        width: 80px;
                        height: 80px;
                    }
        
                    .btn-container {
                        width: 160px;
                        height: 40px;
                    }
        
                    .footer {
                        flex-direction: column;
                        align-items: center;
                    }
        
                    .footer img {
                        height: 60px;
                        width: 60px;
                    }
        
                    .footer p {
                        padding: 10px;
                        text-align: center;
                        line-height: 1.2;
                    }
                }
        
            </style>
        </head>
        <body>
            <section class="header">
                <img src="${process.env.URL_API}/images/pets/icongetapet.jpg" alt="icon">
                <p>Desistência de adoção </p>
            </section>
            <section class="content">
               <img src="${process.env.URL_API}/images/pets/dogbodyemail.jpg" alt="dog">
                <article>
                    <h2>Desistência de adoção para o pet : ${pet.name} 🐾</h2>
                    <p>O Usuario ${user.name} desistiu da adoção para o seu pet : ${pet.name} , mas não se preocupe a nossa plataforma ajudara você a encontrar um novo lar para o seu amigo peludo !!! Conte conosco !!!
                    </p>
                    <div class="img-user-container">
                        <a href="${process.env.URL_FRONTEND}/pets/mypets/${pet._id}">
                            <img src="${process.env.URL_API}/images/pets/${pet.images[0]}" alt="imgPet">
                        </a>
                    </div>
                    <div class="btn-container">
                        <a href="${process.env.URL_FRONTEND}/pets/mypets/${pet._id}">Clique aqui para ver</a>
                    </div>
                </article>
            </section>
            <section class="footer">
                <section style="flex-basis: 50%; display: flex; align-items: center;">
                    <img src="${process.env.URL_API}/images/pets/icongetapet.jpg" alt="icon">
                    <h2>Get A Pet</h2>
                </section>
                <section style="flex-basis: 50%; display: flex; align-items: center;">
                    <p>Por favor, não responda a este e-mail. Você está recebendo este e-mail porque criou uma conta Get A Pet em www.getapet.tech ou em nosso aplicativo móvel.</p>
                </section>
            </section>
        </body>
        </html>`

        if(CurrentTutor.receiveremail){
            await Send(CurrentTutor.email,"Desistência de adoção",Email)
        }

    }

    static async EmailCancellationAdopterByTutor(pet,user){

        const Adopter = await User.findById(user._id).select('receiveremail email name')
        
        const Email = `<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cancelamento de adoção</title>
    <style>
        body {
            font-family: Helvetica;
            min-height: 100vh;
            max-width: 900px;
            margin: auto;
            padding: 0;
        }

        section {
            max-width: 900px;
            margin: auto;
        }

        .header {
            height: 95px;
            background-color: #ffd400;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .header img {
            border-radius: 50%;
            padding: 10px;
            width: 80px;
        }

        .header p {
            color: #16479d;
            font-size: 1.7em;
            padding-right: 15px;
        }

        .content {
            display: flex;
            flex-direction: row;
            margin: auto;
            height: 500px;
        }

        .content p{
            line-height: 1.2;
        }

        .content strong{
            color: #ffd400;
        }

        .content img {
            max-width: 300px;
        }

        .content article {
            padding-left: 10px;
            display: flex;
            flex-direction: column;
            background-color: #85731d79;
            flex-grow: 1;
            align-items: center;
        }

        .content h2 {
            margin: auto;
        }

        .content p {
            display: flex;
            padding-top: 20px;
            justify-content: center;
            align-items: center;
        }

        .img-user-container{
            display: flex;
            justify-content: center;
            margin-top: 20px;
        }

        .img-user-container img {
            width: 140px;
            height: 140px;
            border-radius: 50%;
        }

        .btn-container {
            display: flex;
            width: 300px;
            height: 40px;
            background-color: #ffd400;
            margin: auto;
            border-radius: 10px;
            justify-content: center;
            align-items: center;
        }

        .btn-container a {
            margin: auto;
            text-decoration: none;
            color: black;
        }

        .footer {
            height: 200px;
            background-color: #ffd400;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .footer img {
            border-radius: 50%;
            padding: 10px;
            height: 80px;
            width: 80px;
        }

        .footer p {
            line-height: 1.8;
        }

        @media (max-width: 650px) {
            .header p {
                font-size: 1.2em;
            }

            .content img {
                max-width: 230px;
            }

            .img-user-container img {
                width: 80px;
                height: 80px;
            }

            .btn-container {
                width: 250px;
                height: 40px;
            }

            .footer {
                flex-direction: column;
                align-items: center;
            }

            .footer img {
                height: 60px;
                width: 60px;
            }

            .footer p {
                padding: 10px;
                text-align: center;
            }
        }

        @media (max-width: 520px) {
            .header p {
                font-size: 1.2em;
            }

            .content h2{
                font-size: 18px;
            }

            .content img {
                max-width: 160px;
            }

            .img-user-container img {
                width: 80px;
                height: 80px;
            }

            .btn-container {
                width: 160px;
                height: 40px;
            }

            .footer {
                flex-direction: column;
                align-items: center;
            }

            .footer img {
                height: 60px;
                width: 60px;
            }

            .footer p {
                padding: 10px;
                text-align: center;
                line-height: 1.2;
            }
        }

    </style>
</head>
<body>
    <section class="header">
        <img src="${process.env.URL_API}/images/pets/icongetapet.jpg" alt="icon">
        <p>Desistência de adoção </p>
    </section>
    <section class="content">
       <img src="${process.env.URL_API}/images/pets/dogbodyemail.jpg" alt="dog">
        <article>
            <h2>Desistência de adoção para o pet : ${pet.name} 🐾</h2>
            <p>O pet : ${pet.name} foi retirado da adoção por solicitação do ${Adopter.name} !!! Mas não se preocupe com isso , pois a nossa plataforma tem outros pets esperando por você , venha ver : 
            </p>
            <div class="img-user-container">
                <a href="${process.env.URL_FRONTEND}">
                    <img src="${process.env.URL_API}/images/pets/icongetapet.jpg" alt="imgPet">
                </a>
            </div>
            <div class="btn-container">
                <a href="${process.env.URL_FRONTEND}">Clique aqui para ver</a>
            </div>
        </article>
    </section>
    <section class="footer">
        <section style="flex-basis: 50%; display: flex; align-items: center;">
            <img src="${process.env.URL_API}/images/pets/icongetapet.jpg" alt="icon">
            <h2>Get A Pet</h2>
        </section>
        <section style="flex-basis: 50%; display: flex; align-items: center;">
            <p>Por favor, não responda a este e-mail. Você está recebendo este e-mail porque criou uma conta Get A Pet em www.getapet.tech ou em nosso aplicativo móvel.</p>
        </section>
    </section>
</body>
</html>`

        if(Adopter.receiveremail){
            await Send(Adopter.email,"Desistência de adoção",Email)
        }

    }

    static async EmailPetRemovedFromAdoption(pet,user){

        const Email=`<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pet retirado da adoção</title>
    <style>
        body {
            font-family: Helvetica;
            min-height: 100vh;
            max-width: 900px;
            margin: auto;
            padding: 0;
        }

        section {
            max-width: 900px;
            margin: auto;
        }

        .header {
            height: 95px;
            background-color: #ffd400;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .header img {
            border-radius: 50%;
            padding: 10px;
            width: 80px;
        }

        .header p {
            color: #16479d;
            font-size: 1.7em;
            padding-right: 15px;
        }

        .content {
            display: flex;
            flex-direction: row;
            margin: auto;
            height: 500px;
        }

        .content p{
            line-height: 1.2;
        }

        .content strong{
            color: #ffd400;
        }

        .content img {
            max-width: 300px;
        }

        .content article {
            padding-left: 10px;
            display: flex;
            flex-direction: column;
            background-color: #85731d79;
            flex-grow: 1;
            align-items: center;
        }

        .content h2 {
            margin: auto;
        }

        .content p {
            display: flex;
            padding-top: 20px;
            justify-content: center;
            align-items: center;
        }

        .img-user-container{
            display: flex;
            justify-content: center;
            margin-top: 20px;
        }

        .img-user-container img {
            width: 140px;
            height: 140px;
            border-radius: 50%;
        }

        .btn-container {
            display: flex;
            width: 300px;
            height: 40px;
            background-color: #ffd400;
            margin: auto;
            border-radius: 10px;
            justify-content: center;
            align-items: center;
        }

        .btn-container a {
            margin: auto;
            text-decoration: none;
            color: black;
        }

        .footer {
            height: 200px;
            background-color: #ffd400;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .footer img {
            border-radius: 50%;
            padding: 10px;
            height: 80px;
            width: 80px;
        }

        .footer p {
            line-height: 1.8;
        }

        @media (max-width: 650px) {
            .header p {
                font-size: 1.2em;
            }

            .content img {
                max-width: 230px;
            }

            .img-user-container img {
                width: 80px;
                height: 80px;
            }

            .btn-container {
                width: 250px;
                height: 40px;
            }

            .footer {
                flex-direction: column;
                align-items: center;
            }

            .footer img {
                height: 60px;
                width: 60px;
            }

            .footer p {
                padding: 10px;
                text-align: center;
            }
        }

        @media (max-width: 520px) {
            .header p {
                font-size: 1.2em;
            }

            .content h2{
                font-size: 18px;
            }

            .content img {
                max-width: 160px;
            }

            .img-user-container img {
                width: 80px;
                height: 80px;
            }

            .btn-container {
                width: 160px;
                height: 40px;
            }

            .footer {
                flex-direction: column;
                align-items: center;
            }

            .footer img {
                height: 60px;
                width: 60px;
            }

            .footer p {
                padding: 10px;
                text-align: center;
                line-height: 1.2;
            }
        }

    </style>
</head>
<body>
    <section class="header">
        <img src="${process.env.URL_API}/images/pets/icongetapet.jpg" alt="icon">
        <p>Pet retirado da adoção</p>
    </section>
    <section class="content">
       <img src="${process.env.URL_API}/images/pets/dogbodyemail.jpg" alt="dog">
        <article>
            <h2>O pet : ${pet.name} foi adotado por outro tutor 🐾</h2>
            <p>O pet : ${pet.name} encontrou um novo lar e por isso foi retirado da adoção , mas não se preocupe pois a nossa plataforma tem varios pets para você adotar , venha ver :
            </p>
            <div class="img-user-container">
                <a href="${process.env.URL_FRONTEND}">
                    <img src="${process.env.URL_API}/images/pets/dogbodyemail.jpg" alt="imgPet">
                </a>
            </div>
            <div class="btn-container">
                <a href="${process.env.URL_FRONTEND}">Clique aqui para ver</a>
            </div>
        </article>
    </section>
    <section class="footer">
        <section style="flex-basis: 50%; display: flex; align-items: center;">
            <img src="${process.env.URL_API}/images/pets/icongetapet.jpg" alt="icon">
            <h2>Get A Pet</h2>
        </section>
        <section style="flex-basis: 50%; display: flex; align-items: center;">
            <p>Por favor, não responda a este e-mail. Você está recebendo este e-mail porque criou uma conta Get A Pet em www.getapet.tech ou em nosso aplicativo móvel.</p>
        </section>
    </section>
</body>
</html>`

        const to = await User.findById(user._id).select('email')

        Send(to, "Pet Retirado da adoção", Email)

    }

}
