const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a project name'],
  },
  description: {
    type: String,
  },
  startDate: {
    type: Date,
    required: [true, 'Please add a start date'],
  },
  endDate: {
    type: Date,
    required: [true, 'Please add an end date'],
  },
  status: {
    type: String,
    enum: ['not started', 'in progress', 'completed', 'on hold'],
    default: 'not started',
  },
  manager: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  teamMembers: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Project', ProjectSchema);