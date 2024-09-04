const GetToken = (req)=>{
    try{
        const AuthToken = req.headers.authorization
        const Token = AuthToken.split(" ")[1] // pegando a segunda parte do token
        return Token
    }catch{
        const token = ''
        return token
    }
}

module.exports = GetToken