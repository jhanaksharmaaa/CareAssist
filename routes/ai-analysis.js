const express = require('express');
const {
  analyzeReading,
  getNormalRanges
} = require('../controllers/aiController');

const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/analyze', protect, upload.single('image'), analyzeReading);
router.get('/ranges', protect, getNormalRanges);

module.exports = router;