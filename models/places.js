const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Reviews = require('./reviews')

const imageSchema = new Schema({
    
    url:String,
    filename:String
        
})

imageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200')
})

const placesSchema = new Schema({
    title:String,
    images:[ 
        imageSchema
    ],
    geometry:{
        type:{
            type:String,
            enum:['Point'],
            required:true,
        },
        coordinates:{
            type:[Number],
            required:true
        }
    },
    price:Number,
    description:String, 
    location:String,
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    reviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Review"
    }]
})



module.exports = mongoose.model("Place", placesSchema)
