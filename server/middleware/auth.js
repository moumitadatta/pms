const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

exports.protect = async (req, res, next) => {
  let token;

  // Check multiple token sources
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    console.error('No token found in headers or cookies');
    return next(new ErrorResponse('Not authorized', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check token expiration manually
    const now = Date.now().valueOf() / 1000;
    if (typeof decoded.exp !== 'undefined' && decoded.exp < now) {
      throw new Error('Token expired');
    }

    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user) {
      throw new Error('User not found');
    }

    next();
  } catch (err) {
    console.error(`JWT Error: ${err.message}`);
    return next(new ErrorResponse('Not authorized', 401));
  }
};


exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};