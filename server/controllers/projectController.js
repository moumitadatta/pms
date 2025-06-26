const Project = require('../models/Project');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all projects
// @route   GET /api/v1/projects
// @route   GET /api/v1/users/:userId/projects
// @access  Private
exports.getProjects = asyncHandler(async (req, res, next) => {
  if (req.params.userId) {
    const projects = await Project.find({
      $or: [
        { manager: req.params.userId },
        { teamMembers: req.params.userId },
      ],
    }).populate('manager teamMembers');

    return res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc    Get single project
// @route   GET /api/v1/projects/:id
// @access  Private
exports.getProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id).populate(
    'manager teamMembers'
  );

  if (!project) {
    return next(
      new ErrorResponse(`No project with the id of ${req.params.id}`),
      404
    );
  }

  // Make sure user is project manager or team member
  if (
    project.manager.toString() !== req.user.id &&
    !project.teamMembers.includes(req.user.id)
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to access this project`,
        401
      )
    );
  }

  res.status(200).json({
    success: true,
    data: project,
  });
});

// @desc    Add project
// @route   POST /api/v1/projects
// @access  Private
exports.addProject = asyncHandler(async (req, res, next) => {
  req.body.manager = req.user.id;

  const project = await Project.create(req.body);

  res.status(201).json({
    success: true,
    data: project,
  });
});

// @desc    Update project
// @route   PUT /api/v1/projects/:id
// @access  Private
exports.updateProject = asyncHandler(async (req, res, next) => {
  let project = await Project.findById(req.params.id);

  if (!project) {
    return next(
      new ErrorResponse(`No project with the id of ${req.params.id}`),
      404
    );
  }

  // Make sure user is project manager
  if (project.manager.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this project`,
        401
      )
    );
  }

  project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: project,
  });
});

// @desc    Delete project
// @route   DELETE /api/v1/projects/:id
// @access  Private
exports.deleteProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(
      new ErrorResponse(`No project with the id of ${req.params.id}`),
      404
    );
  }

  // Make sure user is project manager or admin
  if (project.manager.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this project`,
        401
      )
    );
  }

  await project.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});