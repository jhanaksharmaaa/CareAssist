const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Create test directory if it doesn't exist
const testDir = path.join(__dirname, 'test-images');
if (!fs.existsSync(testDir)) {
  fs.mkdirSync(testDir, { recursive: true });
}

console.log('Testing Sharp image processing...\n');

// Test 1: Basic image processing
async function testBasicProcessing() {
  console.log('1. Testing basic image processing...');
  
  try {
    // Create a simple test image programmatically
    const width = 200;
    const height = 200;
    const channels = 4; // RGBA
    
    // Create a buffer with a simple gradient
    const buffer = Buffer.alloc(width * height * channels);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * channels;
        buffer[index] = Math.floor((x / width) * 255);     // R
        buffer[index + 1] = Math.floor((y / height) * 255); // G
        buffer[index + 2] = 128;                           // B
        buffer[index + 3] = 255;                           // A
      }
    }
    
    // Process with sharp
    const outputPath = path.join(testDir, 'test-gradient.png');
    await sharp(buffer, { raw: { width, height, channels } })
      .resize(400, 400)
      .jpeg({ quality: 90 })
      .toFile(outputPath);
    
    console.log('✓ Basic processing test passed');
    return true;
  } catch (error) {
    console.log('✗ Basic processing test failed:', error.message);
    return false;
  }
}

// Test 2: Medical image simulation (BP monitor, glucose meter, etc.)
async function testMedicalImageSimulation() {
  console.log('2. Testing medical image simulation...');
  
  try {
    // Create a simulated blood pressure monitor display
    const width = 300;
    const height = 150;
    
    // Create a buffer for the image
    const svgImage = `
    <svg width="${width}" height="${height}">
      <rect width="100%" height="100%" fill="#000"/>
      <text x="150" y="50" font-family="Arial" font-size="20" fill="#00FF00" text-anchor="middle">BP: 120/80 mmHg</text>
      <text x="150" y="80" font-family="Arial" font-size="16" fill="#FFFFFF" text-anchor="middle">Pulse: 72 bpm</text>
      <text x="150" y="110" font-family="Arial" font-size="12" fill="#CCCCCC" text-anchor="middle">Date: ${new Date().toLocaleDateString()}</text>
    </svg>
    `;
    
    const outputPath = path.join(testDir, 'simulated-bp-meter.jpg');
    const buffer = Buffer.from(svgImage);
    
    await sharp(buffer)
      .resize(600, 300)
      .jpeg({ quality: 95 })
      .toFile(outputPath);
    
    console.log('✓ Medical image simulation test passed');
    return true;
  } catch (error) {
    console.log('✗ Medical image simulation test failed:', error.message);
    return false;
  }
}

// Test 3: Image enhancement for OCR/analysis
async function testImageEnhancement() {
  console.log('3. Testing image enhancement...');
  
  try {
    // Create a low contrast test image
    const width = 200;
    const height = 200;
    const channels = 3; // RGB
    
    const buffer = Buffer.alloc(width * height * channels);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * channels;
        const value = 100 + Math.sin(x / 10) * 30; // Low contrast pattern
        buffer[index] = value;     // R
        buffer[index + 1] = value; // G
        buffer[index + 2] = value; // B
      }
    }
    
    const outputPath = path.join(testDir, 'enhanced-image.jpg');
    await sharp(buffer, { raw: { width, height, channels } })
      .normalize() // Enhance contrast
      .sharpen()   // Sharpen image
      .gamma()     // Apply gamma correction
      .jpeg({ quality: 90 })
      .toFile(outputPath);
    
    console.log('✓ Image enhancement test passed');
    return true;
  } catch (error) {
    console.log('✗ Image enhancement test failed:', error.message);
    return false;
  }
}

// Test 4: Multiple format support
async function testFormatSupport() {
  console.log('4. Testing multiple format support...');
  
  try {
    const width = 100;
    const height = 100;
    const channels = 3;
    
    const buffer = Buffer.alloc(width * height * channels);
    for (let i = 0; i < width * height * channels; i++) {
      buffer[i] = Math.random() * 256;
    }
    
    // Test JPEG
    await sharp(buffer, { raw: { width, height, channels } })
      .jpeg({ quality: 80 })
      .toFile(path.join(testDir, 'test-format.jpg'));
    
    // Test PNG
    await sharp(buffer, { raw: { width, height, channels } })
      .png({ compressionLevel: 6 })
      .toFile(path.join(testDir, 'test-format.png'));
    
    // Test WebP
    try {
      await sharp(buffer, { raw: { width, height, channels } })
        .webp({ quality: 80 })
        .toFile(path.join(testDir, 'test-format.webp'));
    } catch (e) {
      console.log('WebP not supported in this environment');
    }
    
    console.log('✓ Multiple format support test passed');
    return true;
  } catch (error) {
    console.log('✗ Multiple format support test failed:', error.message);
    return false;
  }
}

// Test 5: Metadata extraction
async function testMetadataExtraction() {
  console.log('5. Testing metadata extraction...');
  
  try {
    // Create a test image first
    const testImagePath = path.join(testDir, 'metadata-test.jpg');
    await sharp({
      create: {
        width: 100,
        height: 100,
        channels: 3,
        background: { r: 255, g: 0, b: 0 }
      }
    })
    .jpeg()
    .toFile(testImagePath);
    
    // Extract metadata
    const metadata = await sharp(testImagePath).metadata();
    
    console.log('Image metadata:', {
      format: metadata.format,
      width: metadata.width,
      height: metadata.height,
      size: metadata.size ? `${Math.round(metadata.size / 1024)} KB` : 'Unknown'
    });
    
    console.log('✓ Metadata extraction test passed');
    return true;
  } catch (error) {
    console.log('✗ Metadata extraction test failed:', error.message);
    return false;
  }
}

// Test 6: Error handling
async function testErrorHandling() {
  console.log('6. Testing error handling...');
  
  try {
    // Try to process a non-image file
    const nonImageBuffer = Buffer.from('This is not an image file');
    
    await sharp(nonImageBuffer)
      .jpeg()
      .toFile(path.join(testDir, 'should-not-exist.jpg'));
    
    console.log('✗ Error handling test failed - should have thrown an error');
    return false;
  } catch (error) {
    console.log('✓ Error handling test passed - correctly rejected invalid image');
    return true;
  }
}

// Run all tests
async function runAllTests() {
  console.log('Running Sharp image processing tests...\n');
  
  const results = await Promise.all([
    testBasicProcessing(),
    testMedicalImageSimulation(),
    testImageEnhancement(),
    testFormatSupport(),
    testMetadataExtraction(),
    testErrorHandling()
  ]);
  
  const passed = results.filter(result => result).length;
  const total = results.length;
  
  console.log(`\nTests completed: ${passed}/${total} passed`);
  
  if (passed === total) {
    console.log('🎉 All Sharp tests passed! Your image processing setup is working correctly.');
    console.log(`Test images saved to: ${testDir}`);
  } else {
    console.log('❌ Some tests failed. Check the errors above.');
  }
}

// Run the tests
runAllTests().catch(console.error);