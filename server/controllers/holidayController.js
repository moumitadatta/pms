// controllers/holidayController.js

const Holiday = require('../models/Holiday');

// @desc    Get all holidays
// @route   GET /api/holidays
// @access  Public
exports.getHolidays = async (req, res, next) => {
  try {
    const holidays = await Holiday.find();
    res.status(200).json(holidays);
  } catch (err) {
    next(err);
  }
};

// @desc    Get single holiday
// @route   GET /api/holidays/:id
// @access  Public
exports.getHoliday = async (req, res, next) => {
  try {
    const holiday = await Holiday.findById(req.params.id);
    if (!holiday) {
      return res.status(404).json({ success: false });
    }
    res.status(200).json(holiday);
  } catch (err) {
    next(err);
  }
};

// @desc    Add holiday
// @route   POST /api/holidays
// @access  Private/Admin
exports.addHoliday = async (req, res, next) => {
  try {
    const holiday = await Holiday.create(req.body);
    res.status(201).json(holiday);
  } catch (err) {
    next(err);
  }
};

// @desc    Update holiday
// @route   PUT /api/holidays/:id
// @access  Private/Admin
exports.updateHoliday = async (req, res, next) => {
  try {
    const holiday = await Holiday.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!holiday) {
      return res.status(404).json({ success: false });
    }
    res.status(200).json(holiday);
  } catch (err) {
    next(err);
  }
};

// @desc    Delete holiday
// @route   DELETE /api/holidays/:id
// @access  Private/Admin
exports.deleteHoliday = async (req, res, next) => {
  try {
    const holiday = await Holiday.findByIdAndDelete(req.params.id);
    if (!holiday) {
      return res.status(404).json({ success: false });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};

// @desc    Get holidays in date range
// @route   GET /api/holidays/range
// @access  Public
exports.getHolidaysInRange = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const holidays = await Holiday.find({
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    });
    res.status(200).json(holidays);
  } catch (err) {
    next(err);
  }
};