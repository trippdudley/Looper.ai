/**
 * Record the sizzle reel as an MP4 video with audio.
 *
 * Usage: node scripts/record-sizzle.cjs
 *
 * Requires: playwright, ffmpeg-static (both installed as devDependencies)
 * Outputs:  sizzle-reel.mp4 in the project root
 */

const { chromium } = require('playwright');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const FFMPEG = require('ffmpeg-static');
const DEV_SERVER = 'http://localhost:5173';
const VISION_PATH = '/vision';
const OUTPUT_FILE = path.join(__dirname, '..', 'sizzle-reel.mp4');
const AUDIO_FILE = path.join(__dirname, '..', 'src', 'assets', 'audio', 'Legacy in Motion.mp3');

// Total reel duration in ms (8+24+22+31+20+22+22+6 = 155s) + 2s buffer
const REEL_DURATION_MS = 155000 + 3000;

const WIDTH = 1920;
const HEIGHT = 1080;

async function main() {
  console.log('🎬 Starting sizzle reel recording...');
  console.log(`   Resolution: ${WIDTH}x${HEIGHT}`);
  console.log(`   Duration:   ~${Math.round(REEL_DURATION_MS / 1000)}s`);
  console.log(`   Output:     ${OUTPUT_FILE}`);
  console.log('');

  // Temp dir for video
  const tmpDir = path.join(__dirname, '..', '.recording-tmp');
  if (fs.existsSync(tmpDir)) fs.rmSync(tmpDir, { recursive: true });
  fs.mkdirSync(tmpDir, { recursive: true });

  // Launch browser with video recording
  const browser = await chromium.launch({
    headless: true,
    args: ['--autoplay-policy=no-user-gesture-required'],
  });

  const context = await browser.newContext({
    viewport: { width: WIDTH, height: HEIGHT },
    recordVideo: {
      dir: tmpDir,
      size: { width: WIDTH, height: HEIGHT },
    },
    // Mute audio in browser (we'll add it via ffmpeg)
    isMobile: false,
  });

  const page = await context.newPage();

  // Navigate to the sizzle reel
  console.log('📡 Navigating to sizzle reel...');
  await page.goto(`${DEV_SERVER}${VISION_PATH}`, { waitUntil: 'networkidle' });

  // Wait a moment for animations to start
  await page.waitForTimeout(1000);

  console.log('🔴 Recording... (this will take ~2.5 minutes)');

  // Wait for the full reel to play
  const startTime = Date.now();
  const checkInterval = 10000; // log progress every 10s

  while (Date.now() - startTime < REEL_DURATION_MS) {
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    const total = Math.round(REEL_DURATION_MS / 1000);
    process.stdout.write(`\r   ⏱  ${elapsed}s / ${total}s`);
    await page.waitForTimeout(Math.min(checkInterval, REEL_DURATION_MS - (Date.now() - startTime)));
  }

  console.log('\n✅ Recording complete. Processing...');

  // Close to finalize the video
  const videoPath = await page.video().path();
  await context.close();
  await browser.close();

  console.log(`📹 Raw video: ${videoPath}`);

  // Merge video + audio with ffmpeg
  if (fs.existsSync(AUDIO_FILE)) {
    console.log('🎵 Merging audio track...');
    const cmd = [
      `"${FFMPEG}"`,
      `-i "${videoPath}"`,          // video input
      `-i "${AUDIO_FILE}"`,         // audio input
      `-filter_complex "[1:a]volume=0.5,afade=t=out:st=152:d=3[a]"`,  // 50% volume, fade out last 3s
      `-map 0:v`,                   // use video from first input
      `-map "[a]"`,                 // use processed audio
      `-c:v libx264`,
      `-preset fast`,
      `-crf 23`,
      `-c:a aac`,
      `-b:a 192k`,
      `-shortest`,                  // end when shortest stream ends
      `-y`,                         // overwrite output
      `"${OUTPUT_FILE}"`,
    ].join(' ');

    console.log(`   Running: ffmpeg merge...`);
    execSync(cmd, { stdio: 'inherit' });
  } else {
    console.log('⚠️  Audio file not found, creating video-only output...');
    const cmd = [
      `"${FFMPEG}"`,
      `-i "${videoPath}"`,
      `-c:v libx264`,
      `-preset fast`,
      `-crf 23`,
      `-y`,
      `"${OUTPUT_FILE}"`,
    ].join(' ');
    execSync(cmd, { stdio: 'inherit' });
  }

  // Clean up temp files
  fs.rmSync(tmpDir, { recursive: true, force: true });

  const stats = fs.statSync(OUTPUT_FILE);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(1);
  console.log('');
  console.log(`🎬 Done! Output: ${OUTPUT_FILE} (${sizeMB} MB)`);
}

main().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
