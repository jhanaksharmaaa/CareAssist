const Medication = require('../models/Medication');
const { sendMedicationReminder } = require('../utils/notifications');

// @desc    Get all medications
// @route   GET /api/medications
// @access  Private
exports.getMedications = async (req, res, next) => {
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
    query = Medication.find(JSON.parse(queryStr)).populate('patient').populate('prescribedBy');

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
    const total = await Medication.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const medications = await query;

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
      count: medications.length,
      pagination,
      data: medications
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single medication
// @route   GET /api/medications/:id
// @access  Private
exports.getMedication = async (req, res, next) => {
  try {
    const medication = await Medication.findById(req.params.id)
      .populate('patient')
      .populate('prescribedBy');

    if (!medication) {
      return res.status(404).json({
        success: false,
        message: 'Medication not found'
      });
    }

    res.status(200).json({
      success: true,
      data: medication
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create medication
// @route   POST /api/medications
// @access  Private
exports.createMedication = async (req, res, next) => {
  try {
    // Add prescribedBy to req.body
    req.body.prescribedBy = req.user.id;

    const medication = await Medication.create(req.body);

    res.status(201).json({
      success: true,
      data: medication
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update medication
// @route   PUT /api/medications/:id
// @access  Private
exports.updateMedication = async (req, res, next) => {
  try {
    let medication = await Medication.findById(req.params.id);

    if (!medication) {
      return res.status(404).json({
        success: false,
        message: 'Medication not found'
      });
    }

    medication = await Medication.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: medication
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete medication
// @route   DELETE /api/medications/:id
// @access  Private
exports.deleteMedication = async (req, res, next) => {
  try {
    const medication = await Medication.findById(req.params.id);

    if (!medication) {
      return res.status(404).json({
        success: false,
        message: 'Medication not found'
      });
    }

    await medication.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Mark medication as taken
// @route   PUT /api/medications/:id/taken
// @access  Private
exports.markAsTaken = async (req, res, next) => {
  try {
    const { doseIndex } = req.body;
    const medication = await Medication.findById(req.params.id);

    if (!medication) {
      return res.status(404).json({
        success: false,
        message: 'Medication not found'
      });
    }

    if (doseIndex !== undefined && medication.schedule[doseIndex]) {
      medication.schedule[doseIndex].taken = true;
      medication.schedule[doseIndex].takenAt = new Date();
    }

    await medication.save();

    res.status(200).json({
      success: true,
      data: medication
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get medications for a specific patient
// @route   GET /api/patients/:patientId/medications
// @access  Private
exports.getPatientMedications = async (req, res, next) => {
  try {
    const medications = await Medication.find({ patient: req.params.patientId })
      .populate('prescribedBy')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: medications.length,
      data: medications
    });
  } catch (err) {
    next(err);
  }
};