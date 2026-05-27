import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const DEMO_URL =
  process.env.ACS_INSPECTOR_URL ??
  'https://asafebernardo.github.io/acs-inspector/testsChecklist.html'
const OUT_DIR = 'public/projects'

/** Tabs = “menus” principais do checklist publicado. */
const TABS = [
  { file: 'acs-inspector-home', dataTab: 'home' },
  { file: 'acs-inspector-dispositivos', dataTab: 'dispositivos' },
  { file: 'acs-inspector-ferramentas', dataTab: 'ferramentas' },
  { file: 'acs-inspector-usuarios', dataTab: 'usuarios' },
  { file: 'acs-inspector-grupos', dataTab: 'grupos' },
]

async function main() {
  await mkdir(OUT_DIR, { recursive: true })

  const browser = await chromium.launch()
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  })

  await page.goto(DEMO_URL, { waitUntil: 'domcontentloaded', timeout: 120000 })
  await page.waitForSelector('.checklist-tab-bar', { timeout: 120000 })
  await page.waitForTimeout(800)

  const navbar = page.locator('.checklist-navbar').first()
  if (await navbar.count()) {
    await navbar.screenshot({
      path: `${OUT_DIR}/acs-inspector-navbar.png`,
      animations: 'disabled',
    })
  }

  for (const { file, dataTab } of TABS) {
    const btn = page.locator(`.checklist-tab-btn[data-tab="${dataTab}"]`).first()
    await btn.click({ timeout: 15000 })
    await page.waitForSelector(`#tab-panel-${dataTab}.active`, { timeout: 15000 })
    await page.waitForTimeout(400)
    await page.screenshot({
      path: `${OUT_DIR}/${file}.png`,
      fullPage: false,
      animations: 'disabled',
    })
  }

  await browser.close()
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
