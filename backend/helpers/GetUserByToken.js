const jwt = require('jsonwebtoken')
const User =  require('../models/User')

const GetUserByToken = async (token)=>{
    if(!token){
        return res.status(401).json({message:"Acesso Negado !!!"})
    }
    try{
        const decoded = jwt.verify(token,'meutokenjwt')
        // const UserId = decoded.id
        const user = await User.findById({_id:decoded.id}).select('_id name email img phone')
        return user 
    }catch(erro) {
        console.log(erro)
        const user = ''
        return user
    }

}

module.exports = GetUserByToken