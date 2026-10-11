import sharp from 'sharp';
import { existsSync, unlinkSync } from 'fs';

const input = 'images/Uppernile_logo_Trans.png';
const outputWebp = 'images/logo.webp';
const outputAvif = 'images/logo.avif';

if (!existsSync(input)) {
  console.error('Source not found');
  process.exit(1);
}

const src = sharp(input);
const meta = await src.metadata();
console.log(`Original: ${meta.width}x${meta.height} (${meta.format})`);

// Resize to max 200px width, preserve transparency
const resized = src.resize({ width: 200, height: 200, fit: 'inside', withoutEnlargement: true });

// WebP with transparency, max quality lossy
await resized.clone().webp({ quality: 80, alphaQuality: 90, effort: 6 }).toFile(outputWebp);
const webpSize = (await sharp(outputWebp).metadata()).size;
console.log(`WebP: ${outputWebp} — ${(webpSize / 1024).toFixed(1)} KB`);

// AVIF for modern browsers (even smaller)
await resized.clone().avif({ quality: 50, effort: 6 }).toFile(outputAvif);
const avifSize = (await sharp(outputAvif).metadata()).size;
console.log(`AVIF: ${outputAvif} — ${(avifSize / 1024).toFixed(1)} KB`);

console.log('Done');
