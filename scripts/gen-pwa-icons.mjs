// Generate the PWA icon set from the brand mark (app/icon.svg) using sharp.
// Outputs to public/icons/:
//   icon-192.png, icon-512.png  — standard "any" icons (rounded tile, transparent corners)
//   maskable-192.png, maskable-512.png — full-bleed, safe-zone padded (Android adaptive)
//   apple-touch-icon.png (180)  — opaque square (iOS rounds it itself)
// Re-run any time the brand mark changes: `node scripts/gen-pwa-icons.mjs`.
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const OUT = 'public/icons'
fs.mkdirSync(OUT, { recursive: true })

// The brand tile (matches app/icon.svg): orange→red gradient, rounded corners,
// chunky white G, German flag band across the bottom. Rendered at high res.
const tileSvg = (round = true) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FF8B6B"/>
      <stop offset="100%" stop-color="#E85F2C"/>
    </linearGradient>
    <clipPath id="tile"><rect width="512" height="512" rx="${round ? 112 : 0}"/></clipPath>
  </defs>
  <g clip-path="url(#tile)">
    <rect width="512" height="512" fill="url(#bg)"/>
    <text x="256" y="300" text-anchor="middle" dominant-baseline="middle"
      font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="340"
      fill="white">G</text>
    <rect x="0"   y="440" width="170.67" height="72" fill="#000000"/>
    <rect x="170.67" y="440" width="170.67" height="72" fill="#DD0000"/>
    <rect x="341.33" y="440" width="170.67" height="72" fill="#FFCE00"/>
  </g>
</svg>`

// Maskable: Android masks icons to various shapes and needs the key content
// inside a ~80% "safe zone". We render the full-bleed tile (no rounding) scaled
// to 78% and centered on an opaque brand-orange field so no corner is ever clipped.
const maskableSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FF8B6B"/>
      <stop offset="100%" stop-color="#E85F2C"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="url(#bg)"/>
  <text x="256" y="270" text-anchor="middle" dominant-baseline="middle"
    font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="300"
    fill="white">G</text>
  <rect x="96"  y="392" width="106.67" height="56" fill="#000000"/>
  <rect x="202.67" y="392" width="106.67" height="56" fill="#DD0000"/>
  <rect x="309.33" y="392" width="106.67" height="56" fill="#FFCE00"/>
</svg>`

const jobs = [
  { name: 'icon-192.png', svg: tileSvg(true), size: 192, bg: null },
  { name: 'icon-512.png', svg: tileSvg(true), size: 512, bg: null },
  { name: 'maskable-192.png', svg: maskableSvg, size: 192, bg: null },
  { name: 'maskable-512.png', svg: maskableSvg, size: 512, bg: null },
  // Apple touch icon must be opaque (no alpha) — flatten onto the brand orange.
  { name: 'apple-touch-icon.png', svg: tileSvg(false), size: 180, bg: '#E85F2C' },
]

for (const j of jobs) {
  let img = sharp(Buffer.from(j.svg)).resize(j.size, j.size)
  if (j.bg) img = img.flatten({ background: j.bg })
  await img.png().toFile(path.join(OUT, j.name))
  console.log('wrote', path.join(OUT, j.name))
}
console.log('done')
