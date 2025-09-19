const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  dosage: {
    value: Number,
    unit: String
  },
  frequency: {
    type: String,
    required: true
  },
  schedule: [{
    time: String,
    taken: {
      type: Boolean,
      default: false
    },
    takenAt: Date
  }],
  startDate: {
    type: Date,
    required: true
  },
  endDate: Date,
  prescribedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: String,
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Medication', medicationSchema);