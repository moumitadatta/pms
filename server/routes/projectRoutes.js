const express = require('express');
const {
  getProjects,
  getProject,
  addProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(protect, getProjects)
  .post(protect, authorize('admin', 'manager'), addProject);

router
  .route('/:id')
  .get(protect, getProject)
  .put(protect, authorize('admin', 'manager'), updateProject)
  .delete(protect, authorize('admin', 'manager'), deleteProject);

module.exports = router;