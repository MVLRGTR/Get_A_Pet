const Send = require('./Nodemailer')

module.exports = class SendEmail {

    static EmailPrimaryLogin(to, token,link) {
        
        const Email = `<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Validação de conta</title>
</head>

<body style="font-family: Helvetica;  min-height: 100vh; max-width: 900px; margin: auto;padding: 0;  ">
    <section style="max-width:900px; height: 95px; background-color: #ffd400; display: flex; justify-content: space-between;">
        <img style="border-radius: 50%; padding: 10px;" src="https://static.vecteezy.com/ti/vetor-gratis/p1/13431434-design-de-logotipo-de-desenho-animado-de-mascote-de-cachorro-fofo-estilo-de-design-plano-vetor.jpg" alt="pets">
        <p style="color: #16479d; font-size: 1.7em;padding-right: 15px; ">Valide sua conta</p>
    </section>

    <section style="display: flex; flex-direction: row; max-width:900px ; margin: auto;">

        <img src="https://img.freepik.com/fotos-premium/golden-retriever-na-floresta_416434-362.jpg" alt="">
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
                <a style="margin: auto; text-decoration: none; color: black; " href="${link}">Clique aqui para acessar sua conta</a>
            </div>
        </article>

    </section>

    <section style="height: 200px; max-width: 900px; background-color: #ffd400; display: flex; justify-content: space-between;">
        <section style="flex-basis: 50%; display: flex; align-items: center;">
            <img style="border-radius: 50%; padding: 10px; height: 80px; width: 80px;" src="https://static.vecteezy.com/ti/vetor-gratis/p1/13431434-design-de-logotipo-de-desenho-animado-de-mascote-de-cachorro-fofo-estilo-de-design-plano-vetor.jpg" alt="pets">
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

    static async EmailForgotPassword(to, token,link) {
        const Email = `<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recuperação de conta</title>
</head>

<body style="font-family: Helvetica;  min-height: 100vh; max-width: 900px; margin: auto;padding: 0;  ">
    <section style="max-width:900px; height: 95px; background-color: #ffd400; display: flex; justify-content: space-between;">
        <img style="border-radius: 50%; padding: 10px;" src="https://static.vecteezy.com/ti/vetor-gratis/p1/13431434-design-de-logotipo-de-desenho-animado-de-mascote-de-cachorro-fofo-estilo-de-design-plano-vetor.jpg" alt="pets">
        <p style="color: #16479d; font-size: 1.7em;padding-right: 15px; ">Recuperação de conta</p>
    </section>

    <section style="display: flex; flex-direction: row; max-width:900px ; margin: auto;">

        <img src="https://img.freepik.com/fotos-premium/golden-retriever-na-floresta_416434-362.jpg" alt="">
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
                <a style="margin: auto; text-decoration: none; color: black; " href="${link}">Clique aqui para recuperar sua conta</a>
            </div>
        </article>

    </section>

    <section style="height: 200px; max-width: 900px; background-color: #ffd400; display: flex; justify-content: space-between;">
        <section style="flex-basis: 50%; display: flex; align-items: center;">
            <img style="border-radius: 50%; padding: 10px; height: 80px; width: 80px;" src="https://static.vecteezy.com/ti/vetor-gratis/p1/13431434-design-de-logotipo-de-desenho-animado-de-mascote-de-cachorro-fofo-estilo-de-design-plano-vetor.jpg" alt="pets">
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

}