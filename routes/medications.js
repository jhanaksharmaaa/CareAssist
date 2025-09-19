const express = require('express');
const {
  getMedications,
  getMedication,
  createMedication,
  updateMedication,
  deleteMedication,
  markAsTaken,
  getPatientMedications
} = require('../controllers/medicationController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(protect, getMedications)
  .post(protect, authorize('healthcare_professional', 'admin'), createMedication);

router.route('/:id')
  .get(protect, getMedication)
  .put(protect, authorize('healthcare_professional', 'admin'), updateMedication)
  .delete(protect, authorize('healthcare_professional', 'admin'), deleteMedication);

router.put('/:id/taken', protect, markAsTaken);

router.get('/patient/:patientId', protect, getPatientMedications);

module.exports = router;