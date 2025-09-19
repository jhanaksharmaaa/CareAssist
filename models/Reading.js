const mongoose = require('mongoose');

const readingSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  type: {
    type: String,
    enum: ['blood_pressure', 'blood_sugar', 'heart_rate', 'oxygen', 'temperature'],
    required: true
  },
  value: {
    systolic: Number, // For blood pressure
    diastolic: Number, // For blood pressure
    reading: Number, // For single value readings
    unit: String
  },
  notes: String,
  image: String, // Path to uploaded image
  status: {
    type: String,
    enum: ['normal', 'warning', 'critical'],
    default: 'normal'
  },
  recordedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Add index for better query performance
readingSchema.index({ patient: 1, type: 1, createdAt: -1 });

module.exports = mongoose.model('Reading', readingSchema);