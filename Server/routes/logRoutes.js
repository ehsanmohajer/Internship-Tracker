const express = require('express');
const User = require('../models/User');
const router = express.Router();

const jwt = require('jsonwebtoken');

// Middleware to verify JWT
function verifyToken(req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Access Denied' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid Token' });
  }
}

// Add middleware to routes
router.post('/:username/logs', verifyToken, async (req, res) => {
  // Route logic
});

// Add a work log
router.post('/:username/logs', async (req, res) => {
  const { username } = req.params;
  const { date, startTime, endTime, hours, task } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });

     // Validate the date is not in the future
     const today = new Date();
     const inputDate = new Date(date);
     
     // Allow only today or past dates
    if (inputDate > today) {
      return res.status(400).json({ message: 'Cannot log work for future dates.' });
    }

    // Find logs for the same date
    const existingLogs = user.logs.filter((log) => log.date === date);

    // Check for overlapping times
    const hasOverlap = existingLogs.some(
      (log) =>
        (startTime >= log.startTime && startTime < log.endTime) || // Start time overlaps
        (endTime > log.startTime && endTime <= log.endTime) ||    // End time overlaps
        (startTime <= log.startTime && endTime >= log.endTime)    // Enveloping range
    );

    if (hasOverlap) {
      return res.status(400).json({ message: 'Time range overlaps with an existing log.' });
    }

    // Add the new log
    user.logs.push({ date, startTime, endTime, hours, task });
    user.remainingHours -= hours;
    await user.save();

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add log' });
  }
});

router.get('/:username/logs', async (req, res) => {
  const { username } = req.params;
  const { page = 1, limit = 10 } = req.query; // Default page = 1, limit = 10
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const startIndex = (page - 1) * limit; // Calculate starting index
    const logs = user.logs.slice(startIndex, startIndex + limit); // Retrieve subset of logs

    res.status(200).json({
      logs,                         // Logs for the current page
      currentPage: page,            // Current page number
      totalLogs: user.logs.length,  // Total logs in the database
      totalPages: Math.ceil(user.logs.length / limit), // Total pages
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

router.put('/:username/logs', async (req, res) => {
  const { username } = req.params;
  const { date, hours, task } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Find the log for the given date
    const logIndex = user.logs.findIndex((log) => log.date === date);
    if (logIndex === -1) {
      return res.status(404).json({ message: 'No log exists for this date.' });
    }

    // Update the log
    user.logs[logIndex] = { date, hours, task };
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update log' });
  }
});

module.exports = router;
