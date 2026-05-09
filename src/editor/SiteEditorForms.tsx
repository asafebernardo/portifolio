import { useRef } from 'react'
import type { ProjectEntry, SiteConfig } from '../site/types'
import { imageAnonymousProps } from '../lib/imageLoadProps'
import { Field } from './SiteEditorFields'
import styles from './SiteEditorForms.module.css'
import { IconPencil, IconPlus, IconTrash } from './wizardIcons'

function ImageUrlPreview({
  label,
  image,
  previewClassName,
  placeholderShape,
}: {
  label: string
  image: string
  previewClassName: string
  placeholderShape: 'round' | 'card'
}) {
  const img = image.trim()
  const ph =
    placeholderShape === 'round' ? styles.uploadPlaceholderRound : styles.uploadPlaceholderCard

  return (
    <>
      <span className={styles.uploadLabel}>{label}</span>
      <div className={styles.uploadToolbar}>
        <div className={styles.uploadPreviewCol}>
          {img ? (
            <img
              src={img}
              alt=""
              className={previewClassName}
              loading="lazy"
              decoding="async"
              {...imageAnonymousProps(img)}
            />
          ) : (
            <div className={`${styles.uploadPlaceholder} ${ph}`} aria-hidden />
          )}
        </div>
      </div>
    </>
  )
}

export function ConfigForm({
  value: c,
  onChange,
}: {
  value: SiteConfig
  onChange: (v: SiteConfig) => void
}) {
  const photo = c.profilePhoto?.trim() ?? ''

  return (
    <>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Marca & foto</h3>
        <Field label="Nome da marca (logo)" value={c.brandName} onChange={(brandName) => onChange({ ...c, brandName })} />

        <ImageUrlPreview
          label="Pré-visualização"
          image={photo}
          previewClassName={styles.previewImg}
          placeholderShape="round"
        />
        <Field
          label="URL da foto de perfil"
          value={photo}
          onChange={(profilePhoto) => onChange({ ...c, profilePhoto })}
        />
        <p className={styles.help}>
          Por omissão: <code>/profile-photo.png</code> na pasta <code>public/</code>. Também pode usar um link{' '}
          <code>https://…</code>. A foto aparece na barra superior e como ícone da aba (favicon).
        </p>

        <p className={styles.help}>
          <strong>Links do bloco Contato</strong>: edite os segmentos no passo <strong>Contato → Links dos canais</strong>{' '}
          (URL base fixa + utilizador ou caminho). Os valores em <code>config.json</code> servem de reserva quando um
          segmento está vazio.
        </p>
      </div>
    </>
  )
}

function makeUniqueProjectId(existing: ProjectEntry[]): string {
  const ids = new Set(existing.map((p) => p.id))
  let base = `projeto-${Date.now()}`
  let id = base
  let n = 1
  while (ids.has(id)) {
    id = `${base}-${n++}`
  }
  return id
}

function createEmptyProject(existing: ProjectEntry[]): ProjectEntry {
  return {
    id: makeUniqueProjectId(existing),
    title: 'Novo projeto',
    stack: ['React'],
    description: '',
    challenges: '',
    image: '',
    demoUrl: '#',
    codeUrl: '#',
    category: 'frontend',
    featured: false,
  }
}

export function ProjectsPtForm({
  value: projects,
  onChange,
  activeIndex,
  onActiveIndexChange,
}: {
  value: ProjectEntry[]
  onChange: (v: ProjectEntry[]) => void
  activeIndex: number
  onActiveIndexChange: (i: number) => void
}) {
  const editPanelRef = useRef<HTMLDivElement>(null)

  const safeIdx =
    projects.length === 0 ? 0 : Math.min(Math.max(0, activeIndex), projects.length - 1)
  const p = projects[safeIdx]

  function addProject() {
    const next = [...projects, createEmptyProject(projects)]
    onChange(next)
    onActiveIndexChange(next.length - 1)
  }

  function removeActiveProject() {
    if (!window.confirm('Remover este projeto da lista?')) return
    const filtered = projects.filter((_, i) => i !== safeIdx)
    onChange(filtered)
    onActiveIndexChange(Math.min(safeIdx, Math.max(0, filtered.length - 1)))
  }

  function scrollToEditPanel() {
    editPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    const first = editPanelRef.current?.querySelector<HTMLInputElement | HTMLTextAreaElement>(
      'input:not([type="checkbox"]), textarea',
    )
    window.requestAnimationFrame(() => first?.focus())
  }

  if (projects.length === 0) {
    return (
      <>
        <p className={styles.sectionTitle}>Projetos (PT)</p>
        <p className={styles.help}>Nenhum card ainda. Stack e links de demo/código não entram na tradução automática.</p>
        <button type="button" className={styles.addProject} aria-label="Adicionar projeto" onClick={addProject}>
          <IconPlus className={styles.btnIcon} />
        </button>
      </>
    )
  }

  const pi = safeIdx

  return (
    <>
      <p className={styles.sectionTitle}>Projetos (PT)</p>
      <p className={styles.help}>Escolha o cartão, depois edite os campos ou remova o projeto.</p>

      <div className={styles.projectToolbar}>
        <div className={styles.projectPicker}>
          <label className={styles.projectPickerLabel} htmlFor="wizard-project-picker">
            Projeto a editar
          </label>
          <select
            id="wizard-project-picker"
            className={styles.projectSelect}
            value={pi}
            aria-label="Selecionar projeto a editar"
            onChange={(e) => onActiveIndexChange(Number.parseInt(e.target.value, 10))}
          >
            {projects.map((proj, i) => {
              const label = proj.title.trim() || `Projeto ${i + 1}`
              return (
                <option key={`${proj.id}-${i}`} value={i}>
                  {label}
                </option>
              )
            })}
          </select>
        </div>

        <div className={styles.projectActions}>
          <button type="button" className={styles.addProjectInline} aria-label="Novo projeto" onClick={addProject}>
            <IconPlus className={styles.btnIcon} />
          </button>
          <button
            type="button"
            className={styles.editProjectBtn}
            aria-label="Ir para os campos de edição"
            onClick={scrollToEditPanel}
          >
            <IconPencil className={styles.btnIcon} />
          </button>
          <button type="button" className={styles.removeProject} aria-label="Remover projeto" onClick={removeActiveProject}>
            <IconTrash className={styles.btnIcon} />
          </button>
        </div>
      </div>

      {p ? (
        <div ref={editPanelRef} id="wizard-project-edit-panel" className={styles.projectCard}>
          <div className={styles.projectCardHead}>
            <p className={styles.projectTitle}>
              {p.id} · stack: {p.stack.join(', ')}
            </p>
          </div>
          <Field
            label="ID (slug único, ex.: meu-app)"
            value={p.id}
            onChange={(v) => {
              const next = [...projects]
              const slug = v.trim()
              next[pi] = { ...next[pi]!, id: slug.length > 0 ? slug : next[pi]!.id }
              onChange(next)
            }}
          />
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
          <Field
            label="Título"
            value={p.title}
            onChange={(v) => {
              const next = [...projects]
              next[pi] = { ...next[pi]!, title: v }
              onChange(next)
            }}
          />
          <Field
            label="Descrição"
            value={p.description}
            multiline
            onChange={(v) => {
              const next = [...projects]
              next[pi] = { ...next[pi]!, description: v }
              onChange(next)
            }}
          />
          <Field
            label="Desafios"
            value={p.challenges}
            multiline
            onChange={(v) => {
              const next = [...projects]
              next[pi] = { ...next[pi]!, challenges: v }
              onChange(next)
            }}
          />
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
          <div className={styles.uploadBlock}>
            <ImageUrlPreview
              label="Pré-visualização do cartão"
              image={p.image}
              previewClassName={styles.previewImgProject}
              placeholderShape="card"
            />
            <Field
              label="URL da imagem do cartão (opcional)"
              value={p.image}
              onChange={(v) => {
                const next = [...projects]
                next[pi] = { ...next[pi]!, image: v }
                onChange(next)
              }}
            />
            <p className={styles.help}>
              Coloque um ficheiro em <code>public/</code> e use <code>/nome.png</code>, ou um link externo.
            </p>
          </div>
          <div className={styles.grid2}>
            <Field
              label="Demo URL"
              value={p.demoUrl}
              onChange={(v) => {
                const next = [...projects]
                next[pi] = { ...next[pi]!, demoUrl: v }
                onChange(next)
              }}
            />
            <Field
              label="Código URL"
              value={p.codeUrl}
              onChange={(v) => {
                const next = [...projects]
                next[pi] = { ...next[pi]!, codeUrl: v }
                onChange(next)
              }}
            />
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
      ) : null}
    </>
  )
}
