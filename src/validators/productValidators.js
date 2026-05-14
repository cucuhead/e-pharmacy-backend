import Joi from 'joi';

export const createProductSchema = Joi.object({
  photo: Joi.string().uri().allow('').optional(),
  name: Joi.string().min(1).required().messages({
    'any.required': 'Name is required',
  }),
  suppliers: Joi.string().allow('').optional(),
  stock: Joi.number().integer().min(0).required().messages({
    'any.required': 'Stock is required',
    'number.min': 'Stock must be 0 or greater',
  }),
  price: Joi.number().min(0).required().messages({
    'any.required': 'Price is required',
    'number.min': 'Price must be 0 or greater',
  }),
  category: Joi.string().required().messages({
    'any.required': 'Category is required',
  }),
});

// Update: tüm alanlar opsiyonel ama en az biri verilmeli
export const updateProductSchema = Joi.object({
  photo: Joi.string().uri().allow('').optional(),
  name: Joi.string().min(1).optional(),
  suppliers: Joi.string().allow('').optional(),
  stock: Joi.number().integer().min(0).optional(),
  price: Joi.number().min(0).optional(),
  category: Joi.string().optional(),
}).min(1).messages({
  'object.min': 'At least one field must be provided to update',
});