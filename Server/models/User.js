// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//   username: String,
//   password: String,
//   remainingHours: Number,
//   logs: [
//     {
//       date: String,
//       hours: Number,
//       task: String,
//     },
//   ],
// });

// module.exports = mongoose.model("User", userSchema);


const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  remainingHours: Number,
  logs: [
    {
      date: String,
      hours: Number,
      task: String,
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
