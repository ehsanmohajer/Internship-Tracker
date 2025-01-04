const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  description: { type: String, required: true },
  assignedTo: { type: String, default: null },
  progress: { type: Number, default: 0 }
});

module.exports = mongoose.model('Task', taskSchema);
