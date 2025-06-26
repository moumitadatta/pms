const Ticket = require('../models/Ticket');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all tickets
// @route   GET /api/v1/tickets
// @route   GET /api/v1/users/:userId/tickets
// @access  Private
exports.getTickets = asyncHandler(async (req, res, next) => {
  if (req.params.userId) {
    const tickets = await Ticket.find({
      $or: [
        { raisedBy: req.params.userId },
        { assignedTo: req.params.userId },
      ],
    }).populate('raisedBy assignedTo', 'name email');

    return res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc    Get single ticket
// @route   GET /api/v1/tickets/:id
// @access  Private
exports.getTicket = asyncHandler(async (req, res, next) => {
  const ticket = await Ticket.findById(req.params.id).populate(
    'raisedBy assignedTo',
    'name email'
  );

  if (!ticket) {
    return next(
      new ErrorResponse(`No ticket with the id of ${req.params.id}`),
      404
    );
  }

  // Make sure user is ticket owner, assigned to, or admin
  if (
    ticket.raisedBy._id.toString() !== req.user.id &&
    (ticket.assignedTo && ticket.assignedTo._id.toString() !== req.user.id) &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to access this ticket`,
        401
      )
    );
  }

  res.status(200).json({
    success: true,
    data: ticket,
  });
});

// @desc    Create ticket
// @route   POST /api/v1/tickets
// @access  Private
exports.createTicket = asyncHandler(async (req, res, next) => {
  req.body.raisedBy = req.user.id;

  const ticket = await Ticket.create(req.body);

  res.status(201).json({
    success: true,
    data: ticket,
  });
});

// @desc    Update ticket
// @route   PUT /api/v1/tickets/:id
// @access  Private
exports.updateTicket = asyncHandler(async (req, res, next) => {
  let ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    return next(
      new ErrorResponse(`No ticket with the id of ${req.params.id}`),
      404
    );
  }

  // Make sure user is ticket owner, assigned to, or admin
  if (
    ticket.raisedBy.toString() !== req.user.id &&
    (ticket.assignedTo && ticket.assignedTo.toString() !== req.user.id) &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this ticket`,
        401
      )
    );
  }

  ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: ticket,
  });
});

// @desc    Delete ticket
// @route   DELETE /api/v1/tickets/:id
// @access  Private
exports.deleteTicket = asyncHandler(async (req, res, next) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    return next(
      new ErrorResponse(`No ticket with the id of ${req.params.id}`),
      404
    );
  }

  // Make sure user is ticket owner or admin
  if (
    ticket.raisedBy.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this ticket`,
        401
      )
    );
  }

  await ticket.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Assign ticket
// @route   PUT /api/v1/tickets/:id/assign
// @access  Private/Admin
exports.assignTicket = asyncHandler(async (req, res, next) => {
  let ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    return next(
      new ErrorResponse(`No ticket with the id of ${req.params.id}`),
      404
    );
  }

  if (!req.body.assignedTo) {
    return next(new ErrorResponse('Please provide assignedTo', 400));
  }

  ticket.assignedTo = req.body.assignedTo;
  ticket.status = 'in progress';
  await ticket.save();

  res.status(200).json({
    success: true,
    data: ticket,
  });
});

// @desc    Resolve ticket
// @route   PUT /api/v1/tickets/:id/resolve
// @access  Private
exports.resolveTicket = asyncHandler(async (req, res, next) => {
  let ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    return next(
      new ErrorResponse(`No ticket with the id of ${req.params.id}`),
      404
    );
  }

  // Make sure user is assigned to the ticket or admin
  if (
    (ticket.assignedTo && ticket.assignedTo.toString() !== req.user.id) &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to resolve this ticket`,
        401
      )
    );
  }

  if (!req.body.resolutionNotes) {
    return next(new ErrorResponse('Please provide resolution notes', 400));
  }

  ticket.resolutionNotes = req.body.resolutionNotes;
  ticket.status = 'resolved';
  await ticket.save();

  res.status(200).json({
    success: true,
    data: ticket,
  });
});