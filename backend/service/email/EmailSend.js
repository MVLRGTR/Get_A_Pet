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
</head>

<body style="font-family: Helvetica;  min-height: 100vh; max-width: 900px; margin: auto;padding: 0;  ">
    <section style="max-width:900px; height: 95px; background-color: #ffd400; display: flex; justify-content: space-between;">
        <img style="border-radius: 50%; padding: 10px;" src="${process.env.URL_API}/images/pets/icongetapet.jpg" alt="icon">
        <p style="color: #16479d; font-size: 1.7em;padding-right: 15px; ">Valide sua conta</p>
    </section>

    <section style="display: flex; flex-direction: row; max-width:900px ; margin: auto;">

        <img src="${process.env.URL_API}/images/pets/dogbodyemail.jpg" alt="dog">
        <article style="padding-left: 10px; display: flex; flex-direction: column; background-color: #85731d79;">
            <h2 style="margin: auto;">Bem-vindo(a) ao Get A Pet! 🐾</h2>
            <p style="line-height: 1.8;">Ficamos muito felizes em tê-lo(a) conosco em nossa comunidade de amantes dos animais! Agora você pode explorar e conhecer os pets disponíveis para adoção, salvar seus favoritos e muito mais.
            Para acessar sua conta e aproveitar todos os recursos da plataforma, utilize o token de autenticação abaixo:
            </p>
            <div style="display: flex; padding-top: 20px;">
                <p style="margin: auto;">
                    <strong>${token}</strong>
                </p>
            </div>
            <div style="display: flex; width: 320px; height: 50px; background-color: #ffd400; margin: auto; border-radius: 10px; ">
                <a style="margin: auto; text-decoration: none; color: black; " href="${process.env.URL_FRONTEND}/login/primarylogin">Clique aqui para acessar sua conta</a>
            </div>
        </article>

    </section>

    <section style="height: 200px; max-width: 900px; background-color: #ffd400; display: flex; justify-content: space-between;">
        <section style="flex-basis: 50%; display: flex; align-items: center;">
            <img style="border-radius: 50%; padding: 10px; height: 80px; width: 80px;" src="${process.env.URL_API}/images/pets/icongetapet.jpg" alt="icon">
            <h2>Get A Pet</h2>
        </section>
        <section style="flex-basis: 50%; display: flex; align-items: center;">
            <p style="line-height: 1.8;">Por favor, não responda a este e-mail. Você está recebendo este e-mail porque criou uma conta Get A Pet em www.getapet.tech ou em nosso aplicativo móvel.</p>
        </section>
    </section>

</body>
</html>`

        Send(to, "E-mail de Validação", Email)
        console.log(`E-mail enviado com sucesso !!!`)
    }

    static async EmailForgotPassword(to,token) {
        const Email = `<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recuperação de conta</title>
</head>

<body style="font-family: Helvetica;  min-height: 100vh; max-width: 900px; margin: auto;padding: 0;  ">
    <section style="max-width:900px; height: 95px; background-color: #ffd400; display: flex; justify-content: space-between;">
        <img style="border-radius: 50%; padding: 10px;" src="${process.env.URL_API}/images/pets/icongetapet.jpg">
        <p style="color: #16479d; font-size: 1.7em;padding-right: 15px; ">Recuperação de conta</p>
    </section>

    <section style="display: flex; flex-direction: row; max-width:900px ; margin: auto;">

        <img src="${process.env.URL_API}/images/pets/dogbodyemail.jpg" alt="dog">
        <article style="padding-left: 10px; display: flex; flex-direction: column; background-color: #85731d79;">
            <h2 style="margin: auto;">Recupere  sua conta do Get A Pet! 🐾</h2>
            <p style="line-height: 1.8;">Estamos prontos para ajudá-lo(a) a voltar a utilizar sua conta na nossa plataforma. Para recuperar sua conta e aproveitar todos os recursos que o Get A Pet tem para  oferece a você, utilize o token de recuperação abaixo:    
            </p>
            <div style="display: flex; padding-top: 20px;">
                <p style="margin: auto;">
                    <strong>${token}</strong>
                </p>
            </div>
            <div style="display: flex; width: 320px; height: 50px; background-color: #ffd400; margin: auto; border-radius: 10px; ">
                <a style="margin: auto; text-decoration: none; color: black; " href="${process.env.URL_FRONTEND}/forgotpassword">Clique aqui para recuperar sua conta</a>
            </div>
        </article>

    </section>

    <section style="height: 200px; max-width: 900px; background-color: #ffd400; display: flex; justify-content: space-between;">
        <section style="flex-basis: 50%; display: flex; align-items: center;">
            <img style="border-radius: 50%; padding: 10px; height: 80px; width: 80px;" src="${process.env.URL_API}/images/pets/icongetapet.jpg" alt="icon">
            <h2>Get A Pet</h2>
        </section>
        <section style="flex-basis: 50%; display: flex; align-items: center;">
            <p style="line-height: 1.8;">Por favor, não responda a este e-mail. Você está recebendo este e-mail porque criou uma conta Get A Pet em www.getapet.tech ou em nosso aplicativo móvel.</p>
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
</head>

<body style="font-family: Helvetica;  min-height: 100vh; max-width: 900px; margin: auto;padding: 0;  ">
    <section style="max-width:900px; height: 95px; background-color: #ffd400; display: flex; justify-content: space-between;">
        <img style="border-radius: 50%; padding: 10px;" src="${process.env.URL_API}/images/pets/icongetapet.jpg">
        <p style="color: #16479d; font-size: 1.7em;padding-right: 15px; ">Temos um novo pet disponível </p>
    </section>

    <section style="display: flex; flex-direction: row; max-width:900px ; margin: auto;">

        <img src="${process.env.URL_API}/images/pets/dogbodyemail.jpg" alt="dog">
        <article style="padding-left: 10px; display: flex; flex-direction: column; background-color: #85731d79;">
            <h2 style="margin: auto;">${pet.name} 🐾</h2>
            <p style="line-height: 1.8;">Esse novo amigo peludo está esperando por você! Acabamos de adicionar esse pet adorável em nossa plataforma, pronto para encontrar um lar cheio de amor.
                Não perca a chance de conhecer esse novo companheiro e dar a ele uma nova casa. Clique no Link abaixo e venha conhecer o novo pet!
            </p>
            <div style="display: flex; padding-top: 20px; justify-content: center; align-items: center;">
                <a href="${process.env.URL_FRONTEND}/pets/${pet._id}">
                    <img style="width: 150px; height: 150px; border-radius: 50%; margin: auto;" src="${process.env.URL_API}/images/pets/${pet.images[0]}" alt="petadopter">
                </a>
            </div>
            <div style="display: flex; width: 320px; height: 50px; background-color: #ffd400; margin: auto; border-radius: 10px; ">
                <a style="margin: auto; text-decoration: none; color: black; " href="${process.env.URL_FRONTEND}/pets/${pet._id}"><strong>Conheça o novo Pet</strong></a>
            </div>
        </article>

    </section>

    <section style="height: 200px; max-width: 900px; background-color: #ffd400; display: flex; justify-content: space-between;">
        <section style="flex-basis: 50%; display: flex; align-items: center;">
            <img style="border-radius: 50%; padding: 10px; height: 80px; width: 80px;" src="${process.env.URL_API}/images/pets/icongetapet.jpg" alt="icon">
            <h2>Get A Pet</h2>
        </section>
        <section style="flex-basis: 50%; display: flex; align-items: center;">
            <p style="line-height: 1.8;">Por favor, não responda a este e-mail. Você está recebendo este e-mail porque criou uma conta Get A Pet em www.getapet.tech ou em nosso aplicativo móvel.</p>
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
                </head>
                <body style="font-family: Helvetica;  min-height: 100vh; max-width: 900px; margin: auto;padding: 0;  ">
                    <section style="max-width:900px; height: 95px; background-color: #ffd400; display: flex; justify-content: space-between;">
                        <img style="border-radius: 50%; padding: 10px;" src="${process.env.URL_API}/images/pets/icongetapet.jpg">
                        <p style="color: #16479d; font-size: 1.7em;padding-right: 15px; ">Nova Mensagem</p>
                    </section>
                    <section style="display: flex; flex-direction: row; max-width:900px ; margin: auto;">
                        <img src="${process.env.URL_API}/images/pets/dogbodyemail.jpg" alt="dog">
                        <article style="padding-left: 10px; display: flex; flex-direction: column; background-color: #85731d79; flex-grow: 1;">
                            <h2 style="margin: auto;">Você tem uma nova menssagem de ${userFrom.name}</h2>
                            <div style="display: flex; padding-top: 20px; justify-content: center; align-items: center;">
                                <a href="${process.env.URL_FRONTEND}/messages/${userFrom._id}>
                                    <img style="width: 150px; height: 150px; border-radius: 50%; margin: auto;" src="${process.env.URL_API}/images/users/${userFrom.img}" alt="imgUser">
                                </a>
                            </div>
                            <div style="display: flex; width: 320px; height: 50px; background-color: #ffd400; margin: auto; border-radius: 10px; ">
                                <a style="margin: auto; text-decoration: none; color: black; " href="${process.env.URL_FRONTEND}/messages/${userFrom._id}">Clique aqui para ver</a>
                            </div>
                        </article>
                    </section>
                    <section style="height: 200px; max-width: 900px; background-color: #ffd400; display: flex; justify-content: space-between;">
                        <section style="flex-basis: 50%; display: flex; align-items: center;">
                            <img style="border-radius: 50%; padding: 10px; height: 80px; width: 80px;" src="${process.env.URL_API}/images/pets/icongetapet.jpg" alt="icon">
                            <h2>Get A Pet</h2>
                        </section>
                        <section style="flex-basis: 50%; display: flex; align-items: center;">
                            <p style="line-height: 1.8;">Por favor, não responda a este e-mail. Você está recebendo este e-mail porque criou uma conta Get A Pet em www.getapet.tech ou em nosso aplicativo móvel.</p>
                        </section>
                    </section>
                </body>
                </html>`
    
                // console.log(`Enviando e-mail para ${user.email}, mensagem de ${userFrom.name}`)
                await Send(user.email, "Nova mensagem", Email)
            }))

            // console.log(`Finalizado para usuário: ${user.email}`)
        }
    }
}
