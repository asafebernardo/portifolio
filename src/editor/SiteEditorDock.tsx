import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { logout } from '../admin/session'
import { useAdminSession } from '../admin/useAdminSession'
import type { ProjectEntry, SiteConfig, SiteContent } from '../site/types'
import {
  clearAllOverrides,
  getMergedConfig,
  getMergedContent,
  getMergedProjects,
  saveOverride,
} from '../site/overrides'
import { translateProjectsPtToEn, translateSiteContentPtToEn } from '../lib/translate'
import {
  CONTENT_PT_SECTIONS,
  ContentPtSectionForm,
  parseContentPtSectionId,
  type ContentPtSectionId,
} from './contentPtSections'
import {
  editorAllowsConfigTab,
  editorAllowsProjectsTab,
  getEditorContentSectionIds,
  getEditorPathLabel,
  pickContentSectionForPath,
} from './editorRouteConfig'
import { ConfigForm, ProjectsPtForm } from './SiteEditorForms'
import dock from './SiteEditorDock.module.css'

function parseEditProjectIndex(raw: string | null, len: number): number {
  if (len <= 0) return 0
  const n = Number.parseInt(raw ?? '0', 10)
  if (!Number.isFinite(n)) return 0
  return Math.min(Math.max(0, n), len - 1)
}

export function SiteEditorDock() {
  const admin = useAdminSession()
  const { pathname } = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [open, setOpen] = useState(() => searchParams.get('edit') === '1')
  const [tab, setTab] = useState<'config' | 'textos' | 'projetos'>('textos')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  const [draftConfig, setDraftConfig] = useState<SiteConfig>(() => getMergedConfig())
  const [draftPt, setDraftPt] = useState<SiteContent>(() => getMergedContent('pt'))
  const [draftProjects, setDraftProjects] = useState<ProjectEntry[]>(() => getMergedProjects('pt'))

  const [contentSection, setContentSection] = useState<ContentPtSectionId>(() =>
    parseContentPtSectionId(searchParams.get('editSection')),
  )
  const [projectIdx, setProjectIdx] = useState(() =>
    parseEditProjectIndex(searchParams.get('editProject'), getMergedProjects('pt').length),
  )

  const allowedSections = useMemo(() => getEditorContentSectionIds(pathname), [pathname])
  const showConfigTab = editorAllowsConfigTab(pathname)
  const showProjectsTab = editorAllowsProjectsTab(pathname)
  const sectionNavItems = useMemo(
    () => CONTENT_PT_SECTIONS.filter((s) => allowedSections.includes(s.id)),
    [allowedSections],
  )
  const showEditorTabsRow = showConfigTab || showProjectsTab
  const editorTabColumnCount = (showConfigTab ? 1 : 0) + 1 + (showProjectsTab ? 1 : 0)
  const showSectionPills = tab === 'textos' && sectionNavItems.length > 1

  const reloadDrafts = useCallback(() => {
    setDraftConfig(getMergedConfig())
    setDraftPt(getMergedContent('pt'))
    setDraftProjects(getMergedProjects('pt'))
  }, [])

  useEffect(() => {
    if (searchParams.get('edit') === '1') setOpen(true)
  }, [searchParams])

  useEffect(() => {
    const fn = () => reloadDrafts()
    window.addEventListener('portfolio-overrides-changed', fn)
    return () => window.removeEventListener('portfolio-overrides-changed', fn)
  }, [reloadDrafts])

  useEffect(() => {
    if (open) reloadDrafts()
  }, [open, reloadDrafts])

  useEffect(() => {
    if (searchParams.get('edit') !== '1') return
    const fromUrl = parseContentPtSectionId(searchParams.get('editSection'))
    const next = pickContentSectionForPath(pathname, fromUrl)
    setContentSection(next)
    if (fromUrl !== next) {
      setSearchParams((prev) => {
        const n = new URLSearchParams(prev)
        n.set('edit', '1')
        n.set('editSection', next)
        return n
      })
    }
  }, [searchParams, pathname, setSearchParams])

  useEffect(() => {
    if (searchParams.get('edit') !== '1') return
    setProjectIdx(parseEditProjectIndex(searchParams.get('editProject'), draftProjects.length))
  }, [searchParams, draftProjects.length])

  useEffect(() => {
    if (!open) return
    if (tab === 'config' && !showConfigTab) setTab('textos')
    if (tab === 'projetos' && !showProjectsTab) setTab('textos')
  }, [open, pathname, tab, showConfigTab, showProjectsTab])

  const selectContentSection = useCallback(
    (id: ContentPtSectionId) => {
      if (!allowedSections.includes(id)) return
      setContentSection(id)
      setSearchParams((prev) => {
        const n = new URLSearchParams(prev)
        n.set('edit', '1')
        n.set('editSection', id)
        return n
      })
    },
    [allowedSections, setSearchParams],
  )

  const selectProjectIdx = useCallback(
    (i: number) => {
      setProjectIdx(i)
      setSearchParams((prev) => {
        const n = new URLSearchParams(prev)
        n.set('edit', '1')
        n.set('editProject', String(i))
        return n
      })
    },
    [setSearchParams],
  )

  const setTabAndUrl = useCallback(
    (next: 'config' | 'textos' | 'projetos') => {
      setTab(next)
      setSearchParams((prev) => {
        const n = new URLSearchParams(prev)
        n.set('edit', '1')
        return n
      })
    },
    [setSearchParams],
  )

  function openDock() {
    setOpen(true)
    const next = pickContentSectionForPath(pathname, contentSection)
    setContentSection(next)
    setSearchParams((prev) => {
      const n = new URLSearchParams(prev)
      n.set('edit', '1')
      n.set('editSection', next)
      return n
    })
    window.requestAnimationFrame(() => {
      document.getElementById('site-editor')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  function closeDock() {
    setOpen(false)
    setSearchParams((prev) => {
      const n = new URLSearchParams(prev)
      n.delete('edit')
      return n
    })
  }

  async function handleSave() {
    setBusy(true)
    setMsg(null)
    try {
      saveOverride('config', draftConfig)
      saveOverride('contentPt', draftPt)
      saveOverride('projectsPt', draftProjects)
      const enContent = await translateSiteContentPtToEn(draftPt)
      saveOverride('contentEn', enContent)
      const enProjects = await translateProjectsPtToEn(draftProjects)
      saveOverride('projectsEn', enProjects)
      setMsg('Salvo. Versão em inglês gerada automaticamente a partir do PT.')
    } catch (e) {
      const text = e instanceof Error ? e.message : 'Erro desconhecido'
      setMsg(
        `Textos em PT foram salvos. Falha ao gerar EN: ${text}. Opcional: informe um email em VITE_TRANSLATION_EMAIL no .env para maior limite na API gratuita.`,
      )
    } finally {
      setBusy(false)
    }
  }

  function handleClearAll() {
    if (!window.confirm('Apagar todas as edições salvas no navegador e voltar aos arquivos do projeto?')) return
    clearAllOverrides()
    reloadDrafts()
    setMsg('Overrides limpos.')
  }

  function handleLogout() {
    logout()
    closeDock()
  }

  if (!admin) return null

  const sectionLabel = CONTENT_PT_SECTIONS.find((s) => s.id === contentSection)?.label

  return (
    <>
      {!open ? (
        <p className={dock.sessionHint} role="status">
          <strong>Modo edição:</strong> use <strong>Editar site</strong> para abrir os campos no final desta página.
          Cada rota (Home, Projetos, Skills…) mostra só o editor correspondente.
        </p>
      ) : null}
      {!open ? (
        <button type="button" className={dock.fab} onClick={openDock} aria-label="Abrir editor do site">
          ✏️ Editar site
        </button>
      ) : null}

      {open ? (
        <section id="site-editor" className={dock.inlineRoot} aria-label="Editor do portfólio">
          <div className={dock.inlineSticky}>
            <div className={dock.panelHead}>
              <div className={dock.panelIntro}>
                <p className={dock.kicker}>Editor nesta página</p>
                <h2 className={dock.panelTitle}>Conteúdo (PT → EN automático)</h2>
                <p className={dock.panelSub}>
                  Só aparecem os blocos desta página (<strong>{getEditorPathLabel(pathname)}</strong>). Salve para gerar
                  o inglês (MyMemory). Opcional: <code>VITE_TRANSLATION_EMAIL</code> no .env.
                </p>
              </div>
              <button type="button" className={dock.endEdit} onClick={closeDock}>
                Encerrar edição
              </button>
            </div>

            {showEditorTabsRow ? (
              <div className={dock.tabsWrap}>
                <div
                  className={dock.tabs}
                  role="tablist"
                  style={{ gridTemplateColumns: `repeat(${editorTabColumnCount}, minmax(0, 1fr))` }}
                >
                  {showConfigTab ? (
                    <button
                      type="button"
                      role="tab"
                      aria-selected={tab === 'config'}
                      className={`${dock.tab} ${tab === 'config' ? dock.tabOn : ''}`}
                      onClick={() => setTabAndUrl('config')}
                    >
                      Marca & foto
                    </button>
                  ) : null}
                  <button
                    type="button"
                    role="tab"
                    aria-selected={tab === 'textos'}
                    className={`${dock.tab} ${tab === 'textos' ? dock.tabOn : ''}`}
                    onClick={() => setTabAndUrl('textos')}
                  >
                    {showProjectsTab ? 'Rótulos da seção' : 'Textos (PT)'}
                  </button>
                  {showProjectsTab ? (
                    <button
                      type="button"
                      role="tab"
                      aria-selected={tab === 'projetos'}
                      className={`${dock.tab} ${tab === 'projetos' ? dock.tabOn : ''}`}
                      onClick={() => setTabAndUrl('projetos')}
                    >
                      Cards de projetos
                    </button>
                  ) : null}
                </div>
              </div>
            ) : null}

            {tab === 'textos' ? (
              <>
                <p className={dock.sectionContext}>
                  {showSectionPills ? (
                    <>Escolha o bloco: </>
                  ) : (
                    <>Editando: {sectionLabel ?? contentSection}</>
                  )}
                </p>
                {showSectionPills ? (
                  <nav className={dock.sectionNav} aria-label="Blocos de texto desta página">
                    {sectionNavItems.map(({ id, label }) => (
                      <button
                        key={id}
                        type="button"
                        className={`${dock.sectionNavBtn} ${contentSection === id ? dock.sectionNavBtnOn : ''}`}
                        aria-pressed={contentSection === id}
                        onClick={() => selectContentSection(id)}
                      >
                        {label}
                      </button>
                    ))}
                  </nav>
                ) : null}
              </>
            ) : null}
          </div>

          <div className={dock.inlineForm}>
            {tab === 'config' ? <ConfigForm value={draftConfig} onChange={setDraftConfig} /> : null}
            {tab === 'textos' ? (
              <ContentPtSectionForm section={contentSection} value={draftPt} onChange={setDraftPt} />
            ) : null}
            {tab === 'projetos' ? (
              <ProjectsPtForm
                value={draftProjects}
                onChange={setDraftProjects}
                activeIndex={projectIdx}
                onActiveIndexChange={selectProjectIdx}
              />
            ) : null}
          </div>

          <div className={dock.inlineFooter}>
            {msg ? (
              <p className={dock.msg} role="status">
                {msg}
              </p>
            ) : null}
            <div className={dock.actions}>
              <button type="button" className={dock.secondary} onClick={handleClearAll} disabled={busy}>
                Limpar overrides
              </button>
              <button type="button" className={dock.secondary} onClick={handleLogout} disabled={busy}>
                Sair da conta
              </button>
              <button type="button" className={dock.primary} onClick={() => void handleSave()} disabled={busy}>
                {busy ? 'Salvando e traduzindo…' : 'Salvar tudo + gerar inglês'}
              </button>
            </div>
          </div>
        </section>
      ) : null}
    </>
  )
}
