const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  date: { type: String, required: true },
  hours: { type: Number, required: true },
  task: { type: String, required: true },
});

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  remainingHours: { type: Number, default: 270 },
  logs: [logSchema],
});

module.exports = mongoose.model('User', userSchema);