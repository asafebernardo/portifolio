/** Metadados gerados no servidor em `uploads/site-runtime.json` (persistência sem localStorage). */
export type SiteRuntimeManifest = {
  profilePhoto?: string
  projectImages?: Record<string, string>
}

export type Locale = 'pt' | 'en'

export type ProjectCategoryId = 'frontend' | 'backend' | 'fullstack'

export type FilterId = 'all' | ProjectCategoryId

export type SiteConfig = {
  brandName: string
  /** URL da foto (ex.: /perfil.jpg na pasta `public` ou https…) — omitir ou vazio oculta */
  profilePhoto?: string
  links: {
    github: string
    linkedin: string
    email: string
    emailDisplay: string
    githubDisplay: string
    linkedinDisplay: string
    whatsapp: string
    whatsappDisplay: string
  }
}

export type ProjectEntry = {
  id: string
  title: string
  stack: string[]
  description: string
  challenges: string
  image: string
  demoUrl: string
  codeUrl: string
  category: ProjectCategoryId
  featured?: boolean
}

export type SkillGroup = {
  title: string
  items: string[]
}

export type ArchNode = {
  key: string
  label: string
  sub: string
}

export type TimelineEntry = {
  phase: string
  title: string
  body: string
}

/** Segmentos após CONTACT_URL_BASE / mailto (passo Contato no editor). */
export type ContactLinkSegments = {
  /** Endereço para mailto (ex.: contato@mail.com). */
  email: string
  /** Utilizador ou caminho após github.com/ */
  github: string
  /** Slug após linkedin.com/in/ */
  linkedin: string
  /** Número com código do país (dígitos; pode incluir espaços, são removidos na URL). */
  whatsapp: string
}

export type SiteContent = {
  meta: {
    title: string
    description: string
  }
  nav: {
    ariaMain: string
    home: string
    projects: string
    skills: string
    architecture: string
    about: string
    contact: string
    ctaProjects: string
    menuOpen: string
    menuClose: string
    scrimClose: string
    ariaLanguage: string
  }
  hero: {
    kicker: string
    title: string
    role: string
    description: string
    ctaProjects: string
    github: string
    linkedin: string
    mockTitle: string
    chartLabel: string
    badgeLive: string
    floatApi: { label: string; sub: string }
    floatFe: { label: string; sub: string }
    floatDb: { label: string; sub: string }
  }
  projects: {
    kicker: string
    title: string
    sub: string
    filters: Record<FilterId, string>
    filterAria: string
    featuredCase: string
    challenges: string
    challengesShort: string
    demo: string
    code: string
    empty: string
    categories: Record<ProjectCategoryId, string>
  }
  skills: {
    kicker: string
    title: string
    sub: string
    groups: SkillGroup[]
  }
  architecture: {
    kicker: string
    title: string
    sub: string
    pipeline: { frontend: string; api: string; database: string; deploy: string }
    nodes: ArchNode[]
  }
  about: {
    kicker: string
    title: string
    lead: string
    para: string
    timeline: TimelineEntry[]
  }
  contact: {
    kicker: string
    title: string
    sub: string
    name: string
    email: string
    message: string
    namePlaceholder: string
    emailPlaceholder: string
    messagePlaceholder: string
    submit: string
    feedback: string
    channelLabels: {
      email: string
      github: string
      linkedin: string
      whatsapp: string
    }
    /** Caminhos combinados com URLs base fixas; ver `contactLinks.ts`. */
    linkSegments: ContactLinkSegments
  }
  footer: {
    note: string
    aria: string
    top: string
    projects: string
    contact: string
  }
  loading: {
    role: string
  }
  backToTop: string
}
