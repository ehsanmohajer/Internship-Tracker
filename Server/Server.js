// const express = require("express");
// const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// require("dotenv").config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// const userRoutes = require("./routes/userRoutes");

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());

// // Connect to MongoDB
// mongoose
//   .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.log(err));

// // Routes
// app.use("/api", userRoutes);

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());

// // Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => console.log("MongoDB connected"))
//   .catch(err => console.log(err));

// // Define a User Schema
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

// const User = mongoose.model("User", userSchema);

// // API Endpoints
// app.post("/api/add-log", async (req, res) => {
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
// // app.post("/api/register", async (req, res) => {
// //   const { username, password } = req.body;
// //   try {
// //     const newUser = new User({ username, password, remainingHours: 270, logs: [] });
// //     await newUser.save();
// //     res.status(201).json(newUser);
// //   } catch (err) {
// //     res.status(500).json({ error: "Error creating user" });
// //   }
// // });

// // app.get("/api/users", async (req, res) => {
// //   try {
// //     const users = await User.find();
// //     res.json(users);
// //   } catch (err) {
// //     res.status(500).json({ error: "Error fetching users" });
// //   }
// // });

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Routes
app.use("/api/users", userRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
