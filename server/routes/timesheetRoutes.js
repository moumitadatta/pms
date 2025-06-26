const express = require('express');
const {
  getTimesheets,
  getTimesheet,
  addTimesheet,
  updateTimesheet,
  deleteTimesheet,
  approveTimesheet,
} = require('../controllers/timesheetController');

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(protect, getTimesheets)
  .post(protect, addTimesheet);

router
  .route('/:id')
  .get(protect, getTimesheet)
  .put(protect, updateTimesheet)
  .delete(protect, deleteTimesheet);

router.route('/:id/approve').put(protect, authorize('admin'), approveTimesheet);

module.exports = router;