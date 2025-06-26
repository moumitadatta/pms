const express = require('express');
const {
  clockIn,
  clockOut,
  getMyAttendance,
  getAttendance,
  getAttendanceByUser,
  updateAttendance,
} = require('../controllers/attendanceController');

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../middleware/auth');

router.route('/clockin').post(protect, clockIn);
router.route('/clockout').put(protect, clockOut);
router.route('/me').get(protect, getMyAttendance);
router.route('/').get(protect, authorize('admin'), getAttendance);
router.route('/user/:userId').get(protect, authorize('admin'), getAttendanceByUser);
router.route('/:id').put(protect, authorize('admin'), updateAttendance);

module.exports = router;