import { useRef, useState, type ChangeEvent } from 'react'
import type { ProjectEntry, SiteConfig, SiteContent } from '../site/types'
import { fileToProfilePhotoDataUrl, fileToProjectImageDataUrl } from '../lib/profileImageUpload'
import styles from './SiteEditorForms.module.css'

function Field({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  multiline?: boolean
}) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={4} />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  )
}

function ProjectImageUploadBlock({
  image,
  onImageChange,
}: {
  image: string
  onImageChange: (v: string) => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploadBusy, setUploadBusy] = useState(false)
  const [uploadErr, setUploadErr] = useState<string | null>(null)

  async function onPickFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setUploadErr(null)
    setUploadBusy(true)
    try {
      const dataUrl = await fileToProjectImageDataUrl(file)
      onImageChange(dataUrl)
    } catch (err) {
      setUploadErr(err instanceof Error ? err.message : 'Erro ao processar a imagem.')
    } finally {
      setUploadBusy(false)
    }
  }

  const img = image.trim()

  return (
    <div className={styles.uploadBlock}>
      <span className={styles.uploadLabel}>Imagem do card</span>
      {img ? (
        <div className={styles.previewRow}>
          <img src={img} alt="" className={styles.previewImgProject} />
          <button type="button" className={styles.removePhoto} onClick={() => onImageChange('')}>
            Remover imagem
          </button>
        </div>
      ) : null}
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className={styles.hiddenFile}
        onChange={onPickFile}
      />
      <button
        type="button"
        className={styles.uploadBtn}
        disabled={uploadBusy}
        onClick={() => fileRef.current?.click()}
      >
        {uploadBusy ? 'Processando…' : 'Upload'}
      </button>
      {uploadErr ? (
        <p className={styles.uploadErr} role="alert">
          {uploadErr}
        </p>
      ) : null}
      <p className={styles.help}>
        Redimensionada para caber no navegador após <strong>Salvar tudo + gerar inglês</strong>. Ou use uma URL abaixo.
      </p>
      {img.startsWith('data:') ? (
        <p className={styles.help}>
          Para usar uma URL em vez do arquivo, clique em <strong>Remover imagem</strong>.
        </p>
      ) : (
        <>
          <Field label="Ou cole uma URL de imagem (sem upload)" value={img} onChange={onImageChange} />
          <p className={styles.help}>
            Ex.: <code>/screenshot.png</code> em <code>public/</code> ou link <code>https://…</code>.
          </p>
        </>
      )}
    </div>
  )
}

export function ConfigForm({
  value: c,
  onChange,
}: {
  value: SiteConfig
  onChange: (v: SiteConfig) => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploadBusy, setUploadBusy] = useState(false)
  const [uploadErr, setUploadErr] = useState<string | null>(null)

  async function onPickFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setUploadErr(null)
    setUploadBusy(true)
    try {
      const dataUrl = await fileToProfilePhotoDataUrl(file)
      onChange({ ...c, profilePhoto: dataUrl })
    } catch (err) {
      setUploadErr(err instanceof Error ? err.message : 'Erro ao processar a imagem.')
    } finally {
      setUploadBusy(false)
    }
  }

  const photo = c.profilePhoto?.trim() ?? ''

  return (
    <>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Marca & links</h3>
        <Field label="Nome da marca (logo)" value={c.brandName} onChange={(brandName) => onChange({ ...c, brandName })} />

        <div className={styles.uploadBlock}>
          <span className={styles.uploadLabel}>Foto de perfil</span>
          {photo ? (
            <div className={styles.previewRow}>
              <img src={photo} alt="" className={styles.previewImg} />
              <button
                type="button"
                className={styles.removePhoto}
                onClick={() => onChange({ ...c, profilePhoto: '' })}
              >
                Remover foto
              </button>
            </div>
          ) : null}
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className={styles.hiddenFile}
            onChange={onPickFile}
          />
          <button
            type="button"
            className={styles.uploadBtn}
            disabled={uploadBusy}
            onClick={() => fileRef.current?.click()}
          >
            {uploadBusy ? 'Processando…' : 'Upload'}
          </button>
          {uploadErr ? (
            <p className={styles.uploadErr} role="alert">
              {uploadErr}
            </p>
          ) : null}
          <p className={styles.help}>
            A foto aparece na <strong>barra superior</strong> e como <strong>ícone da aba</strong> (favicon); clique na
            miniatura para ampliar. Guardada neste navegador após <strong>Salvar tudo + gerar inglês</strong>.
          </p>
        </div>

        {photo.startsWith('data:') ? (
          <p className={styles.help}>Para usar uma URL em vez do arquivo, clique em <strong>Remover foto</strong>.</p>
        ) : (
          <>
            <Field
              label="Ou cole uma URL de imagem (sem upload)"
              value={photo}
              onChange={(profilePhoto) => onChange({ ...c, profilePhoto })}
            />
            <p className={styles.help}>
              Ex.: <code>/eu.jpg</code> em <code>public/</code> ou link <code>https://…</code>.
            </p>
          </>
        )}

        <Field label="GitHub (URL)" value={c.links.github} onChange={(v) => onChange({ ...c, links: { ...c.links, github: v } })} />
        <Field label="LinkedIn (URL)" value={c.links.linkedin} onChange={(v) => onChange({ ...c, links: { ...c.links, linkedin: v } })} />
        <Field label="Email (mailto:)" value={c.links.email} onChange={(v) => onChange({ ...c, links: { ...c.links, email: v } })} />
        <Field label="Texto exibido — email" value={c.links.emailDisplay} onChange={(v) => onChange({ ...c, links: { ...c.links, emailDisplay: v } })} />
        <Field label="Texto exibido — GitHub" value={c.links.githubDisplay} onChange={(v) => onChange({ ...c, links: { ...c.links, githubDisplay: v } })} />
        <Field label="Texto exibido — LinkedIn" value={c.links.linkedinDisplay} onChange={(v) => onChange({ ...c, links: { ...c.links, linkedinDisplay: v } })} />
        <Field label="WhatsApp (URL)" value={c.links.whatsapp} onChange={(v) => onChange({ ...c, links: { ...c.links, whatsapp: v } })} />
        <Field label="Texto exibido — WhatsApp" value={c.links.whatsappDisplay} onChange={(v) => onChange({ ...c, links: { ...c.links, whatsappDisplay: v } })} />
      </div>
    </>
  )
}

export function ContentPtForm({
  value: d,
  onChange,
}: {
  value: SiteContent
  onChange: (v: SiteContent) => void
}) {
  return (
    <>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>SEO</h3>
        <p className={styles.help}>
          Título da aba: <strong>Asafe Bernardo</strong> (fixo em qualquer idioma). O favicon segue a{' '}
          <strong>foto de perfil</strong> em Config.
        </p>
        <div className={styles.grid2}>
          <Field
            label="Descrição"
            value={d.meta.description}
            multiline
            onChange={(v) => onChange({ ...d, meta: { ...d.meta, description: v } })}
          />
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Menu</h3>
        <div className={styles.grid2}>
          <Field label="Home" value={d.nav.home} onChange={(v) => onChange({ ...d, nav: { ...d.nav, home: v } })} />
          <Field label="Projetos" value={d.nav.projects} onChange={(v) => onChange({ ...d, nav: { ...d.nav, projects: v } })} />
          <Field label="Skills" value={d.nav.skills} onChange={(v) => onChange({ ...d, nav: { ...d.nav, skills: v } })} />
          <Field label="Arquitetura" value={d.nav.architecture} onChange={(v) => onChange({ ...d, nav: { ...d.nav, architecture: v } })} />
          <Field label="Sobre" value={d.nav.about} onChange={(v) => onChange({ ...d, nav: { ...d.nav, about: v } })} />
          <Field label="Contato" value={d.nav.contact} onChange={(v) => onChange({ ...d, nav: { ...d.nav, contact: v } })} />
        </div>
        <Field label="CTA Projetos" value={d.nav.ctaProjects} onChange={(v) => onChange({ ...d, nav: { ...d.nav, ctaProjects: v } })} />
        <Field label="Aria menu principal" value={d.nav.ariaMain} onChange={(v) => onChange({ ...d, nav: { ...d.nav, ariaMain: v } })} />
        <Field label="Aria idioma" value={d.nav.ariaLanguage} onChange={(v) => onChange({ ...d, nav: { ...d.nav, ariaLanguage: v } })} />
        <div className={styles.grid2}>
          <Field label="Aria abrir menu" value={d.nav.menuOpen} onChange={(v) => onChange({ ...d, nav: { ...d.nav, menuOpen: v } })} />
          <Field label="Aria fechar menu" value={d.nav.menuClose} onChange={(v) => onChange({ ...d, nav: { ...d.nav, menuClose: v } })} />
        </div>
        <Field label="Aria fechar overlay" value={d.nav.scrimClose} onChange={(v) => onChange({ ...d, nav: { ...d.nav, scrimClose: v } })} />
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Hero</h3>
        <Field label="Antetítulo (Olá…)" value={d.hero.kicker} onChange={(v) => onChange({ ...d, hero: { ...d.hero, kicker: v } })} />
        <Field
          label="Nome no hero (vazio = usa marca)"
          value={d.hero.title}
          onChange={(v) => onChange({ ...d, hero: { ...d.hero, title: v } })}
        />
        <Field label="Cargo" value={d.hero.role} onChange={(v) => onChange({ ...d, hero: { ...d.hero, role: v } })} />
        <Field label="Descrição" value={d.hero.description} multiline onChange={(v) => onChange({ ...d, hero: { ...d.hero, description: v } })} />
        <Field label="Botão projetos" value={d.hero.ctaProjects} onChange={(v) => onChange({ ...d, hero: { ...d.hero, ctaProjects: v } })} />
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
      </div>

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

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Skills</h3>
        <Field label="Kicker" value={d.skills.kicker} onChange={(v) => onChange({ ...d, skills: { ...d.skills, kicker: v } })} />
        <Field label="Título" value={d.skills.title} onChange={(v) => onChange({ ...d, skills: { ...d.skills, title: v } })} />
        <Field label="Subtítulo" value={d.skills.sub} multiline onChange={(v) => onChange({ ...d, skills: { ...d.skills, sub: v } })} />
        {d.skills.groups.map((g, gi) => (
          <div key={gi} className={styles.projectCard}>
            <p className={styles.projectTitle}>Grupo {gi + 1}</p>
            <Field label="Título do grupo" value={g.title} onChange={(v) => {
              const groups = [...d.skills.groups]
              groups[gi] = { ...groups[gi]!, title: v }
              onChange({ ...d, skills: { ...d.skills, groups } })
            }} />
            <Field
              label="Itens (um por linha)"
              value={g.items.join('\n')}
              multiline
              onChange={(v) => {
                const groups = [...d.skills.groups]
                groups[gi] = { ...groups[gi]!, items: v.split('\n').map((s) => s.trim()).filter(Boolean) }
                onChange({ ...d, skills: { ...d.skills, groups } })
              }}
            />
          </div>
        ))}
      </div>

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
        {d.architecture.nodes.map((n, ni) => (
          <div key={n.key} className={styles.projectCard}>
            <p className={styles.projectTitle}>Nó {n.label}</p>
            <Field label="Título" value={n.label} onChange={(v) => {
              const nodes = [...d.architecture.nodes]
              nodes[ni] = { ...nodes[ni]!, label: v }
              onChange({ ...d, architecture: { ...d.architecture, nodes } })
            }} />
            <Field label="Subtítulo" value={n.sub} onChange={(v) => {
              const nodes = [...d.architecture.nodes]
              nodes[ni] = { ...nodes[ni]!, sub: v }
              onChange({ ...d, architecture: { ...d.architecture, nodes } })
            }} />
          </div>
        ))}
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Sobre</h3>
        <Field label="Kicker" value={d.about.kicker} onChange={(v) => onChange({ ...d, about: { ...d.about, kicker: v } })} />
        <Field label="Título" value={d.about.title} onChange={(v) => onChange({ ...d, about: { ...d.about, title: v } })} />
        <Field label="Lead" value={d.about.lead} multiline onChange={(v) => onChange({ ...d, about: { ...d.about, lead: v } })} />
        <Field label="Segundo parágrafo" value={d.about.para} multiline onChange={(v) => onChange({ ...d, about: { ...d.about, para: v } })} />
        {d.about.timeline.map((t, ti) => (
          <div key={ti} className={styles.projectCard}>
            <p className={styles.projectTitle}>Timeline {ti + 1}</p>
            <Field label="Fase" value={t.phase} onChange={(v) => {
              const timeline = [...d.about.timeline]
              timeline[ti] = { ...timeline[ti]!, phase: v }
              onChange({ ...d, about: { ...d.about, timeline } })
            }} />
            <Field label="Título" value={t.title} onChange={(v) => {
              const timeline = [...d.about.timeline]
              timeline[ti] = { ...timeline[ti]!, title: v }
              onChange({ ...d, about: { ...d.about, timeline } })
            }} />
            <Field label="Texto" value={t.body} multiline onChange={(v) => {
              const timeline = [...d.about.timeline]
              timeline[ti] = { ...timeline[ti]!, body: v }
              onChange({ ...d, about: { ...d.about, timeline } })
            }} />
          </div>
        ))}
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Contato</h3>
        <Field label="Kicker" value={d.contact.kicker} onChange={(v) => onChange({ ...d, contact: { ...d.contact, kicker: v } })} />
        <Field label="Título" value={d.contact.title} onChange={(v) => onChange({ ...d, contact: { ...d.contact, title: v } })} />
        <Field label="Subtítulo" value={d.contact.sub} multiline onChange={(v) => onChange({ ...d, contact: { ...d.contact, sub: v } })} />
        <div className={styles.grid2}>
          <Field label="Label nome" value={d.contact.name} onChange={(v) => onChange({ ...d, contact: { ...d.contact, name: v } })} />
          <Field label="Label email" value={d.contact.email} onChange={(v) => onChange({ ...d, contact: { ...d.contact, email: v } })} />
          <Field label="Label mensagem" value={d.contact.message} onChange={(v) => onChange({ ...d, contact: { ...d.contact, message: v } })} />
          <Field label="Enviar" value={d.contact.submit} onChange={(v) => onChange({ ...d, contact: { ...d.contact, submit: v } })} />
        </div>
        <Field label="Placeholder nome" value={d.contact.namePlaceholder} onChange={(v) => onChange({ ...d, contact: { ...d.contact, namePlaceholder: v } })} />
        <Field label="Placeholder email" value={d.contact.emailPlaceholder} onChange={(v) => onChange({ ...d, contact: { ...d.contact, emailPlaceholder: v } })} />
        <Field label="Placeholder mensagem" value={d.contact.messagePlaceholder} onChange={(v) => onChange({ ...d, contact: { ...d.contact, messagePlaceholder: v } })} />
        <Field label="Mensagem após envio" value={d.contact.feedback} multiline onChange={(v) => onChange({ ...d, contact: { ...d.contact, feedback: v } })} />
        <Field label="Canais — título" value={d.contact.channelsTitle} onChange={(v) => onChange({ ...d, contact: { ...d.contact, channelsTitle: v } })} />
      </div>

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
    </>
  )
}

export function ProjectsPtForm({
  value: projects,
  onChange,
}: {
  value: ProjectEntry[]
  onChange: (v: ProjectEntry[]) => void
}) {
  return (
    <>
      <p className={styles.sectionTitle}>Projetos (PT) — stack e links não são traduzidos automaticamente</p>
      {projects.map((p, pi) => (
        <div key={p.id} className={styles.projectCard}>
          <p className={styles.projectTitle}>
            {p.id} · stack: {p.stack.join(', ')}
          </p>
          <label className={styles.row}>
            <input
              type="checkbox"
              checked={Boolean(p.featured)}
              onChange={(e) => {
                const next = [...projects]
                next[pi] = { ...next[pi]!, featured: e.target.checked }
                onChange(next)
              }}
            />
            <span>Destaque principal</span>
          </label>
          <Field label="Título" value={p.title} onChange={(v) => {
            const next = [...projects]
            next[pi] = { ...next[pi]!, title: v }
            onChange(next)
          }} />
          <Field label="Descrição" value={p.description} multiline onChange={(v) => {
            const next = [...projects]
            next[pi] = { ...next[pi]!, description: v }
            onChange(next)
          }} />
          <Field label="Desafios" value={p.challenges} multiline onChange={(v) => {
            const next = [...projects]
            next[pi] = { ...next[pi]!, challenges: v }
            onChange(next)
          }} />
          <Field
            label="Stack (vírgula)"
            value={p.stack.join(', ')}
            onChange={(v) => {
              const next = [...projects]
              next[pi] = {
                ...next[pi]!,
                stack: v.split(',').map((s) => s.trim()).filter(Boolean),
              }
              onChange(next)
            }}
          />
          <ProjectImageUploadBlock
            image={p.image}
            onImageChange={(v) => {
              const next = [...projects]
              next[pi] = { ...next[pi]!, image: v }
              onChange(next)
            }}
          />
          <div className={styles.grid2}>
            <Field label="Demo URL" value={p.demoUrl} onChange={(v) => {
              const next = [...projects]
              next[pi] = { ...next[pi]!, demoUrl: v }
              onChange(next)
            }} />
            <Field label="Código URL" value={p.codeUrl} onChange={(v) => {
              const next = [...projects]
              next[pi] = { ...next[pi]!, codeUrl: v }
              onChange(next)
            }} />
            <Field
              label="Categoria (frontend | backend | fullstack)"
              value={p.category}
              onChange={(v) => {
                const next = [...projects]
                const c = v as ProjectEntry['category']
                if (c === 'frontend' || c === 'backend' || c === 'fullstack') {
                  next[pi] = { ...next[pi]!, category: c }
                  onChange(next)
                }
              }}
            />
          </div>
        </div>
      ))}
    </>
  )
}
