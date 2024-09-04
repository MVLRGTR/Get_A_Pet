const jwt = require('jsonwebtoken')
const GetToken = require('../helpers/GetToken')

const CheckToken = (req, res, next) => {

    try {
        // console.log(`authorization ${req.headers.authorization}`)
        if (!req.headers.authorization) {
            return res.status(401).json({ message: "Acesso Negado !!!" })
        }

        const Token = GetToken(req)

        if (!Token) {
            return res.status(401).json({ message: "Acesso Negado !!!" })
        }
        const verify = jwt.verify(Token, 'meutokenjwt')
        req.user = verify
        next()
    } catch (erro) {
        console.log(`Erro :${erro}`)
        return res.status(401).json({ message: "Token Inválido !!!" })
    }
}

module.exports = CheckToken