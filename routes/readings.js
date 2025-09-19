const express = require('express');
const {
  getReadings,
  getReading,
  createReading,
  getPatientReadings
} = require('../controllers/readingController');

const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.route('/')
  .get(protect, getReadings)
  .post(protect, upload.single('image'), createReading);

router.route('/:id')
  .get(protect, getReading);

router.route('/patient/:patientId')
  .get(protect, getPatientReadings);

module.exports = router;