const mongoose = require ('../db/connection')
const {Schema} = mongoose

const Notifications = mongoose.model(
    'Notifications',
    new Schema({
        message:{
            type:String,
            require:true
        },
        viewed:{
            type:Boolean,
            default:false,
        },
        to:{
            type:String,
            default:'all'
        },
        userviewed:{
            type:Array
        },
        image:{
            type:Array,
        },
        type:{
            type:String
        },
        link:{
            type:String
        },
        emailnotification:{
            type:Boolean,
            default:'false'
        },
    },{timestamps:true})
)

module.exports = Notifications