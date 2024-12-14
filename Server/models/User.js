const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  date: { type: String, required: true },
  startTime: { type: Number, required: true }, // Start hour in 24-hour format
  endTime: { type: Number, required: true },   // End hour in 24-hour format
  hours: { type: Number, required: true },
  task: { type: String, required: true },
});

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true, index: true }, // Add index
  password: { type: String, required: true },
  remainingHours: { type: Number, default: 270 },
  logs: [logSchema],
});

module.exports = mongoose.model('User', userSchema);