const Send = require('./Nodemailer')

module.exports = class SendEmail {

    static EmailPrimaryLogin(to, token) {
        const Email = `<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Validation</title>
</head>

<body style="font-family: Helvetica; display: flex; flex-direction: column; background-color: darkgray; justify-content: space-between; min-height: 100vh; margin: 0; ">
    <section style="width: 100vw; height: 90px; background-color: #ffd400; display: flex;">
        <p style="color: #16479d; font-weight: bolder; font-size: 1.7em; margin: auto;">Bem vindo ao Get A Pet</p>
    </section>

    <section
        style="margin: auto; border: 1px solid black; width: 280px; height: 260px; padding: 10px; border-radius: 5%; display: flex; flex-direction: column; background-color: #ffd400;">
        <div style="display: flex; flex-direction: row; margin: auto;">
            <img src="https://images.unsplash.com/photo-1507146426996-ef05306b995a?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8fA%3D%3D" style="width: 70px; height: 70px; border-radius: 10px;" alt="Toughts">
            <p style="font-weight: bolder; font-size: 1.5em; margin-left: 20px; color: #16479d;">Get A Pet</p>
        </div>

        <article style="margin: auto; font-family: Helvetica; font-family: Helvetica; font-size: larger; ">
            <p style="color: #16479d; font-weight: bolder;">O valor do seu Token :</p>
            <div style="border: 1px solid #16479d; border-radius: 20px; width: 180px; height: 30px; display: flex; align-items: center; justify-content: center;">
                <p style="margin: 0; color: #16479d;">${token}</p>
            </div>
        </article>
    </section>

    <section style="margin: auto; font-family: Helvetica; font-size: large; font-weight:700;">
        <p>Acesse o site onde está hospedado o Toughts geralmente <a href="http://localhost:3000/loginprimary">localhost:3000/loginprimary</a> e coloque o token Informado</p>
    </section>

    <section style="width: 100vw; height: 90px; background-color: #ffd400; display: flex; ">
        <p style="color: #16479d; font-weight: bolder; font-size: 1.7em; margin: auto;">Adote um pet e seja feliz</p>
    </section>

</body>
</html>`

        Send(to, "E-mail de Validação", Email)
        if (Send.messageId != undefined) {
            console.log('Erro ao Processar envio do E-mail')
            return
        }
        console.log(`E-mail enviado com sucesso !!!`)
    }

    static EmailForgotPassword(to, token) {
        const Email = `<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Validation</title>
</head>
<body style="font-family: Helvetica; display: flex; flex-direction: column; background-color: darkgray; justify-content: space-between; min-height: 100vh; margin: 0; ">
    <section style="width: 100vw; height: 90px; background-color: black; display: flex;">
        <p style="color: #f6982d; font-weight: bolder; font-size: 1.7em; margin: auto;">Recuperando sua senha</p>
    </section>
    <section
        style="margin: auto; border: 1px solid black; width: 280px; height: 260px; padding: 10px; border-radius: 5%; display: flex; flex-direction: column; background-color: black;">
        <div style="display: flex; flex-direction: row; margin: auto;">
            <img src="https://webassets.honeygain.com/uploads/2022/12/23110428/133idea-300x300.png" style="width: 70px; height: 70px;" alt="Toughts">
            <p style="font-weight: bolder; font-size: 1.5em; margin-left: 20px; color: #f6982d;">Toughts</p>
        </div>

        <article style="margin: auto; font-family: Helvetica; font-family: Helvetica; font-size: larger; ">
            <p style="color: #f6982d; font-weight: bolder;">O valor do seu Token :</p>
            <div style="border: 1px solid #f6982d; border-radius: 20px; width: 180px; height: 30px; display: flex; align-items: center; justify-content: center;">
                <p style="margin: 0; color: #f6982d;">${token}</p>
            </div>
        </article>
    </section>
    <section style="margin: auto; font-family: Helvetica; font-size: large; font-weight:700;">
        <p>Acesse o site onde está hospedado o Toughts geralmente <a href="localhost:3000/loginprimary">http://localhost:3000/forgotpasswordcheck</a> e coloque o token Informado</p>
    </section>

    <section style="width: 100vw; height: 90px; background-color: black; display: flex; ">
        <p style="color: #f6982d; font-weight: bolder; font-size: 1.7em; margin: auto;">Seja feliz e exponha seus Pensamentos</p>
    </section>
</body>
</html>`
        Send(to, "Recuperação de Senha", Email)
        if (Send.messageId != undefined) {
            console.log('Erro ao Processar envio do E-mail')
            return
        }
        console.log(`E-mail enviado com sucesso !!!`)

    }

}