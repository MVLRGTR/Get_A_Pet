const mongoose = require ('../db/connection')
const {Schema} = mongoose

const Pet = mongoose.model(
    'Pet',
    new Schema({
        name : {
            type:String,
            require : true
        },
        age:{
            type:Number,
            require: true
        },
        weight:{
            type:Number,
            require:true
        },
        color:{
            type:String,
            require:true
        },
        images:{
            type:Array,
            require:true
        },
        available:{
            type:Boolean
        },
        user:Object,
        adopter:Object
    },{timestamps:true}) //Isso serve para saber a criação e edição do dado no banco
)

module.exports = Pet