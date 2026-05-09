import { useLayoutEffect, useRef } from 'react'
import styles from './SiteEditorForms.module.css'

export function Field({
  label,
  value,
  onChange,
  multiline,
  autoHeightMultiline,
  inputPrefix,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  multiline?: boolean
  /** Ajusta a altura ao conteúdo (última linha), sem área vazia extra em baixo. */
  autoHeightMultiline?: boolean
  /** Texto fixo à esquerda do input (ex.: URL base). Ignorado com multiline. */
  inputPrefix?: string
}) {
  const taRef = useRef<HTMLTextAreaElement>(null)

  useLayoutEffect(() => {
    if (!multiline || !autoHeightMultiline || !taRef.current) return
    const el = taRef.current
    el.style.height = 'auto'
    const minPx = 72
    el.style.height = `${Math.max(el.scrollHeight, minPx)}px`
  }, [value, multiline, autoHeightMultiline])

  return (
    <label className={styles.field}>
      <span>{label}</span>
      {multiline ? (
        <textarea
          ref={autoHeightMultiline ? taRef : undefined}
          value={value}
          rows={autoHeightMultiline ? 1 : 4}
          className={autoHeightMultiline ? styles.fieldTextareaAutoHeight : undefined}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : inputPrefix ? (
        <div className={styles.fieldInputComposite}>
          <span className={styles.fieldInputPrefix} title={inputPrefix}>
            {inputPrefix}
          </span>
          <input
            className={styles.fieldInputSegment}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-label={label}
          />
        </div>
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  )
}
