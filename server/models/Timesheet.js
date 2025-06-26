const mongoose = require('mongoose');

const TimesheetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  task: {
    type: mongoose.Schema.ObjectId,
    ref: 'Task',
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  hours: {
    type: Number,
    required: true,
    min: 0.5,
    max: 24,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  approvedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Timesheet', TimesheetSchema);