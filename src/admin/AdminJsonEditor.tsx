import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { OverrideFile } from '../site/overrides'
import { clearAllOverrides, getEffectiveJson, removeOverride, saveOverride } from '../site/overrides'
import { logout } from './session'
import styles from './AdminEditor.module.css'

const TABS: { id: OverrideFile; label: string }[] = [
  { id: 'config', label: 'config.json' },
  { id: 'contentPt', label: 'content.pt.json' },
  { id: 'contentEn', label: 'content.en.json' },
  { id: 'projectsPt', label: 'projects.pt.json' },
  { id: 'projectsEn', label: 'projects.en.json' },
]

export default function AdminJsonEditor() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<OverrideFile>('config')
  const [draft, setDraft] = useState(() => getEffectiveJson('config'))
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    setDraft(getEffectiveJson(tab))
    setError(null)
  }, [tab])

  function showToast(msg: string) {
    setToast(msg)
    window.setTimeout(() => setToast(null), 3200)
  }

  function handleSave() {
    setError(null)
    try {
      const parsed: unknown = JSON.parse(draft)
      saveOverride(tab, parsed)
      setDraft(getEffectiveJson(tab))
      showToast('Salvo. O site público já usa estes dados neste navegador.')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'JSON inválido.')
    }
  }

  function handleRevertFile() {
    removeOverride(tab)
    setDraft(getEffectiveJson(tab))
    showToast('Arquivo restaurado ao padrão do repositório.')
  }

  function handleClearAll() {
    if (!window.confirm('Remover todas as edições salvas no navegador e voltar aos JSON do projeto?')) return
    clearAllOverrides()
    setDraft(getEffectiveJson(tab))
    showToast('Todas as sobrescritas foram limpas.')
  }

  function handleLogout() {
    logout()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className={styles.page}>
      <header className={styles.top}>
        <div>
          <p className={styles.kicker}>Admin · JSON</p>
          <h1 className={styles.title}>Editor JSON (avançado)</h1>
          <p className={styles.sub}>
            Preferência: edite no próprio site com o botão <strong>Editar site</strong>. Aqui você pode ajustar JSON
            cru. Alterações ficam em <strong>localStorage</strong>.
          </p>
        </div>
        <div className={styles.topActions}>
          <button type="button" className={styles.ghost} onClick={handleClearAll}>
            Limpar tudo
          </button>
          <button type="button" className={styles.dangerGhost} onClick={handleLogout}>
            Sair
          </button>
          <Link className={styles.link} to="/">
            Voltar ao site
          </Link>
        </div>
      </header>

      <div className={styles.tabs} role="tablist" aria-label="Arquivos">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            className={`${styles.tab} ${tab === t.id ? styles.tabActive : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className={styles.editor}>
        <textarea
          className={styles.textarea}
          spellCheck={false}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          aria-label={TABS.find((x) => x.id === tab)?.label}
        />
        <div className={styles.bar}>
          <button type="button" className={styles.primary} onClick={handleSave}>
            Salvar
          </button>
          <button type="button" className={styles.secondary} onClick={handleRevertFile}>
            Restaurar este arquivo
          </button>
        </div>
        {error ? (
          <p className={styles.error} role="alert">
            {error}
          </p>
        ) : null}
        {toast ? (
          <p className={styles.toast} role="status">
            {toast}
          </p>
        ) : null}
      </div>
    </div>
  )
}
