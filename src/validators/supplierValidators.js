import Joi from 'joi';

export const createSupplierSchema = Joi.object({
  name: Joi.string().min(1).required().messages({
    'any.required': 'Name is required',
  }),
  address: Joi.string().allow('').optional(),
  company: Joi.string().allow('').optional(),
  deliveryDate: Joi.date().optional(),
  amount: Joi.number().min(0).required().messages({
    'any.required': 'Amount is required',
  }),
  status: Joi.string().valid('Active', 'Deactive').default('Active'),
});

export const updateSupplierSchema = Joi.object({
  name: Joi.string().min(1).optional(),
  address: Joi.string().allow('').optional(),
  company: Joi.string().allow('').optional(),
  deliveryDate: Joi.date().optional(),
  amount: Joi.number().min(0).optional(),
  status: Joi.string().valid('Active', 'Deactive').optional(),
}).min(1).messages({
  'object.min': 'At least one field must be provided to update',
});