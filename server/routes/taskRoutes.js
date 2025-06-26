const express = require('express');
const {
  getTasks,
  getTask,
  addTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(protect, getTasks)
  .post(protect, authorize('admin', 'manager'), addTask);

router
  .route('/:id')
  .get(protect, getTask)
  .put(protect, updateTask)
  .delete(protect, authorize('admin', 'manager'), deleteTask);

module.exports = router;