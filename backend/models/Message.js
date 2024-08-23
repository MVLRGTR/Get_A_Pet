const mongoose = require ('../db/connection')
const {Schema} = mongoose

const Message = mongoose.model(
    'Message',
    new Schema({
        message:{
            type:String
        },
        viewed:{
            type:Boolean
        },
        to:Object,
        from:Object
    },{timestamps:true})
)

module.exports = Message