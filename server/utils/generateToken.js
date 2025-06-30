const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = '30m';

  console.log('JWT_SECRET:', secret); // Check if undefined
  console.log('expiresIn:', expiresIn);

  if (!secret) throw new Error('JWT_SECRET is not defined');

  return jwt.sign({ id: userId }, secret, { expiresIn });
};

const generateRefreshToken = (userId) => {
  const refreshSecret = process.env.JWT_REFRESH_SECRET;
  const refreshExpiresIn = '7d';

  console.log('JWT_REFRESH_SECRET:', refreshSecret); // Check if undefined
  console.log('refreshExpiresIn:', refreshExpiresIn);

  if (!refreshSecret) throw new Error('JWT_REFRESH_SECRET is not defined');

  return jwt.sign({ id: userId }, refreshSecret, { expiresIn: refreshExpiresIn });
};

module.exports = { generateToken, generateRefreshToken };
