import { User } from '../models/User.js';
import { generateTokenPair } from '../utils/jwt.js';
import { createError } from '../utils/httpError.js';

// POST /api/user/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return next(createError(401, 'Invalid email or password'));
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(createError(401, 'Invalid email or password'));
    }

    const { accessToken, refreshToken } = generateTokenPair(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
      status: 'success',
      data: {
        accessToken,
        refreshToken,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/user/logout
export const logout = async (req, res, next) => {
  try {
    req.user.refreshToken = null;
    await req.user.save();

    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/user/user-info
export const getUserInfo = async (req, res, next) => {
  try {
    res.status(200).json({
      status: 'success',
      data: {
        name: req.user.name,
        email: req.user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};