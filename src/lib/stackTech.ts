/** Brand color per stack label (normalized key → hex). */
const STACK_TECH_COLORS: Record<string, string> = {
  react: '#61dafb',
  typescript: '#3178c6',
  'node.js': '#339933',
  nodejs: '#339933',
  vite: '#646cff',
  express: '#808080',
  mongodb: '#47a248',
  'tailwind css': '#06b6d4',
  jwt: '#f59e0b',
  'web crypto': '#64748b',
  vitest: '#729b1b',
  cypress: '#69d3a7',
  rest: '#3b82f6',
  postgresql: '#336791',
  recharts: '#8884d8',
  'react router': '#ca4245',
  'css modules': '#663399',
  openapi: '#6ba539',
  'swagger ui': '#85ea2d',
  rust: '#ce422b',
  'tauri 2': '#ffc131',
  tauri: '#ffc131',
  pptxgenjs: '#d24726',
  electron: '#47848f',
  sqlite: '#003b57',
  redis: '#dc382d',
  docker: '#2496ed',
  graphql: '#e10098',
}

function normalizeStackKey(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, ' ')
}

/** CSS-safe id for `data-tech` (e.g. node.js → nodejs). */
export function getStackTechId(name: string): string {
  return normalizeStackKey(name).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'default'
}

/** Brand hex for a stack label, or null if unknown. */
export function getStackTechColor(name: string): string | null {
  return STACK_TECH_COLORS[normalizeStackKey(name)] ?? null
}
