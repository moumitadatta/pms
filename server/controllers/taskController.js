const Task = require('../models/Task');
const Project = require('../models/Project');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all tasks
// @route   GET /api/v1/tasks
// @route   GET /api/v1/projects/:projectId/tasks
// @access  Private
exports.getTasks = asyncHandler(async (req, res, next) => {
  if (req.params.projectId) {
    const tasks = await Task.find({ project: req.params.projectId }).populate(
      'project assignedTo assignedBy'
    );

    return res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } else if (req.params.userId) {
    const tasks = await Task.find({ assignedTo: req.params.userId }).populate(
      'project assignedTo assignedBy'
    );

    return res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc    Get single task
// @route   GET /api/v1/tasks/:id
// @access  Private
exports.getTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id).populate(
    'project assignedTo assignedBy'
  );

  if (!task) {
    return next(
      new ErrorResponse(`No task with the id of ${req.params.id}`),
      404
    );
  }

  // Make sure user is task assignee or project manager
  if (
    task.assignedTo.toString() !== req.user.id &&
    task.assignedBy.toString() !== req.user.id
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to access this task`,
        401
      )
    );
  }

  res.status(200).json({
    success: true,
    data: task,
  });
});

// @desc    Add task
// @route   POST /api/v1/projects/:projectId/tasks
// @access  Private
exports.addTask = asyncHandler(async (req, res, next) => {
  req.body.project = req.params.projectId;
  req.body.assignedBy = req.user.id;

  const project = await Project.findById(req.params.projectId);

  if (!project) {
    return next(
      new ErrorResponse(`No project with the id of ${req.params.projectId}`),
      404
    );
  }

  // Make sure user is project manager
  if (project.manager.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to add tasks to this project`,
        401
      )
    );
  }

  const task = await Task.create(req.body);

  res.status(201).json({
    success: true,
    data: task,
  });
});

// @desc    Update task
// @route   PUT /api/v1/tasks/:id
// @access  Private
exports.updateTask = asyncHandler(async (req, res, next) => {
  let task = await Task.findById(req.params.id);

  if (!task) {
    return next(
      new ErrorResponse(`No task with the id of ${req.params.id}`),
      404
    );
  }

  // Make sure user is task assignee or project manager
  if (
    task.assignedTo.toString() !== req.user.id &&
    task.assignedBy.toString() !== req.user.id
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this task`,
        401
      )
    );
  }

  task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: task,
  });
});

// @desc    Delete task
// @route   DELETE /api/v1/tasks/:id
// @access  Private
exports.deleteTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return next(
      new ErrorResponse(`No task with the id of ${req.params.id}`),
      404
    );
  }

  // Make sure user is project manager or admin
  if (task.assignedBy.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this task`,
        401
      )
    );
  }

  await task.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});