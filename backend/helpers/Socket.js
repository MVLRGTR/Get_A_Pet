//helpers 
const GetUserByToken = require('../helpers/GetUserByToken')

module.exports = class socketController{
    static async newUserCheck(token){
        const user = await GetUserByToken(token)
        if(user){
            const checkUser = [user._id, user.name]
            console.log(`user : ${user}`)
            return checkUser
        }else{
            return false
        }

    }
}