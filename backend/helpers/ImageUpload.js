const multer = require('multer')
const path = require('path')

//Destination to store the images

const ImageStorages = multer.diskStorage({
    destination: function (req,file,cb){
        let folder = ''
        // console.log(`req.body : ${JSON.stringify(req.body)} req.baseUrl : ${req.baseUrl}  file : ${JSON.stringify(file)}`)
        if(req.baseUrl.includes('users')){
            folder = 'users'
        }else if(req.baseUrl.includes('pets')){
            folder = 'pets'
        }

        cb(null,`public/images/${folder}`)
    },
    filename: function (req,file,cb){
        cb(null,Date.now()+String(Math.floor(Math.random()*100))+path.extname(file.originalname)) //Junto o nome original do arquivo mais a data atual do upload do arquivo
    }
})

const ImageUpload = multer({
    storage: ImageStorages,
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(png|jpg)$/)) { //verificação da extensão do arquivo
            return cb(new Error('Por favor envie apenas JPG ou PNG !!!'))
        }
        cb(undefined,true) 
    }
})

module.exports = {ImageUpload}