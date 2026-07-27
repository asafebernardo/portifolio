export type ProjectCategoryId = 'frontend' | 'backend' | 'fullstack'

export type FilterId = 'all' | ProjectCategoryId

export type SiteConfig = {
  brandName: string
  /** Navbar site title (e.g. Portfolio). */
  siteTitle: string
  /** URL da foto (ex.: /perfil.jpg na pasta `public` ou https…) — omitir ou vazio oculta */
  profilePhoto?: string
  /** Static CV PDF for ATS (public path). */
  resumePdf?: string
  portfolioUrl?: string
  location?: string
  address?: string
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
  /** Measurable outcome or production status (shown on project cards). */
  impact?: string
  /** Your role on the project. */
  role?: string
  /** Technical bullets for ATS/recruiters (endpoints, auth, tests, etc.). */
  technicalHighlights?: string[]
  /** Link to Postman collection or API docs. */
  postmanUrl?: string
}

export type SkillGroup = {
  title: string
  items: string[]
}

export type SkillLevel = 'advanced' | 'intermediate' | 'beginner'

export type SkillCategoryId = 'backend' | 'testing' | 'database' | 'devops' | 'frontend'

export type SkillCatalogEntry = {
  id: string
  name: string
  aliases: string[]
  category: SkillCategoryId
  level: SkillLevel
  evidence: string[]
}

export type SkillCatalog = {
  categoryLabels: Record<SkillCategoryId, string>
  categoryOrder: SkillCategoryId[]
  levelLabels: Record<SkillLevel, string>
  items: SkillCatalogEntry[]
}

export type WorkExperienceEntry = {
  id: string
  period: string
  /** ISO year-month for SEO (e.g. 2023-07). */
  startDate: string
  /** ISO year-month or null when current. */
  endDate: string | null
  role: string
  company: string
  location?: string
  /** Why this role matters for Back-end positioning. */
  relevance?: string
  /** Highlights the most relevant card for recruiters. */
  featured?: boolean
  description: string
  /** Tech/tools used — shown as tags for ATS. */
  skills: string[]
  highlights: string[]
}

export type EducationEntry = {
  id: string
  institution: string
  degree: string
  period: string
  details?: string
}

export type CourseEntry = {
  name: string
  institution: string
  period?: string
  status: string
}

export type LanguageEntry = {
  name: string
  level: string
}

export type CertificationEntry = {
  name: string
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
    education: string
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
    impact: string
    role: string
    technical: string
    postman: string
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
  }
  experience: {
    kicker: string
    title: string
    sub: string
    items: WorkExperienceEntry[]
  }
  education: {
    kicker: string
    title: string
    sub: string
    items: EducationEntry[]
    languagesTitle: string
    languages: LanguageEntry[]
    certificationsTitle: string
    certifications: CertificationEntry[]
    coursesTitle: string
    courses: CourseEntry[]
  }
  about: {
    kicker: string
    title: string
    lead: string
    para: string
    availabilityStatus: string
    availabilityModes: string
    availabilityNote: string
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
