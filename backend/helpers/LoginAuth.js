const User = require('../models/User')
const bcrypt = require('bcrypt')

module.exports = class LoginAuth {

    static async LoginAuthentication(email, password) {

        let EmailOk = false
        let PasswordOk = false

        const Userdb = await User.findOne({ email: email })

        if (!Userdb) {
            return {
                validation: false,
                email: EmailOk
            }
        } else {
            EmailOk = true
        }

        PasswordOk = await bcrypt.compareSync(password, Userdb.password)
        console.log(`Valor do PasswordOk : ${PasswordOk}`)

        if (PasswordOk) {
            return {
                validation: true,
                email: EmailOk,
                password: PasswordOk,
                Userdb: Userdb
            }
        } else {
            return {
                validation: false,
                email: EmailOk,
                password: PasswordOk,
            }
        }

    }
}