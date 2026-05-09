import { useEffect, useId, useState } from 'react'
import { createPortal } from 'react-dom'
import { IconSave, IconUndo } from '../../editor/wizardIcons'
import { usePortfolioDraft } from './PortfolioDraftContext'
import styles from './PortfolioSaveBar.module.css'

export function PortfolioSaveBar({ variant = 'bottom' }: { variant?: 'bottom' | 'header' }) {
  const d = usePortfolioDraft()
  const [savedOpen, setSavedOpen] = useState(false)
  const savedTitleId = useId()

  useEffect(() => {
    if (!savedOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSavedOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [savedOpen])

  if (!d) return null

  const draft = d
  const disabled = !draft.dirty

  function handleSave() {
    draft.save()
    setSavedOpen(true)
  }

  const savePopup =
    savedOpen &&
    typeof document !== 'undefined' &&
    createPortal(
      <div className={styles.confirmRoot}>
        <button
          type="button"
          className={styles.confirmBackdrop}
          aria-label="Fechar diálogo"
          onClick={() => setSavedOpen(false)}
        />
        <div
          className={styles.confirmPanel}
          role="dialog"
          aria-modal="true"
          aria-labelledby={savedTitleId}
          onClick={(e) => e.stopPropagation()}
        >
          <h2 id={savedTitleId} className={styles.confirmTitle}>
            Alterações guardadas
          </h2>
          <p className={styles.confirmBody}>
            Textos em português, configuração e projetos foram guardados neste navegador (localStorage).
          </p>
          <button type="button" className={styles.confirmOk} onClick={() => setSavedOpen(false)}>
            OK
          </button>
        </div>
      </div>,
      document.body,
    )

  const buttons = (
    <>
      <button
        type="button"
        className={styles.save}
        disabled={disabled}
        aria-label="Guardar todas as alterações"
        onClick={handleSave}
      >
        <IconSave className={styles.iconBtn} />
      </button>
      <button
        type="button"
        className={styles.discard}
        disabled={disabled}
        aria-label="Descartar alterações"
        onClick={() => d.discard()}
      >
        <IconUndo className={styles.iconBtn} />
      </button>
    </>
  )

  if (variant === 'header') {
    return (
      <>
        <div className={styles.barHeader} role="region" aria-label="Guardar alterações do portfólio">
          <span className={disabled ? styles.hintHeaderMuted : styles.hintHeader}>
            {disabled ? 'Sem alterações' : 'Não guardado'}
          </span>
          {buttons}
        </div>
        {savePopup}
      </>
    )
  }

  return (
    <>
      <div className={styles.bar} role="region" aria-label="Guardar alterações do portfólio">
        <p className={styles.hint}>
          {disabled ? 'Sem alterações por guardar.' : 'Alterações não guardadas (textos PT / config / projetos PT)'}
        </p>
        {buttons}
      </div>
      {savePopup}
    </>
  )
}
