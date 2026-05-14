import { User } from '../models/User.js';

import { createError } from '../utils/httpError.js';
import { verifyRefreshToken, generateTokenPair } from '../utils/jwt.js';
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
// POST /api/user/refresh
export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      return next(createError(401, 'Invalid or expired refresh token'));
    }

    const user = await User.findById(payload.userId);
    if (!user) {
      return next(createError(401, 'User not found'));
    }

    // Stored token user'da kayıtlı mı? (logout sonrası null oluyordu)
    if (user.refreshToken !== refreshToken) {
      return next(createError(401, 'Refresh token does not match'));
    }

    // Yeni token çifti üret (rotation — eskisi geçersiz olur)
    const tokens = generateTokenPair(user);
    user.refreshToken = tokens.refreshToken;
    await user.save();

    res.status(200).json({
      status: 'success',
      data: tokens,
    });
  } catch (error) {
    next(error);
  }
};