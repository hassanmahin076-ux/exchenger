const sharp = require('sharp');
const path = require('path');

async function processImage() {
  const inputPath = path.join(__dirname, 'picture', 'ChatGPT Image Jul 30, 2026, 05_50_38 PM.png');
  const outputPath = path.join(__dirname, 'public', 'deposit-hero.png');

  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Iterate over RGBA pixels and make white/near-white transparent smoothly
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Check if pixel is white or near white
    const brightness = (r + g + b) / 3;
    if (r > 235 && g > 235 && b > 235) {
      data[i + 3] = 0; // Completely transparent
    } else if (r > 200 && g > 200 && b > 200) {
      // Smooth alpha transition for soft edges
      const alpha = Math.max(0, Math.min(255, (255 - brightness) * 4));
      data[i + 3] = Math.floor(alpha);
    }
  }

  await sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4
    }
  })
  .png()
  .toFile(outputPath);

  console.log('Successfully generated transparent PNG at:', outputPath);
}

processImage().catch(console.error);
