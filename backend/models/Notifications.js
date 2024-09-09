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
            type:String,
        },
        type:{
            type:String
        },
        link:{
            type:String
        },
    },{timestamps:true})
)

module.exports = Notifications