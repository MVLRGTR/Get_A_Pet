const jwt = require('jsonwebtoken')
const GetToken = require('../helpers/GetToken')

const CheckToken =(req,res,next)=>{
    console.log(`authorization ${req.headers.authorization}`)
    if(!req.headers.authorization){
        return res.status(401).json({message:"Acesso Negado !!!"})
    }

    const Token = GetToken(req)

    if(!Token){
        return res.status(401).json({message:"Acesso Negado !!!"})
    }
    
    try{
        const verify = jwt.verify(Token,'meutokenjwt')
        req.user = verify
        next()
    }catch(erro){
        return res.status(401).json({message:"Token Inválido !!!"})
    }
}

module.exports = CheckToken