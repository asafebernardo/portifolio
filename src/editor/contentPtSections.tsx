import { useEffect, useState } from 'react'
import { CONTACT_URL_BASE, normalizeContactLinkSegments } from '../site/contactLinks'
import type { SiteContent } from '../site/types'
import { Field } from './SiteEditorFields'
import styles from './SiteEditorForms.module.css'

export type ContentPtSectionId =
  | 'seo'
  | 'hero'
  | 'projects'
  | 'skills'
  | 'architecture'
  | 'about'
  | 'contact'
  | 'footer'

/** Passos do wizard: primeiro bloco do hero (até CTA projetos), depois o resto */
export type HeroWizardPart = 'intro' | 'rest'

export const CONTENT_PT_SECTIONS: readonly { id: ContentPtSectionId; label: string }[] = [
  { id: 'seo', label: 'SEO' },
  { id: 'hero', label: 'Hero' },
  { id: 'projects', label: 'Projetos (rótulos)' },
  { id: 'skills', label: 'Skills' },
  { id: 'architecture', label: 'Arquitetura' },
  { id: 'about', label: 'Sobre' },
  { id: 'contact', label: 'Contato' },
  { id: 'footer', label: 'Rodapé' },
] as const

const SECTION_SET = new Set<string>(CONTENT_PT_SECTIONS.map((s) => s.id))

export function parseContentPtSectionId(raw: string | null): ContentPtSectionId {
  if (raw && SECTION_SET.has(raw)) return raw as ContentPtSectionId
  return 'hero'
}

function ContentPtSeoSection({
  d,
  onChange,
}: {
  d: SiteContent
  onChange: (v: SiteContent) => void
}) {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>SEO</h3>
      <p className={styles.help}>
        Título da aba: <strong>Asafe Bernardo</strong> (fixo em qualquer idioma). O favicon segue a{' '}
        <strong>foto de perfil</strong> em Marca & foto.
      </p>
      <div className={styles.seoDescriptionCard}>
        <Field
          label="Descrição"
          value={d.meta.description}
          multiline
          autoHeightMultiline
          onChange={(v) => onChange({ ...d, meta: { ...d.meta, description: v } })}
        />
      </div>
    </div>
  )
}

function ContentPtHeroSection({
  d,
  onChange,
  part,
}: {
  d: SiteContent
  onChange: (v: SiteContent) => void
  /** Sem valor = formulário completo (uso futuro); wizard passa intro | rest */
  part?: HeroWizardPart
}) {
  const showIntro = part !== 'rest'
  const showRest = part !== 'intro'

  const sectionHeading =
    part === 'intro'
      ? 'Hero — texto & botão projetos'
      : part === 'rest'
        ? 'Hero — mock & destaques'
        : 'Hero'

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>{sectionHeading}</h3>
      {showIntro ? (
        <>
          <Field label="Antetítulo (Olá…)" value={d.hero.kicker} onChange={(v) => onChange({ ...d, hero: { ...d.hero, kicker: v } })} />
          <Field
            label="Nome no hero (vazio = usa marca)"
            value={d.hero.title}
            onChange={(v) => onChange({ ...d, hero: { ...d.hero, title: v } })}
          />
          <Field label="Cargo" value={d.hero.role} onChange={(v) => onChange({ ...d, hero: { ...d.hero, role: v } })} />
          <Field label="Descrição" value={d.hero.description} multiline onChange={(v) => onChange({ ...d, hero: { ...d.hero, description: v } })} />
          <Field label="Botão projetos" value={d.hero.ctaProjects} onChange={(v) => onChange({ ...d, hero: { ...d.hero, ctaProjects: v } })} />
        </>
      ) : null}
      {showRest ? (
        <>
          <div className={styles.grid2}>
            <Field label="Mock URL" value={d.hero.mockTitle} onChange={(v) => onChange({ ...d, hero: { ...d.hero, mockTitle: v } })} />
            <Field label="Gráfico — rótulo" value={d.hero.chartLabel} onChange={(v) => onChange({ ...d, hero: { ...d.hero, chartLabel: v } })} />
            <Field label="Badge" value={d.hero.badgeLive} onChange={(v) => onChange({ ...d, hero: { ...d.hero, badgeLive: v } })} />
          </div>
          <Field label="Float API — título" value={d.hero.floatApi.label} onChange={(v) => onChange({ ...d, hero: { ...d.hero, floatApi: { ...d.hero.floatApi, label: v } } })} />
          <Field label="Float API — sub" value={d.hero.floatApi.sub} onChange={(v) => onChange({ ...d, hero: { ...d.hero, floatApi: { ...d.hero.floatApi, sub: v } } })} />
          <Field label="Float FE — título" value={d.hero.floatFe.label} onChange={(v) => onChange({ ...d, hero: { ...d.hero, floatFe: { ...d.hero.floatFe, label: v } } })} />
          <Field label="Float FE — sub" value={d.hero.floatFe.sub} onChange={(v) => onChange({ ...d, hero: { ...d.hero, floatFe: { ...d.hero.floatFe, sub: v } } })} />
          <Field label="Float DB — título" value={d.hero.floatDb.label} onChange={(v) => onChange({ ...d, hero: { ...d.hero, floatDb: { ...d.hero.floatDb, label: v } } })} />
          <Field label="Float DB — sub" value={d.hero.floatDb.sub} onChange={(v) => onChange({ ...d, hero: { ...d.hero, floatDb: { ...d.hero.floatDb, sub: v } } })} />
        </>
      ) : null}
    </div>
  )
}

function ContentPtProjectsLabelsSection({
  d,
  onChange,
}: {
  d: SiteContent
  onChange: (v: SiteContent) => void
}) {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Seção projetos (rótulos)</h3>
      <Field label="Kicker" value={d.projects.kicker} onChange={(v) => onChange({ ...d, projects: { ...d.projects, kicker: v } })} />
      <Field label="Título" value={d.projects.title} onChange={(v) => onChange({ ...d, projects: { ...d.projects, title: v } })} />
      <Field label="Subtítulo" value={d.projects.sub} multiline onChange={(v) => onChange({ ...d, projects: { ...d.projects, sub: v } })} />
      <div className={styles.grid2}>
        <Field label="Filtro: Todos" value={d.projects.filters.all} onChange={(v) => onChange({ ...d, projects: { ...d.projects, filters: { ...d.projects.filters, all: v } } })} />
        <Field label="Filtro: Frontend" value={d.projects.filters.frontend} onChange={(v) => onChange({ ...d, projects: { ...d.projects, filters: { ...d.projects.filters, frontend: v } } })} />
        <Field label="Filtro: Backend" value={d.projects.filters.backend} onChange={(v) => onChange({ ...d, projects: { ...d.projects, filters: { ...d.projects.filters, backend: v } } })} />
        <Field label="Filtro: Full Stack" value={d.projects.filters.fullstack} onChange={(v) => onChange({ ...d, projects: { ...d.projects, filters: { ...d.projects.filters, fullstack: v } } })} />
      </div>
      <Field label="Case principal" value={d.projects.featuredCase} onChange={(v) => onChange({ ...d, projects: { ...d.projects, featuredCase: v } })} />
      <Field label="Desafios (longo)" value={d.projects.challenges} onChange={(v) => onChange({ ...d, projects: { ...d.projects, challenges: v } })} />
      <Field label="Desafios (curto)" value={d.projects.challengesShort} onChange={(v) => onChange({ ...d, projects: { ...d.projects, challengesShort: v } })} />
      <div className={styles.grid2}>
        <Field label="Botão Demo" value={d.projects.demo} onChange={(v) => onChange({ ...d, projects: { ...d.projects, demo: v } })} />
        <Field label="Botão Código" value={d.projects.code} onChange={(v) => onChange({ ...d, projects: { ...d.projects, code: v } })} />
      </div>
      <Field label="Lista vazia" value={d.projects.empty} onChange={(v) => onChange({ ...d, projects: { ...d.projects, empty: v } })} />
    </div>
  )
}

function ContentPtSkillsSection({
  d,
  onChange,
}: {
  d: SiteContent
  onChange: (v: SiteContent) => void
}) {
  const groups = d.skills.groups
  const [activeGi, setActiveGi] = useState(0)

  useEffect(() => {
    if (groups.length === 0) return
    setActiveGi((i) => Math.min(Math.max(0, i), groups.length - 1))
  }, [groups.length])

  const gi = groups.length === 0 ? 0 : Math.min(Math.max(0, activeGi), groups.length - 1)
  const activeGroup = groups[gi]

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Skills</h3>
      <p className={styles.skillsSectionIntroNote}>
        O título principal (h2) e os nomes dos grupos não são editáveis neste assistente (os nomes não são mostrados). Escolha o grupo e edite a lista de itens.
      </p>
      <div className={styles.skillsSectionMeta}>
        <Field label="Antetítulo (kicker)" value={d.skills.kicker} onChange={(v) => onChange({ ...d, skills: { ...d.skills, kicker: v } })} />
        <Field label="Subtítulo" value={d.skills.sub} multiline onChange={(v) => onChange({ ...d, skills: { ...d.skills, sub: v } })} />
      </div>

      <div className={styles.skillsItemsBlock}>
        <p className={styles.skillsItemsBlockTitle}>Itens por grupo</p>
        {groups.length === 0 ? (
          <p className={styles.help}>Não há grupos definidos no conteúdo.</p>
        ) : (
          <>
            <div className={styles.skillsGroupPicker}>
              <label className={styles.skillsGroupPickerLabel} htmlFor="skills-wizard-group">
                Grupo a editar
              </label>
              <div className={styles.skillsGroupSelectWrap}>
                <select
                  id="skills-wizard-group"
                  className={styles.skillsGroupSelect}
                  value={gi}
                  aria-label="Selecionar grupo para editar os itens"
                  onChange={(e) => setActiveGi(Number.parseInt(e.target.value, 10))}
                >
                  {groups.map((_, i) => (
                    <option key={i} value={i}>
                      Grupo {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {activeGroup ? (
              <Field
                label="Itens (uma por linha)"
                value={activeGroup.items.join('\n')}
                multiline
                autoHeightMultiline
                onChange={(v) => {
                  const next = [...groups]
                  next[gi] = {
                    ...next[gi]!,
                    items: v.split('\n').map((s) => s.trim()).filter(Boolean),
                  }
                  onChange({ ...d, skills: { ...d.skills, groups: next } })
                }}
              />
            ) : null}
          </>
        )}
      </div>
    </div>
  )
}

function ContentPtArchitectureSection({
  d,
  onChange,
}: {
  d: SiteContent
  onChange: (v: SiteContent) => void
}) {
  const nodes = d.architecture.nodes
  const [activeNi, setActiveNi] = useState(0)

  useEffect(() => {
    if (nodes.length === 0) return
    setActiveNi((i) => Math.min(Math.max(0, i), nodes.length - 1))
  }, [nodes.length])

  const ni = nodes.length === 0 ? 0 : Math.min(Math.max(0, activeNi), nodes.length - 1)
  const activeNode = nodes[ni]

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Arquitetura</h3>
      <Field label="Kicker" value={d.architecture.kicker} onChange={(v) => onChange({ ...d, architecture: { ...d.architecture, kicker: v } })} />
      <Field label="Título" value={d.architecture.title} onChange={(v) => onChange({ ...d, architecture: { ...d.architecture, title: v } })} />
      <Field label="Subtítulo" value={d.architecture.sub} multiline onChange={(v) => onChange({ ...d, architecture: { ...d.architecture, sub: v } })} />
      <div className={styles.grid2}>
        <Field label="Pipeline: Frontend" value={d.architecture.pipeline.frontend} onChange={(v) => onChange({ ...d, architecture: { ...d.architecture, pipeline: { ...d.architecture.pipeline, frontend: v } } })} />
        <Field label="Pipeline: API" value={d.architecture.pipeline.api} onChange={(v) => onChange({ ...d, architecture: { ...d.architecture, pipeline: { ...d.architecture.pipeline, api: v } } })} />
        <Field label="Pipeline: Banco" value={d.architecture.pipeline.database} onChange={(v) => onChange({ ...d, architecture: { ...d.architecture, pipeline: { ...d.architecture.pipeline, database: v } } })} />
        <Field label="Pipeline: Deploy" value={d.architecture.pipeline.deploy} onChange={(v) => onChange({ ...d, architecture: { ...d.architecture, pipeline: { ...d.architecture.pipeline, deploy: v } } })} />
      </div>

      <div className={styles.skillsItemsBlock}>
        <p className={styles.skillsItemsBlockTitle}>Diagrama — nós</p>
        {nodes.length === 0 ? (
          <p className={styles.help}>Não há nós definidos no conteúdo.</p>
        ) : (
          <>
            <div className={styles.skillsGroupPicker}>
              <label className={styles.skillsGroupPickerLabel} htmlFor="architecture-wizard-node">
                Nó a editar
              </label>
              <div className={styles.skillsGroupSelectWrap}>
                <select
                  id="architecture-wizard-node"
                  className={styles.skillsGroupSelect}
                  value={ni}
                  aria-label="Selecionar nó da arquitetura para editar"
                  onChange={(e) => setActiveNi(Number.parseInt(e.target.value, 10))}
                >
                  {nodes.map((n, i) => (
                    <option key={n.key} value={i}>
                      {n.label.trim() || n.key || `Nó ${i + 1}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {activeNode ? (
              <div className={styles.projectCard}>
                <Field
                  label="Título (badge)"
                  value={activeNode.label}
                  onChange={(v) => {
                    const next = [...nodes]
                    next[ni] = { ...next[ni]!, label: v }
                    onChange({ ...d, architecture: { ...d.architecture, nodes: next } })
                  }}
                />
                <Field
                  label="Subtítulo"
                  value={activeNode.sub}
                  onChange={(v) => {
                    const next = [...nodes]
                    next[ni] = { ...next[ni]!, sub: v }
                    onChange({ ...d, architecture: { ...d.architecture, nodes: next } })
                  }}
                />
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  )
}

function ContentPtAboutSection({
  d,
  onChange,
}: {
  d: SiteContent
  onChange: (v: SiteContent) => void
}) {
  const timeline = d.about.timeline
  const [activeTi, setActiveTi] = useState(0)

  useEffect(() => {
    if (timeline.length === 0) return
    setActiveTi((i) => Math.min(Math.max(0, i), timeline.length - 1))
  }, [timeline.length])

  const ti = timeline.length === 0 ? 0 : Math.min(Math.max(0, activeTi), timeline.length - 1)
  const activeEntry = timeline[ti]

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Sobre</h3>
      <Field label="Kicker" value={d.about.kicker} onChange={(v) => onChange({ ...d, about: { ...d.about, kicker: v } })} />
      <Field label="Título" value={d.about.title} onChange={(v) => onChange({ ...d, about: { ...d.about, title: v } })} />
      <Field label="Lead" value={d.about.lead} multiline onChange={(v) => onChange({ ...d, about: { ...d.about, lead: v } })} />
      <Field label="Segundo parágrafo" value={d.about.para} multiline onChange={(v) => onChange({ ...d, about: { ...d.about, para: v } })} />

      <div className={styles.skillsItemsBlock}>
        <p className={styles.skillsItemsBlockTitle}>Timeline</p>
        {timeline.length === 0 ? (
          <p className={styles.help}>Não há entradas na timeline.</p>
        ) : (
          <>
            <div className={styles.skillsGroupPicker}>
              <label className={styles.skillsGroupPickerLabel} htmlFor="about-wizard-timeline">
                Entrada a editar
              </label>
              <div className={styles.skillsGroupSelectWrap}>
                <select
                  id="about-wizard-timeline"
                  className={styles.skillsGroupSelect}
                  value={ti}
                  aria-label="Selecionar entrada da timeline para editar"
                  onChange={(e) => setActiveTi(Number.parseInt(e.target.value, 10))}
                >
                  {timeline.map((t, i) => (
                    <option key={i} value={i}>
                      {t.phase.trim() || t.title.trim() || `Entrada ${i + 1}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {activeEntry ? (
              <div className={styles.projectCard}>
                <Field
                  label="Fase"
                  value={activeEntry.phase}
                  onChange={(v) => {
                    const next = [...timeline]
                    next[ti] = { ...next[ti]!, phase: v }
                    onChange({ ...d, about: { ...d.about, timeline: next } })
                  }}
                />
                <Field
                  label="Título"
                  value={activeEntry.title}
                  onChange={(v) => {
                    const next = [...timeline]
                    next[ti] = { ...next[ti]!, title: v }
                    onChange({ ...d, about: { ...d.about, timeline: next } })
                  }}
                />
                <Field
                  label="Texto"
                  value={activeEntry.body}
                  multiline
                  onChange={(v) => {
                    const next = [...timeline]
                    next[ti] = { ...next[ti]!, body: v }
                    onChange({ ...d, about: { ...d.about, timeline: next } })
                  }}
                />
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  )
}

const CONTACT_EDIT_GROUPS = [
  { id: 'header', label: 'Cabeçalho (kicker, título, subtítulo)' },
  { id: 'links', label: 'Links dos canais (segmentos após URL base)' },
] as const

type ContactEditGroupId = (typeof CONTACT_EDIT_GROUPS)[number]['id']

function ContentPtContactSection({
  d,
  onChange,
}: {
  d: SiteContent
  onChange: (v: SiteContent) => void
}) {
  const [activeGroup, setActiveGroup] = useState<ContactEditGroupId>('header')
  const seg = normalizeContactLinkSegments(d.contact.linkSegments)

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Contato</h3>

      <div className={styles.skillsItemsBlock}>
        <p className={styles.skillsItemsBlockTitle}>Bloco a editar</p>
        <div className={styles.skillsGroupPicker}>
          <label className={styles.skillsGroupPickerLabel} htmlFor="contact-wizard-group">
            Secção
          </label>
          <div className={styles.skillsGroupSelectWrap}>
            <select
              id="contact-wizard-group"
              className={styles.skillsGroupSelect}
              value={activeGroup}
              aria-label="Selecionar grupo de campos de contacto para editar"
              onChange={(e) => setActiveGroup(e.target.value as ContactEditGroupId)}
            >
              {CONTACT_EDIT_GROUPS.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {activeGroup === 'header' ? (
          <>
            <Field label="Kicker" value={d.contact.kicker} onChange={(v) => onChange({ ...d, contact: { ...d.contact, kicker: v } })} />
            <Field label="Título" value={d.contact.title} onChange={(v) => onChange({ ...d, contact: { ...d.contact, title: v } })} />
            <Field label="Subtítulo" value={d.contact.sub} multiline onChange={(v) => onChange({ ...d, contact: { ...d.contact, sub: v } })} />
          </>
        ) : null}

        {activeGroup === 'links' ? (
          <>
            <p className={styles.help}>
              Cada campo é só o trecho <strong>depois</strong> da URL base (deixe vazio para usar <code>config.json</code>). Bases:{' '}
              GitHub <code>{CONTACT_URL_BASE.github}</code>, LinkedIn <code>{CONTACT_URL_BASE.linkedin}</code>, WhatsApp{' '}
              <code>{CONTACT_URL_BASE.whatsapp}</code>. Email: endereço para <code>mailto:</code> (sem o prefixo).
            </p>
            <Field
              label="Email (mailto)"
              inputPrefix="mailto:"
              value={seg.email}
              onChange={(v) =>
                onChange({ ...d, contact: { ...d.contact, linkSegments: { ...seg, email: v } } })
              }
            />
            <Field
              label="GitHub (utilizador ou caminho)"
              inputPrefix={CONTACT_URL_BASE.github}
              value={seg.github}
              onChange={(v) =>
                onChange({ ...d, contact: { ...d.contact, linkSegments: { ...seg, github: v } } })
              }
            />
            <Field
              label="LinkedIn (slug após /in/)"
              inputPrefix={CONTACT_URL_BASE.linkedin}
              value={seg.linkedin}
              onChange={(v) =>
                onChange({ ...d, contact: { ...d.contact, linkSegments: { ...seg, linkedin: v } } })
              }
            />
            <Field
              label="WhatsApp (número com DDI, só dígitos ou com espaços)"
              inputPrefix={CONTACT_URL_BASE.whatsapp}
              value={seg.whatsapp}
              onChange={(v) =>
                onChange({ ...d, contact: { ...d.contact, linkSegments: { ...seg, whatsapp: v } } })
              }
            />
          </>
        ) : null}
      </div>
    </div>
  )
}

function ContentPtFooterSection({
  d,
  onChange,
}: {
  d: SiteContent
  onChange: (v: SiteContent) => void
}) {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Rodapé & extras</h3>
      <Field
        label="Nota do rodapé (use {{year}} e {{brand}})"
        value={d.footer.note}
        multiline
        onChange={(v) => onChange({ ...d, footer: { ...d.footer, note: v } })}
      />
      <div className={styles.grid2}>
        <Field label="Aria rodapé" value={d.footer.aria} onChange={(v) => onChange({ ...d, footer: { ...d.footer, aria: v } })} />
        <Field label="Link topo" value={d.footer.top} onChange={(v) => onChange({ ...d, footer: { ...d.footer, top: v } })} />
        <Field label="Link projetos" value={d.footer.projects} onChange={(v) => onChange({ ...d, footer: { ...d.footer, projects: v } })} />
        <Field label="Link contato" value={d.footer.contact} onChange={(v) => onChange({ ...d, footer: { ...d.footer, contact: v } })} />
      </div>
      <Field label="Loading — papel" value={d.loading.role} onChange={(v) => onChange({ ...d, loading: { ...d.loading, role: v } })} />
      <Field label="Voltar ao topo (aria)" value={d.backToTop} onChange={(v) => onChange({ ...d, backToTop: v })} />
    </div>
  )
}

export function ContentPtSectionForm({
  section,
  heroPart,
  value: d,
  onChange,
}: {
  section: ContentPtSectionId
  /** Só no passo Hero do wizard */
  heroPart?: HeroWizardPart
  value: SiteContent
  onChange: (v: SiteContent) => void
}) {
  switch (section) {
    case 'seo':
      return <ContentPtSeoSection d={d} onChange={onChange} />
    case 'hero':
      return <ContentPtHeroSection d={d} onChange={onChange} part={heroPart} />
    case 'projects':
      return <ContentPtProjectsLabelsSection d={d} onChange={onChange} />
    case 'skills':
      return <ContentPtSkillsSection d={d} onChange={onChange} />
    case 'architecture':
      return <ContentPtArchitectureSection d={d} onChange={onChange} />
    case 'about':
      return <ContentPtAboutSection d={d} onChange={onChange} />
    case 'contact':
      return <ContentPtContactSection d={d} onChange={onChange} />
    case 'footer':
      return <ContentPtFooterSection d={d} onChange={onChange} />
    default:
      return <ContentPtHeroSection d={d} onChange={onChange} />
  }
}
