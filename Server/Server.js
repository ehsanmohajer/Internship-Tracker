require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const logRoutes = require('./routes/logRoutes');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
// mongoose
// // .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
// .connect(process.env.MONGO_URI)
//   .then(() => console.log("Connecting to MongoDB at:", process.env.MONGO_URI.split('@')[1]))
//   .catch((err) => {
//     console.error('Failed to connect to MongoDB:', err.message);
//     process.exit(1); // Exit the process on failure
//   });
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err.message));


// Routes
app.use('/api/users', userRoutes);
app.use('/api/logs', logRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
