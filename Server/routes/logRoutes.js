const express = require('express');
const User = require('../models/User');

const router = express.Router();

// Add a work log
router.post('/:username/logs', async (req, res) => {
  const { username } = req.params;
  const { date, hours, task } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.logs.push({ date, hours, task });
    user.remainingHours -= hours;
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add log' });
  }
});

// Get all logs for a user
router.get('/:username/logs', async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user.logs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

module.exports = router;