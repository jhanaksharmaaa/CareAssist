const { analyzeReading } = require('../utils/aiService');
const { processMedicalImage } = require('../utils/imageProcessing');

// @desc    Analyze medical reading
// @route   POST /api/ai/analyze
// @access  Private
exports.analyzeReading = async (req, res, next) => {
  try {
    const { type, values } = req.body;
    let imagePath = null;

    // Process image if uploaded
    if (req.file) {
      imagePath = await processMedicalImage(req.file.path);
    }

    // Use AI to analyze the reading
    const analysis = await analyzeReading(type, imagePath, values);

    res.status(200).json({
      success: true,
      data: analysis
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get normal ranges for reading types
// @route   GET /api/ai/ranges
// @access  Private
exports.getNormalRanges = async (req, res, next) => {
  try {
    const ranges = {
      blood_pressure: {
        normal: "Less than 120/80 mmHg",
        elevated: "120-129/<80 mmHg",
        hypertension_stage1: "130-139/80-89 mmHg",
        hypertension_stage2: "140 or higher/90 or higher mmHg",
        hypertensive_crisis: "Higher than 180/120 mmHg"
      },
      blood_sugar: {
        fasting: {
          normal: "70-100 mg/dL",
          prediabetes: "100-125 mg/dL",
          diabetes: "126 mg/dL or higher"
        },
        random: {
          normal: "Below 140 mg/dL",
          prediabetes: "140-199 mg/dL",
          diabetes: "200 mg/dL or higher"
        }
      },
      heart_rate: {
        normal: "60-100 bpm",
        bradycardia: "Below 60 bpm",
        tachycardia: "Above 100 bpm"
      },
      oxygen: {
        normal: "95-100%",
        hypoxemia: "Below 95%",
        severe_hypoxemia: "Below 90%"
      },
      temperature: {
        normal: "97.8°F - 99.1°F (36.5°C - 37.3°C)",
        fever: "Above 100.4°F (38°C)",
        hypothermia: "Below 95°F (35°C)"
      }
    };

    res.status(200).json({
      success: true,
      data: ranges
    });
  } catch (err) {
    next(err);
  }
};