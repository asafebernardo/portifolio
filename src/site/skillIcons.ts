/** Simple Icons slug per skill label (normalized key). */
const SKILL_ICON_SLUGS: Record<string, string> = {
  // Frontend
  react: 'react',
  typescript: 'typescript',
  vite: 'vite',
  'tailwind css': 'tailwindcss',
  'react router': 'reactrouter',
  'css modules': 'cssmodules',
  'next.js': 'nextdotjs',
  nextjs: 'nextdotjs',
  'responsive design': 'w3c',
  'performance optimization': 'googlelighthouse',
  acessibilidade: 'w3c',
  'performance web': 'googlelighthouse',

  // Backend
  'node.js': 'nodedotjs',
  nodejs: 'nodedotjs',
  express: 'express',
  fastify: 'fastify',
  'express / fastify': 'fastify',
  'rest apis': 'openapi',
  'rest & graphql': 'graphql',
  websockets: 'socketdotio',
  jwt: 'jsonwebtokens',
  'jwt authentication': 'jsonwebtokens',
  'web crypto': 'w3c',
  vitest: 'vitest',
  cypress: 'cypress',
  rest: 'openapi',
  recharts: 'plotly',
  openapi: 'openapi',
  'swagger ui': 'swagger',
  rust: 'rust',
  tauri: 'tauri',
  'tauri 2': 'tauri',
  pptxgenjs: 'microsoftpowerpoint',
  'automated testing': 'vitest',
  'testes automatizados': 'vitest',

  // Database
  postgresql: 'postgresql',
  mongodb: 'mongodb',
  redis: 'redis',
  'database modeling': 'prisma',
  'modelagem & índices': 'prisma',
  'sql queries': 'postgresql',
  migrations: 'flyway',
  migrações: 'flyway',

  // DevOps & tools
  docker: 'docker',
  'git & github': 'github',
  git: 'git',
  'ci/cd': 'githubactions',
  aws: 'amazonwebservices',
  'cloud (aws/gcp)': 'googlecloud',
  linux: 'linux',
  'monitoring & logs': 'grafana',
  observabilidade: 'grafana',
}

function normalizeSkillKey(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, ' ')
}

export function getSkillIconSlug(name: string): string | null {
  return SKILL_ICON_SLUGS[normalizeSkillKey(name)] ?? null
}

/** Brand icons that are dark/black and need a light tint on dark backgrounds. */
const LIGHT_ON_DARK_SLUGS = new Set([
  'github',
  'nextdotjs',
  'express',
  'w3c',
  'openapi',
  'jsonwebtokens',
  'linux',
  'cssmodules',
  'prisma',
  'socketdotio',
  'amazonwebservices',
  'githubactions',
  'flyway',
  'microsoftpowerpoint',
  'swagger',
  'rust',
])

const SKILL_ICON_LIGHT = 'e2e8f0'

export function skillIconUrl(slug: string, colorScheme: 'light' | 'dark'): string {
  if (colorScheme === 'dark' && LIGHT_ON_DARK_SLUGS.has(slug)) {
    return `https://cdn.simpleicons.org/${slug}/${SKILL_ICON_LIGHT}`
  }
  return `https://cdn.simpleicons.org/${slug}`
}
