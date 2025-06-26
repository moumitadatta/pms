const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

exports.protect = async (req, res, next) => {
  let token;

  // Extract token from Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // 🛑 Token not found
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route - token missing', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Decoded token:", decoded); // <-- Add this

    req.user = await User.findById(decoded.id).select('-password'); // Always exclude password
    if (!req.user) {
      return next(new ErrorResponse('User not found with this token', 404));
    }

    next();
  } catch (err) {
    console.error("❌ JWT verification failed:", err.message);
    return next(new ErrorResponse('Not authorized to access this route - invalid token', 401));
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