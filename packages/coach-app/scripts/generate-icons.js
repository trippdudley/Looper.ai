#!/usr/bin/env node
/**
 * Generate app icon and splash screen assets for Looper Coach.
 *
 * Creates minimal branded assets using Canvas API (via @napi-rs/canvas or sharp).
 * For production, replace these with designer-created assets.
 *
 * Usage: node scripts/generate-icons.js
 *
 * Alternatively, generate manually:
 *   - icon.png: 1024x1024, dark bg (#0C1117), "L" wordmark in accent green (#10B981)
 *   - splash.png: 1284x2778 (iPhone 14 Pro Max), same brand treatment
 *   - adaptive-icon.png: 1024x1024 with safe zone padding
 *   - favicon.png: 48x48
 */

const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, '..', 'assets');

// Simple PNG generator — creates a minimal 1-color PNG
// This produces valid PNG files without any dependencies
function createPNG(width, height, r, g, b) {
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 2; // color type (RGB)
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdr = createChunk('IHDR', ihdrData);

  // IDAT chunk — raw image data with zlib
  const rawSize = (width * 3 + 1) * height;
  const rawData = Buffer.alloc(rawSize);
  for (let y = 0; y < height; y++) {
    const rowStart = y * (width * 3 + 1);
    rawData[rowStart] = 0; // filter: none
    for (let x = 0; x < width; x++) {
      const px = rowStart + 1 + x * 3;
      rawData[px] = r;
      rawData[px + 1] = g;
      rawData[px + 2] = b;
    }
  }

  // Simple zlib wrapper (stored, no compression — works for small icons)
  const zlib = require('zlib');
  const compressed = zlib.deflateSync(rawData);
  const idat = createChunk('IDAT', compressed);

  // IEND chunk
  const iend = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

function createChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const typeBuffer = Buffer.from(type, 'ascii');
  const crcData = Buffer.concat([typeBuffer, data]);

  // CRC32
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < crcData.length; i++) {
    crc ^= crcData[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
    }
  }
  crc ^= 0xFFFFFFFF;
  const crcBuffer = Buffer.alloc(4);
  crcBuffer.writeUInt32BE(crc >>> 0, 0);

  return Buffer.concat([length, typeBuffer, data, crcBuffer]);
}

// Generate placeholder icons with Looper dark background
// Background: #0C1117 = rgb(12, 17, 23)
const bg = { r: 12, g: 17, b: 23 };

console.log('Generating placeholder app assets...');

// icon.png — 1024x1024
fs.writeFileSync(path.join(ASSETS_DIR, 'icon.png'), createPNG(1024, 1024, bg.r, bg.g, bg.b));
console.log('  icon.png (1024x1024)');

// splash.png — 1284x2778
fs.writeFileSync(path.join(ASSETS_DIR, 'splash.png'), createPNG(1284, 2778, bg.r, bg.g, bg.b));
console.log('  splash.png (1284x2778)');

// adaptive-icon.png — 1024x1024
fs.writeFileSync(path.join(ASSETS_DIR, 'adaptive-icon.png'), createPNG(1024, 1024, bg.r, bg.g, bg.b));
console.log('  adaptive-icon.png (1024x1024)');

// favicon.png — 48x48
fs.writeFileSync(path.join(ASSETS_DIR, 'favicon.png'), createPNG(48, 48, bg.r, bg.g, bg.b));
console.log('  favicon.png (48x48)');

console.log('\nPlaceholder assets created in assets/');
console.log('Replace with designer-created branded assets before App Store submission.');
