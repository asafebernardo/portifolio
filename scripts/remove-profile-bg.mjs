import sharp from 'sharp'

const INPUT = 'public/profile-photo.png'
const OUTPUT = 'public/profile-photo-out.png'
const LUMA_THRESHOLD = 42

const { data, info } = await sharp(INPUT).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
const { width, height, channels } = info
const bg = new Uint8Array(width * height)

function lumaAt(i) {
  const r = data[i]
  const g = data[i + 1]
  const b = data[i + 2]
  return 0.299 * r + 0.587 * g + 0.114 * b
}

function isBgPixel(px) {
  return lumaAt(px * channels) < LUMA_THRESHOLD
}

const queue = []
for (let x = 0; x < width; x++) {
  queue.push(x, (height - 1) * width + x)
}
for (let y = 0; y < height; y++) {
  queue.push(y * width, y * width + (width - 1))
}

while (queue.length) {
  const idx = queue.pop()
  if (bg[idx] || !isBgPixel(idx)) continue
  bg[idx] = 1
  const x = idx % width
  const y = (idx / width) | 0
  if (x > 0) queue.push(idx - 1)
  if (x < width - 1) queue.push(idx + 1)
  if (y > 0) queue.push(idx - width)
  if (y < height - 1) queue.push(idx + width)
}

for (let idx = 0, px = 0; idx < bg.length; idx++, px += channels) {
  if (!bg[idx]) continue
  const edge = Math.min(
    lumaAt(px),
    bg[idx - 1] ? lumaAt(px) : 255,
    bg[idx + 1] ? lumaAt(px) : 255,
    idx >= width && bg[idx - width] ? lumaAt(px) : 255,
    idx < width * (height - 1) && bg[idx + width] ? lumaAt(px) : 255,
  )
  const feather = edge > LUMA_THRESHOLD ? 0 : Math.round((edge / LUMA_THRESHOLD) * 255)
  data[px + 3] = feather
}

import { renameSync } from 'node:fs'

await sharp(data, { raw: { width, height, channels: 4 } }).png().toFile(OUTPUT)
renameSync(OUTPUT, INPUT)
console.log(`Wrote transparent PNG: ${INPUT} (${width}x${height})`)
