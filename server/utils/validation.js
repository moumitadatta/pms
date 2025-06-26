const { check, validationResult } = require('express-validator');

// User validation
exports.validateUser = [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check(
    'password',
    'Please enter a password with 6 or more characters'
  ).isLength({ min: 6 }),
];

// Login validation
exports.validateLogin = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists(),
];

// Project validation
exports.validateProject = [
  check('name', 'Name is required').not().isEmpty(),
  check('startDate', 'Start date is required').not().isEmpty(),
  check('endDate', 'End date is required').not().isEmpty(),
];

// Task validation
exports.validateTask = [
  check('title', 'Title is required').not().isEmpty(),
  check('dueDate', 'Due date is required').not().isEmpty(),
];

// Leave validation
exports.validateLeave = [
  check('startDate', 'Start date is required').not().isEmpty(),
  check('endDate', 'End date is required').not().isEmpty(),
  check('reason', 'Reason is required').not().isEmpty(),
  check('type', 'Type is required').not().isEmpty(),
];

// Timesheet validation
exports.validateTimesheet = [
  check('task', 'Task is required').not().isEmpty(),
  check('hours', 'Hours is required').not().isEmpty(),
  check('date', 'Date is required').not().isEmpty(),
];

// Ticket validation
exports.validateTicket = [
  check('title', 'Title is required').not().isEmpty(),
  check('description', 'Description is required').not().isEmpty(),
  check('category', 'Category is required').not().isEmpty(),
];

// Middleware to handle validation results
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};