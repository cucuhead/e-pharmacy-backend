import { createError } from '../utils/httpError.js';

export const validateBody = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const message = error.details.map((d) => d.message).join(', ');
    return next(createError(400, message));
  }
  req.body = value;
  next();
};