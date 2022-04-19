const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDNAME,
    api_key:process.env.CLOUDAPIKEY,
    api_secret:process.env.CLOUDAPISECRET
})

const storage = new CloudinaryStorage({
    cloudinary,
    params:{
        folder:"BonFire",
        allowedFormats:['jpeg','png','jpg','heic']
    }
})

module.exports ={
    cloudinary,
    storage
}