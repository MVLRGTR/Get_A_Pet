const GetToken = (req)=>{
    const AuthToken = req.headers.authorization
    const Token = AuthToken.split(" ")[1] // pegando a segunda parte do token
    return Token
}

module.exports = GetToken