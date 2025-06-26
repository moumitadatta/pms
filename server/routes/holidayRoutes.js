const express = require('express');
const {
  getHolidays,
  getHoliday,
  addHoliday,
  updateHoliday,
  deleteHoliday,
  getHolidaysInRange
} = require('../controllers/holidayController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getHolidays);
router.get('/range', getHolidaysInRange);
router.get('/:id', getHoliday);

// Protected admin routes
router.post('/', protect, authorize('admin'), addHoliday);
router.put('/:id', protect, authorize('admin'), updateHoliday);
router.delete('/:id', protect, authorize('admin'), deleteHoliday);

module.exports = router;