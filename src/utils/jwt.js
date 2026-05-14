import jwt from 'jsonwebtoken';

const getSecrets = () => {
  const accessSecret = process.env.JWT_ACCESS_SECRET;
  const refreshSecret = process.env.JWT_REFRESH_SECRET;
  if (!accessSecret || !refreshSecret) {
    throw new Error('JWT secrets are not defined in .env');
  }
  return {
    accessSecret,
    refreshSecret,
    accessExpires: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpires: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  };
};

export const generateAccessToken = (payload) => {
  const { accessSecret, accessExpires } = getSecrets();
  return jwt.sign(payload, accessSecret, { expiresIn: accessExpires });
};

export const generateRefreshToken = (payload) => {
  const { refreshSecret, refreshExpires } = getSecrets();
  return jwt.sign(payload, refreshSecret, { expiresIn: refreshExpires });
};

export const verifyAccessToken = (token) => {
  const { accessSecret } = getSecrets();
  return jwt.verify(token, accessSecret);
};

export const verifyRefreshToken = (token) => {
  const { refreshSecret } = getSecrets();
  return jwt.verify(token, refreshSecret);
};

export const generateTokenPair = (user) => {
  const payload = { userId: user._id.toString(), email: user.email };
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};