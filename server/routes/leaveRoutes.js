const Holiday = require('../models/Holiday');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all holidays
// @route   GET /api/v1/holidays
// @access  Public
exports.getHolidays = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single holiday
// @route   GET /api/v1/holidays/:id
// @access  Public
exports.getHoliday = asyncHandler(async (req, res, next) => {
  const holiday = await Holiday.findById(req.params.id);

  if (!holiday) {
    return next(
      new ErrorResponse(`No holiday with the id of ${req.params.id}`),
      404
    );
  }

  res.status(200).json({
    success: true,
    data: holiday,
  });
});

// @desc    Add holiday
// @route   POST /api/v1/holidays
// @access  Private/Admin
exports.addHoliday = asyncHandler(async (req, res, next) => {
  const holiday = await Holiday.create(req.body);

  res.status(201).json({
    success: true,
    data: holiday,
  });
});

// @desc    Update holiday
// @route   PUT /api/v1/holidays/:id
// @access  Private/Admin
exports.updateHoliday = asyncHandler(async (req, res, next) => {
  let holiday = await Holiday.findById(req.params.id);

  if (!holiday) {
    return next(
      new ErrorResponse(`No holiday with the id of ${req.params.id}`),
      404
    );
  }

  holiday = await Holiday.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: holiday,
  });
});

// @desc    Delete holiday
// @route   DELETE /api/v1/holidays/:id
// @access  Private/Admin
exports.deleteHoliday = asyncHandler(async (req, res, next) => {
  const holiday = await Holiday.findById(req.params.id);

  if (!holiday) {
    return next(
      new ErrorResponse(`No holiday with the id of ${req.params.id}`),
      404
    );
  }

  await holiday.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});