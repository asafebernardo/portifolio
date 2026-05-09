import { useRef, useState, type ChangeEvent, type RefObject } from 'react'
import type { ProjectEntry, SiteConfig } from '../site/types'
import { fileToProfilePhotoDataUrl, fileToProjectImageDataUrl } from '../lib/profileImageUpload'
import { Field } from './SiteEditorFields'
import styles from './SiteEditorForms.module.css'
import {
  IconLoader,
  IconPencil,
  IconPlus,
  IconTrash,
  IconUpload,
  IconX,
} from './wizardIcons'

function ImageUploadControl({
  label,
  image,
  uploadBusy,
  uploadErr,
  fileRef,
  onPickFile,
  onClear,
  previewImgClass,
  placeholderShape,
  removeAriaLabel,
}: {
  label: string
  image: string
  uploadBusy: boolean
  uploadErr: string | null
  fileRef: RefObject<HTMLInputElement | null>
  onPickFile: (e: ChangeEvent<HTMLInputElement>) => void
  onClear: () => void
  previewImgClass: string
  placeholderShape: 'round' | 'card'
  removeAriaLabel: string
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
            <img src={img} alt="" className={previewImgClass} loading="lazy" decoding="async" />
          ) : (
            <div className={`${styles.uploadPlaceholder} ${ph}`} aria-hidden>
              <IconUpload className={styles.uploadPlaceholderIcon} />
            </div>
          )}
        </div>
        <div className={styles.uploadActionCol}>
          <span className={styles.uploadActionHeading}>Ações</span>
          <div className={styles.uploadActionBtns} role="group" aria-label="Enviar ou remover imagem">
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
              aria-label={uploadBusy ? 'A processar ficheiro' : 'Carregar ficheiro de imagem'}
              onClick={() => fileRef.current?.click()}
            >
              {uploadBusy ? (
                <IconLoader className={`${styles.btnIcon} ${styles.iconSpin}`} />
              ) : (
                <IconUpload className={styles.btnIcon} />
              )}
            </button>
            {img ? (
              <button type="button" className={styles.removePhoto} aria-label={removeAriaLabel} onClick={onClear}>
                <IconX className={styles.btnIcon} />
              </button>
            ) : null}
          </div>
        </div>
      </div>
      {uploadErr ? (
        <p className={styles.uploadErr} role="alert">
          {uploadErr}
        </p>
      ) : null}
    </>
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
      <ImageUploadControl
        label="Imagem do card (opcional)"
        image={image}
        uploadBusy={uploadBusy}
        uploadErr={uploadErr}
        fileRef={fileRef}
        onPickFile={onPickFile}
        onClear={() => onImageChange('')}
        previewImgClass={styles.previewImgProject}
        placeholderShape="card"
        removeAriaLabel="Remover imagem do cartão"
      />
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
        <h3 className={styles.sectionTitle}>Marca & foto</h3>
        <Field label="Nome da marca (logo)" value={c.brandName} onChange={(brandName) => onChange({ ...c, brandName })} />

        <div className={styles.uploadBlock}>
          <ImageUploadControl
            label="Foto de perfil"
            image={photo}
            uploadBusy={uploadBusy}
            uploadErr={uploadErr}
            fileRef={fileRef}
            onPickFile={onPickFile}
            onClear={() => onChange({ ...c, profilePhoto: '' })}
            previewImgClass={styles.previewImg}
            placeholderShape="round"
            removeAriaLabel="Remover foto de perfil"
          />
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
          <ProjectImageUploadBlock
            image={p.image}
            onImageChange={(v) => {
              const next = [...projects]
              next[pi] = { ...next[pi]!, image: v }
              onChange(next)
            }}
          />
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
