const Timesheet = require('../models/Timesheet');
const Task = require('../models/Task');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all timesheets
// @route   GET /api/v1/timesheets
// @route   GET /api/v1/users/:userId/timesheets
// @access  Private
exports.getTimesheets = asyncHandler(async (req, res, next) => {
  if (req.params.userId) {
    const timesheets = await Timesheet.find({ user: req.params.userId }).populate(
      'user task',
      'name title'
    );

    return res.status(200).json({
      success: true,
      count: timesheets.length,
      data: timesheets,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc    Get single timesheet
// @route   GET /api/v1/timesheets/:id
// @access  Private
exports.getTimesheet = asyncHandler(async (req, res, next) => {
  const timesheet = await Timesheet.findById(req.params.id).populate(
    'user task',
    'name title'
  );

  if (!timesheet) {
    return next(
      new ErrorResponse(`No timesheet with the id of ${req.params.id}`),
      404
    );
  }

  // Make sure user is timesheet owner or admin
  if (
    timesheet.user._id.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to access this timesheet`,
        401
      )
    );
  }

  res.status(200).json({
    success: true,
    data: timesheet,
  });
});

// @desc    Add timesheet
// @route   POST /api/v1/timesheets
// @access  Private
exports.addTimesheet = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;

  // Check if task exists and is assigned to user
  const task = await Task.findById(req.body.task);
  if (!task) {
    return next(
      new ErrorResponse(`No task with the id of ${req.body.task}`),
      404
    );
  }

  if (task.assignedTo.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to log time for this task`,
        401
      )
    );
  }

  const timesheet = await Timesheet.create(req.body);

  res.status(201).json({
    success: true,
    data: timesheet,
  });
});

// @desc    Update timesheet
// @route   PUT /api/v1/timesheets/:id
// @access  Private
exports.updateTimesheet = asyncHandler(async (req, res, next) => {
  let timesheet = await Timesheet.findById(req.params.id);

  if (!timesheet) {
    return next(
      new ErrorResponse(`No timesheet with the id of ${req.params.id}`),
      404
    );
  }

  // Make sure user is timesheet owner or admin
  if (
    timesheet.user.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this timesheet`,
        401
      )
    );
  }

  // Only admin can approve/reject timesheets
  if (req.body.status && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update timesheet status`,
        401
      )
    );
  }

  // Set approvedBy if status is being updated by admin
  if (req.body.status && req.user.role === 'admin') {
    req.body.approvedBy = req.user.id;
  }

  timesheet = await Timesheet.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: timesheet,
  });
});

// @desc    Delete timesheet
// @route   DELETE /api/v1/timesheets/:id
// @access  Private
exports.deleteTimesheet = asyncHandler(async (req, res, next) => {
  const timesheet = await Timesheet.findById(req.params.id);

  if (!timesheet) {
    return next(
      new ErrorResponse(`No timesheet with the id of ${req.params.id}`),
      404
    );
  }

  // Make sure user is timesheet owner or admin
  if (
    timesheet.user.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this timesheet`,
        401
      )
    );
  }

  await timesheet.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Approve/Reject timesheet
// @route   PUT /api/v1/timesheets/:id/approve
// @access  Private/Admin
exports.approveTimesheet = asyncHandler(async (req, res, next) => {
  let timesheet = await Timesheet.findById(req.params.id);

  if (!timesheet) {
    return next(
      new ErrorResponse(`No timesheet with the id of ${req.params.id}`),
      404
    );
  }

  if (!req.body.status) {
    return next(new ErrorResponse('Please provide status', 400));
  }

  timesheet.status = req.body.status;
  timesheet.approvedBy = req.user.id;
  await timesheet.save();

  res.status(200).json({
    success: true,
    data: timesheet,
  });
});