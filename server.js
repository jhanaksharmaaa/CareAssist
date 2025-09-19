const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Route files
const auth = require('./routes/auth');
const patients = require('./routes/patients');
const medications = require('./routes/medications');
const readings = require('./routes/readings');
const aiAnalysis = require('./routes/ai-analysis');

// Middleware
const errorHandler = require('./middleware/errorHandler');

// DB Connection
const connectDB = require('./config/database');
connectDB();

const app = express();

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Enable CORS
app.use(cors());

// Set static folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount routers
app.use('/api/auth', auth);
app.use('/api/patients', patients);
app.use('/api/medications', medications);
app.use('/api/readings', readings);
app.use('/api/ai', aiAnalysis);

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});