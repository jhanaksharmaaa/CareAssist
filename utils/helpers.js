const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const getNormalRange = (readingType, demographic = 'adult') => {
  const ranges = {
    blood_pressure: {
      adult: { minSystolic: 90, maxSystolic: 120, minDiastolic: 60, maxDiastolic: 80 },
      senior: { minSystolic: 90, maxSystolic: 140, minDiastolic: 60, maxDiastolic: 90 }
    },
    blood_sugar: {
      fasting: { min: 70, max: 100 },
      random: { min: 70, max: 140 }
    },
    heart_rate: {
      adult: { min: 60, max: 100 },
      athlete: { min: 40, max: 60 }
    },
    oxygen: {
      normal: { min: 95, max: 100 }
    },
    temperature: {
      fahrenheit: { min: 97.8, max: 99.1 },
      celsius: { min: 36.5, max: 37.3 }
    }
  };

  return ranges[readingType] || {};
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

module.exports = { generateToken, getNormalRange, formatDate };