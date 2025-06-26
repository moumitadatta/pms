// models/Attendance.js
const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  clockIn: {
    type: Date,
  },
  clockOut: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'half-day', 'on-leave'],
    default: 'absent',
  },
  notes: {
    type: String,
  },
});

module.exports = mongoose.model('Attendance', AttendanceSchema);