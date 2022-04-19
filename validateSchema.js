const baseJoi = require('joi');
const sanitizeHTML = require('sanitize-html');

const extension = (joi)=>({
    type: 'string',
    base:joi.string(),
    messages:{
        'string.escapeHTML':"{{#label}} must not include HTMl"
    },
    rules:{
        escapeHTML:{
            validate(value,helpers){
                const clean = sanitizeHTML(value,{
                    allowedTags:[],
                    allowedAttributes:{}
                });
                if(clean!==value){
                    return helpers.error('string.escapeHTML',{value:clean});
                }
                return clean
            }
        }
    }
})

const Joi = baseJoi.extend(extension)

module.exports.placeSchema = Joi.object({
    title:Joi.string().required().escapeHTML(),
    price:Joi.number().required().min(0),
    description:Joi.string().required().escapeHTML(),
    location:Joi.string().required().escapeHTML(),
    deleteImages:Joi.array()
})

module.exports.reviewSchema = Joi.object({
    body:Joi.string().required().escapeHTML(),
    rating:Joi.number().required()
})
