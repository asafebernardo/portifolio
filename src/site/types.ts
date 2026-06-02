export type ProjectCategoryId = 'frontend' | 'backend' | 'fullstack'

export type FilterId = 'all' | ProjectCategoryId

export type SiteConfig = {
  brandName: string
  /** Navbar site title (e.g. Portfolio). */
  siteTitle: string
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
  /** Primary / legacy single image (kept in sync with first entry of `images` when editing). */
  image?: string
  /** Optional gallery — fades between URLs when more than one. */
  images?: string[]
  demoUrl: string
  /** Overrides the default “Live demo” button label (e.g. Beta). */
  demoLabel?: string
  /** Demo button visible but not clickable (accent border, code-style fill). */
  demoBlocked?: boolean
  codeUrl: string
  category: ProjectCategoryId
  featured?: boolean
  /** When true, card is locked and shows “In development” instead of live demo. */
  inDevelopment?: boolean
}

export type SkillGroup = {
  title: string
  items: string[]
}

export type WorkExperienceEntry = {
  id: string
  period: string
  role: string
  company: string
  location: string
  description: string
  highlights: string[]
}

export type TimelineEntry = {
  phase: string
  title: string
  body: string
}

/** Segments after CONTACT_URL_BASE / mailto: base. */
export type ContactLinkSegments = {
  /** mailto address (e.g. hello@mail.com). */
  email: string
  /** Username or path after github.com/ */
  github: string
  /** Slug after linkedin.com/in/ */
  linkedin: string
  /** Country code + digits (spaces stripped in URL). */
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
    experience: string
    contact: string
    ctaProjects: string
    menuOpen: string
    menuClose: string
    scrimClose: string
    ariaLanguage: string
    downloadResume: string
    downloadResumeAria: string
  }
  hero: {
    kicker: string
    title: string
    role: string
    description: string
    ctaProjects: string
    github: string
    linkedin: string
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
    viewImageAria: string
    imageModal: {
      close: string
      prev: string
      next: string
    }
    inDevelopment: string
    empty: string
    categories: Record<ProjectCategoryId, string>
  }
  skills: {
    kicker: string
    title: string
    sub: string
    groups: SkillGroup[]
  }
  experience: {
    kicker: string
    title: string
    sub: string
    items: WorkExperienceEntry[]
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
