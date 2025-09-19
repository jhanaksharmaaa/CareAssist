const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const processMedicalImage = async (imagePath) => {
  try {
    // Create processed image directory if it doesn't exist
    const processedDir = path.join(__dirname, '../uploads/processed');
    if (!fs.existsSync(processedDir)) {
      fs.mkdirSync(processedDir, { recursive: true });
    }

    // Generate output path
    const ext = path.extname(imagePath);
    const baseName = path.basename(imagePath, ext);
    const outputPath = path.join(processedDir, `${baseName}-processed${ext}`);

    // Process image with sharp (enhance for better OCR/analysis)
    await sharp(imagePath)
      .resize(800) // Resize to a manageable size
      .normalize() // Normalize brightness and contrast
      .sharpen() // Sharpen the image
      .toFile(outputPath);

    return outputPath;
  } catch (error) {
    console.error('Error processing image:', error);
    throw new Error('Image processing failed');
  }
};

module.exports = { processMedicalImage };