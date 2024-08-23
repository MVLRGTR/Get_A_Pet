const jwt = require('jsonwebtoken')
const User =  require('../models/User')

const GetUserByToken = async (token)=>{
    if(!token){
        return res.status(401).json({message:"Acesso Negado !!!"})
    }
    const decoded = jwt.verify(token,'meutokenjwt')
    // const UserId = decoded.id
    const user = await User.findById({_id:decoded.id}).select('_id name img phone')
    return user

}

module.exports = GetUserByToken