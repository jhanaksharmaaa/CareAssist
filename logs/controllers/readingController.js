const Reading = require('../models/Reading');
const Patient = require('../models/Patient');
const { analyzeReading } = require('../utils/aiService');
const { processMedicalImage } = require('../utils/imageProcessing');
const { sendCriticalAlert } = require('../utils/notifications');

// @desc    Get all readings
// @route   GET /api/readings
// @access  Private
exports.getReadings = async (req, res, next) => {
  try {
    let query;

    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding resource
    query = Reading.find(JSON.parse(queryStr))
      .populate('patient')
      .populate('recordedBy');

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Reading.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const readings = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: readings.length,
      pagination,
      data: readings
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single reading
// @route   GET /api/readings/:id
// @access  Private
exports.getReading = async (req, res, next) => {
  try {
    const reading = await Reading.findById(req.params.id)
      .populate('patient')
      .populate('recordedBy');

    if (!reading) {
      return res.status(404).json({
        success: false,
        message: 'Reading not found'
      });
    }

    res.status(200).json({
      success: true,
      data: reading
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create reading
// @route   POST /api/readings
// @access  Private
exports.createReading = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.recordedBy = req.user.id;

    let processedImagePath = null;
    
    // Process image if uploaded
    if (req.file) {
      processedImagePath = await processMedicalImage(req.file.path);
      req.body.image = processedImagePath;
    }

    // Use AI to analyze the reading
    const analysis = await analyzeReading(req.body.type, processedImagePath, req.body.value);
    
    // Add analysis results to reading
    req.body.status = analysis.status;
    if (req.body.value) {
      req.body.value = { ...req.body.value, ...analysis.values };
    } else {
      req.body.value = analysis.values;
    }
    req.body.notes = analysis.notes;

    const reading = await Reading.create(req.body);

    // If reading is critical, send alert
    if (analysis.status === 'critical') {
      const patient = await Patient.findById(req.body.patient).populate('doctor');
      // In a real implementation, you would get healthcare professionals to notify
      // For now, we'll just log it
      console.log(`CRITICAL READING ALERT for patient: ${patient._id}`);
    }

    res.status(201).json({
      success: true,
      data: reading
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get readings for a specific patient
// @route   GET /api/patients/:patientId/readings
// @access  Private
exports.getPatientReadings = async (req, res, next) => {
  try {
    const readings = await Reading.find({ patient: req.params.patientId })
      .populate('recordedBy')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: readings.length,
      data: readings
    });
  } catch (err) {
    next(err);
  }
};