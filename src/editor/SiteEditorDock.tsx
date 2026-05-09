import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
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
import { ConfigForm, ContentPtForm, ProjectsPtForm } from './SiteEditorForms'
import dock from './SiteEditorDock.module.css'

export function SiteEditorDock() {
  const admin = useAdminSession()
  const [searchParams, setSearchParams] = useSearchParams()
  const [open, setOpen] = useState(() => searchParams.get('edit') === '1')
  const [tab, setTab] = useState<'config' | 'textos' | 'projetos'>('textos')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  const [draftConfig, setDraftConfig] = useState<SiteConfig>(() => getMergedConfig())
  const [draftPt, setDraftPt] = useState<SiteContent>(() => getMergedContent('pt'))
  const [draftProjects, setDraftProjects] = useState<ProjectEntry[]>(() => getMergedProjects('pt'))

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

  function openDock() {
    setOpen(true)
    setSearchParams((prev) => {
      const n = new URLSearchParams(prev)
      n.set('edit', '1')
      return n
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

  return (
    <>
      {!open ? (
        <p className={dock.sessionHint} role="status">
          <strong>Modo edição:</strong> os textos não mudam clicando na página — use o botão à direita ou{' '}
          <button type="button" className={dock.inlineOpen} onClick={openDock}>
            abrir o painel
          </button>
          .
        </p>
      ) : null}
      {!open ? (
        <button type="button" className={dock.fab} onClick={openDock} aria-label="Abrir editor do site">
          ✏️ Editar site
        </button>
      ) : null}

      {open ? (
        <>
          <button type="button" className={dock.scrim} aria-label="Fechar editor" onClick={closeDock} />
          <aside className={dock.panel} aria-label="Editor do portfólio">
            <div className={dock.panelHead}>
              <div>
                <p className={dock.kicker}>Editor</p>
                <h2 className={dock.panelTitle}>Conteúdo (PT → EN automático)</h2>
                <p className={dock.panelSub}>
                  Edite em português e salve: o inglês é gerado via API (MyMemory). Use também{' '}
                  <code>VITE_TRANSLATION_EMAIL</code> no .env para limite maior.
                </p>
              </div>
              <button type="button" className={dock.close} onClick={closeDock} aria-label="Fechar">
                ×
              </button>
            </div>

            <div className={dock.tabs} role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={tab === 'config'}
                className={`${dock.tab} ${tab === 'config' ? dock.tabOn : ''}`}
                onClick={() => setTab('config')}
              >
                Config & links
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={tab === 'textos'}
                className={`${dock.tab} ${tab === 'textos' ? dock.tabOn : ''}`}
                onClick={() => setTab('textos')}
              >
                Textos (PT)
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={tab === 'projetos'}
                className={`${dock.tab} ${tab === 'projetos' ? dock.tabOn : ''}`}
                onClick={() => setTab('projetos')}
              >
                Projetos (PT)
              </button>
            </div>

            <div className={dock.body}>
              {tab === 'config' ? <ConfigForm value={draftConfig} onChange={setDraftConfig} /> : null}
              {tab === 'textos' ? <ContentPtForm value={draftPt} onChange={setDraftPt} /> : null}
              {tab === 'projetos' ? <ProjectsPtForm value={draftProjects} onChange={setDraftProjects} /> : null}
            </div>

            <div className={dock.footer}>
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
          </aside>
        </>
      ) : null}
    </>
  )
}
