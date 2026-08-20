// Genera icon-192.png, icon-512.png y apple-touch-icon.png para PWA MANIFIESTA
import sharp from 'sharp';
import { writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, '..', 'public');

function iconSVG(size) {
  const r = size * 0.18; // corner radius
  const center = size / 2;
  // ✦ symbol — drawn as 4 diamond tips
  const star = size * 0.32;
  const starThin = size * 0.045;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#D48898"/>
      <stop offset="100%" stop-color="#B06080"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${r}" fill="url(#bg)"/>
  <!-- ✦ four-point star -->
  <polygon
    fill="white"
    opacity="0.95"
    points="
      ${center},${center - star}
      ${center + starThin},${center - starThin}
      ${center + star},${center}
      ${center + starThin},${center + starThin}
      ${center},${center + star}
      ${center - starThin},${center + starThin}
      ${center - star},${center}
      ${center - starThin},${center - starThin}
    "
  />
</svg>`;
}

async function gen(size, filename) {
  const svg = Buffer.from(iconSVG(size));
  await sharp(svg).png().toFile(path.join(PUBLIC, filename));
  console.log(`✅ ${filename} (${size}×${size})`);
}

await gen(192, 'icon-192.png');
await gen(512, 'icon-512.png');
await gen(180, 'apple-touch-icon.png');
console.log('Íconos PWA generados en public/');
