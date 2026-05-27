import { chromium } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:5173/'
const OUT_DIR = 'public/projects'

async function main() {
  await mkdir(OUT_DIR, { recursive: true })

  const browser = await chromium.launch()
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  })

  await page.goto(BASE_URL, { waitUntil: 'networkidle' })

  // Hide any "focus outlines" that could appear in screenshots.
  await page.addStyleTag({
    content: `
      *:focus { outline: none !important; }
      *:focus-visible { outline: none !important; }
    `,
  })

  // Give fonts/layout a moment to settle.
  await page.waitForTimeout(250)

  const shots = [
    { name: 'portfolio-home', url: BASE_URL },
    { name: 'portfolio-projects', url: new URL('#projects', BASE_URL).toString() },
    { name: 'portfolio-skills', url: new URL('#skills', BASE_URL).toString() },
    { name: 'portfolio-experience', url: new URL('#experience', BASE_URL).toString() },
    { name: 'portfolio-contact', url: new URL('#contact', BASE_URL).toString() },
  ]

  for (const s of shots) {
    await page.goto(s.url, { waitUntil: 'networkidle' })
    await page.waitForTimeout(350)
    await page.screenshot({
      path: `${OUT_DIR}/${s.name}.png`,
      fullPage: false,
      animations: 'disabled',
    })
  }

  // Create a tiny manifest for debugging/reference.
  await writeFile(
    `${OUT_DIR}/portfolio-screenshots.json`,
    JSON.stringify(
      {
        baseUrl: BASE_URL,
        images: shots.map((s) => `/projects/${s.name}.png`),
      },
      null,
      2,
    ) + '\n',
  )

  await browser.close()
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})

