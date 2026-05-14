import { User } from '../models/User.js';
import { verifyAccessToken } from '../utils/jwt.js';
import { createError } from '../utils/httpError.js';

export const authenticate = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return next(createError(401, 'Authorization token is missing'));
    }

    const token = header.slice(7);
    let payload;
    try {
      payload = verifyAccessToken(token);
    } catch {
      return next(createError(401, 'Invalid or expired token'));
    }

    const user = await User.findById(payload.userId);
    if (!user) {
      return next(createError(401, 'User not found'));
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};