const Attendance = require('../models/Attendance');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Clock in
// @route   POST /api/v1/attendance/clockin
// @access  Private
exports.clockIn = asyncHandler(async (req, res, next) => {
  // Check if user already clocked in today
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existingAttendance = await Attendance.findOne({
    user: req.user.id,
    date: { $gte: today },
  });

  if (existingAttendance) {
    return next(new ErrorResponse('You have already clocked in today', 400));
  }

  const attendance = await Attendance.create({
    user: req.user.id,
    clockIn: Date.now(),
    status: 'present',
  });

  res.status(200).json({
    success: true,
    data: attendance,
  });
});

// @desc    Clock out
// @route   PUT /api/v1/attendance/clockout
// @access  Private
exports.clockOut = asyncHandler(async (req, res, next) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const attendance = await Attendance.findOne({
    user: req.user.id,
    date: { $gte: today },
    clockOut: { $exists: false },
  });

  if (!attendance) {
    return next(new ErrorResponse('You have not clocked in today', 400));
  }

  attendance.clockOut = Date.now();
  await attendance.save();

  res.status(200).json({
    success: true,
    data: attendance,
  });
});

// @desc    Get my attendance
// @route   GET /api/v1/attendance/me
// @access  Private
exports.getMyAttendance = asyncHandler(async (req, res, next) => {
  const attendance = await Attendance.find({ user: req.user.id }).sort({
    date: -1,
  });

  res.status(200).json({
    success: true,
    count: attendance.length,
    data: attendance,
  });
});

// @desc    Get all attendance
// @route   GET /api/v1/attendance
// @access  Private/Admin
exports.getAttendance = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get attendance by user
// @route   GET /api/v1/attendance/user/:userId
// @access  Private/Admin
exports.getAttendanceByUser = asyncHandler(async (req, res, next) => {
  const attendance = await Attendance.find({ user: req.params.userId }).sort({
    date: -1,
  });

  res.status(200).json({
    success: true,
    count: attendance.length,
    data: attendance,
  });
});

// @desc    Update attendance
// @route   PUT /api/v1/attendance/:id
// @access  Private/Admin
exports.updateAttendance = asyncHandler(async (req, res, next) => {
  let attendance = await Attendance.findById(req.params.id);

  if (!attendance) {
    return next(
      new ErrorResponse(`No attendance with the id of ${req.params.id}`),
      404
    );
  }

  attendance = await Attendance.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: attendance,
  });
});