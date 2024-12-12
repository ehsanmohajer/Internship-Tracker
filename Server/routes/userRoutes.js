// const express = require("express");
// const User = require("../models/User");

// const router = express.Router();

// // Register User
// router.post("/register", async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     const newUser = new User({ username, password, remainingHours: 270, logs: [] });
//     await newUser.save();
//     res.status(201).json(newUser);
//   } catch (err) {
//     res.status(500).json({ error: "Error creating user" });
//   }
// });

// // Fetch Users
// router.get("/users", async (req, res) => {
//   try {
//     const users = await User.find();
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ error: "Error fetching users" });
//   }
// });

// // Add Work Log
// router.post("/add-log", async (req, res) => {
//   const { username, log } = req.body;
//   try {
//     const user = await User.findOne({ username });
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     user.logs.push(log);
//     user.remainingHours -= log.hours;
//     await user.save();

//     res.status(200).json(user);
//   } catch (err) {
//     res.status(500).json({ error: "Error saving log" });
//   }
// });

// module.exports = router;


const express = require("express");
const User = require("../models/User");

const router = express.Router();

// Register User
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ error: "User already exists" });

    const newUser = new User({ username, password, remainingHours: 270, logs: [] });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: "Error creating user" });
  }
});

// Fetch All Users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: "Error fetching users" });
  }
});

// Add Log
router.post("/addLog", async (req, res) => {
  const { username, log } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (new Date(log.date) > new Date()) {
      return res.status(400).json({ error: "Cannot add logs for future dates" });
    }

    user.logs.push(log);
    user.remainingHours -= log.hours;
    await user.save();
    res.status(200).json(user.logs);
  } catch (err) {
    res.status(500).json({ error: "Error adding log" });
  }
});

// Delete User
router.delete("/:username", async (req, res) => {
  try {
    const deletedUser = await User.findOneAndDelete({ username: req.params.username });
    if (!deletedUser) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ message: `User ${req.params.username} deleted.` });
  } catch (err) {
    res.status(500).json({ error: "Error deleting user" });
  }
});

module.exports = router;
