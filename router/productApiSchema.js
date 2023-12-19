const Joi = require('joi');

const getProductSchema = Joi.object({
  shortId: Joi.string().min(21).max(21)
});


const postProductSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  price: Joi.number().required(),
  company: Joi.string().min(1).max(20).required(), 
  description: Joi.string(),
  img: Joi.string().uri(),
  categoryShortId: Joi.string().min(21).max(21).required()
});

const deleteProductSchema = Joi.object({
  shortId: Joi.string().min(21).max(21)
})

module.exports = {getProductSchema, postProductSchema, deleteProductSchema};