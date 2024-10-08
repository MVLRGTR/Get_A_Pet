const mongoose = require ('../db/connection')
const {Schema} = mongoose

const User = mongoose.model(
    'User',
    new Schema({
        name : {
            type:String,
            require : true
        },
        email:{
            type:String,
            require: true
        },
        password:{
            type : String,
            require: true
        },
        img:{
            type:String
        },
        phone:{
            type:String,
            require:true
        },
        primaryLogin:{
            type:Boolean,
            require:true
        },
        token:{
            type:Number
        },
        receiveremail:{
            type:Boolean,
            default:'true'
        },
        address:Object,
        favoritepets:Array
    },{timestamps:true}) //Isso serve para saber a criação e edição do dado no banco
)

module.exports = User