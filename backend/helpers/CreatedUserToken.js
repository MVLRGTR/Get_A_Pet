const jwt = require('jsonwebtoken')

const CreateUserToken = async (user,req,res)=>{
    const token = jwt.sign({
        name: user.name,
        id:   user._id
    },'meutokenjwt')

    res.status(200).json({
        message :"Você está autenticado",
        token:token,
        userId:user._id
    })
}

module.exports = CreateUserToken