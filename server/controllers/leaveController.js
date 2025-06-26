const Leave = require('../models/Leave');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all leaves
// @route   GET /api/v1/leaves
// @route   GET /api/v1/users/:userId/leaves
// @access  Private
exports.getLeaves = asyncHandler(async (req, res, next) => {
  if (req.params.userId) {
    const leaves = await Leave.find({ user: req.params.userId }).populate(
      'user approvedBy',
      'name email'
    );

    return res.status(200).json({
      success: true,
      count: leaves.length,
      data: leaves,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc    Get single leave
// @route   GET /api/v1/leaves/:id
// @access  Private
exports.getLeave = asyncHandler(async (req, res, next) => {
  const leave = await Leave.findById(req.params.id).populate(
    'user approvedBy',
    'name email'
  );

  if (!leave) {
    return next(
      new ErrorResponse(`No leave with the id of ${req.params.id}`),
      404
    );
  }

  // Make sure user is leave owner or admin
  if (leave.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to access this leave`,
        401
      )
    );
  }

  res.status(200).json({
    success: true,
    data: leave,
  });
});

// @desc    Apply for leave
// @route   POST /api/v1/leaves
// @access  Private
exports.applyLeave = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;

  const leave = await Leave.create(req.body);

  res.status(201).json({
    success: true,
    data: leave,
  });
});

// @desc    Update leave
// @route   PUT /api/v1/leaves/:id
// @access  Private
exports.updateLeave = asyncHandler(async (req, res, next) => {
  let leave = await Leave.findById(req.params.id);

  if (!leave) {
    return next(
      new ErrorResponse(`No leave with the id of ${req.params.id}`),
      404
    );
  }

  // Make sure user is leave owner or admin
  if (leave.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this leave`,
        401
      )
    );
  }

  // Only admin can approve/reject leaves
  if (req.body.status && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update leave status`,
        401
      )
    );
  }

  // Set approvedBy if status is being updated by admin
  if (req.body.status && req.user.role === 'admin') {
    req.body.approvedBy = req.user.id;
  }

  leave = await Leave.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: leave,
  });
});

// @desc    Delete leave
// @route   DELETE /api/v1/leaves/:id
// @access  Private
exports.deleteLeave = asyncHandler(async (req, res, next) => {
  const leave = await Leave.findById(req.params.id);

  if (!leave) {
    return next(
      new ErrorResponse(`No leave with the id of ${req.params.id}`),
      404
    );
  }

  // Make sure user is leave owner or admin
  if (leave.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this leave`,
        401
      )
    );
  }

  await leave.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Approve/Reject leave
// @route   PUT /api/v1/leaves/:id/approve
// @access  Private/Admin
exports.approveLeave = asyncHandler(async (req, res, next) => {
  let leave = await Leave.findById(req.params.id);

  if (!leave) {
    return next(
      new ErrorResponse(`No leave with the id of ${req.params.id}`),
      404
    );
  }

  if (!req.body.status) {
    return next(new ErrorResponse('Please provide status', 400));
  }

  leave.status = req.body.status;
  leave.approvedBy = req.user.id;
  await leave.save();

  res.status(200).json({
    success: true,
    data: leave,
  });
});