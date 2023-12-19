const Joi = require('joi');

const postCategorySchema = Joi.object({
  name: Joi.string().min(2).max(30).required()
});

const deleteCategorySchema = Joi.object({
  shortId: Joi.string().min(21).max(21).required()
});

module.exports = {postCategorySchema, deleteCategorySchema};