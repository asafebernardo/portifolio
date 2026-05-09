import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ConfigForm, ProjectsPtForm } from '../../editor/SiteEditorForms'
import {
  CONTENT_PT_SECTIONS,
  ContentPtSectionForm,
  type ContentPtSectionId,
} from '../../editor/contentPtSections'
import { DocumentMeta } from '../../i18n/DocumentMeta'
import {
  PortfolioDraftPreviewProvider,
  usePortfolioDraft,
} from '../portfolio/PortfolioDraftContext'
import { PortfolioSaveBar } from '../portfolio/PortfolioSaveBar'
import { IconChevronLeft, IconChevronRight, IconHomeSite } from '../../editor/wizardIcons'
import { EditorWizardPreview } from './EditorWizardPreview'
import type { WizardStep } from './wizardTypes'
import styles from './EditorWizard.module.css'

function buildSteps(): WizardStep[] {
  const out: WizardStep[] = [{ kind: 'config' }]
  for (const { id } of CONTENT_PT_SECTIONS) {
    if (id === 'seo') continue
    if (id === 'projects') {
      out.push({ kind: 'content', section: 'projects' })
      out.push({ kind: 'projectsData' })
    } else if (id === 'hero') {
      out.push({ kind: 'content', section: 'hero', heroPart: 'intro' })
      out.push({ kind: 'content', section: 'hero', heroPart: 'rest' })
    } else {
      out.push({ kind: 'content', section: id })
    }
  }
  return out
}

function wizardShowsPreview(step: WizardStep): boolean {
  if (step.kind === 'config') return false
  if (step.kind === 'content' && step.section === 'seo') return false
  return true
}

function stepTitle(step: WizardStep, index: number, total: number): string {
  const n = `${index + 1} / ${total}`
  if (step.kind === 'config') return `${n} · Marca, configuração & SEO`
  if (step.kind === 'projectsData') return `${n} · Projetos (cartões)`
  if (step.kind === 'content' && step.section === 'hero') {
    return step.heroPart === 'intro'
      ? `${n} · Hero — texto & botão projetos`
      : `${n} · Hero — mock & destaques`
  }
  const labels: Record<Exclude<ContentPtSectionId, 'hero'>, string> = {
    seo: 'SEO',
    projects: 'Projetos (textos)',
    skills: 'Skills',
    architecture: 'Arquitetura',
    about: 'Sobre',
    contact: 'Contato',
    footer: 'Rodapé & extras',
  }
  return `${n} · ${labels[step.section]}`
}

export function EditorWizard() {
  const steps = useMemo(() => buildSteps(), [])
  const [index, setIndex] = useState(0)
  const [projectTab, setProjectTab] = useState(0)
  const d = usePortfolioDraft()

  const active = Boolean(d?.active)
  const safeIndex = Math.min(Math.max(0, index), Math.max(0, steps.length - 1))
  const hookStep = active ? steps[safeIndex]! : null
  const total = steps.length
  const showPreview = hookStep ? wizardShowsPreview(hookStep) : false

  const editScrollRef = useRef<HTMLDivElement>(null)
  const [previewColumnHeightPx, setPreviewColumnHeightPx] = useState<number | undefined>(undefined)
  const [syncPreviewHeight, setSyncPreviewHeight] = useState(true)

  useLayoutEffect(() => {
    const mq = window.matchMedia('(max-width: 960px)')
    const read = () => setSyncPreviewHeight(!mq.matches)
    read()
    mq.addEventListener('change', read)
    return () => mq.removeEventListener('change', read)
  }, [])

  useLayoutEffect(() => {
    if (!active) return
    const prevHtml = document.documentElement.style.overflow
    const prevBody = document.body.style.overflow
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    return () => {
      document.documentElement.style.overflow = prevHtml
      document.body.style.overflow = prevBody
    }
  }, [active])

  useLayoutEffect(() => {
    if (!active || !showPreview || !syncPreviewHeight) {
      setPreviewColumnHeightPx(undefined)
      return
    }
    const el = editScrollRef.current
    if (!el) return

    const sync = () => {
      setPreviewColumnHeightPx(Math.round(el.clientHeight))
    }

    sync()
    const ro = new ResizeObserver(sync)
    ro.observe(el)
    window.addEventListener('resize', sync)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', sync)
    }
  }, [active, showPreview, syncPreviewHeight, index, projectTab])

  if (!d?.active) {
    return (
      <div className={styles.fallback}>
        <p>Sessão de edição indisponível.</p>
        <Link to="/login">Iniciar sessão</Link>
      </div>
    )
  }

  const step = steps[safeIndex]!

  return (
    <div className={styles.root}>
      <DocumentMeta />
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.headerTitleRow}>
            <div className={styles.headerTitleCol}>
              <p className={styles.kicker}>Editor assistido</p>
              <h1 className={styles.title}>{stepTitle(step, index, total)}</h1>
            </div>
            <div className={styles.headerToolbar}>
              <div className={styles.headerStepNav}>
                <button
                  type="button"
                  className={styles.stepBtn}
                  disabled={index <= 0}
                  aria-label="Retroceder um passo"
                  onClick={() => setIndex((i) => Math.max(0, i - 1))}
                >
                  <IconChevronLeft className={styles.stepBtnIcon} aria-hidden />
                  <span className={styles.stepBtnLabel}>Retroceder</span>
                </button>
                <button
                  type="button"
                  className={styles.stepBtnPrimary}
                  disabled={index >= total - 1}
                  aria-label="Avançar um passo"
                  onClick={() => setIndex((i) => Math.min(total - 1, i + 1))}
                >
                  <span className={styles.stepBtnLabel}>Avançar</span>
                  <IconChevronRight className={styles.stepBtnIcon} aria-hidden />
                </button>
              </div>
              <span className={styles.toolbarSep} aria-hidden="true" />
              <Link to="/" className={styles.back} aria-label="Ver site público">
                <IconHomeSite className={styles.backIcon} />
              </Link>
              <span className={styles.toolbarSep} aria-hidden="true" />
              <PortfolioSaveBar variant="header" />
            </div>
          </div>
        </div>
      </header>

      <main className={`${styles.main} ${showPreview ? styles.mainSplit : ''}`}>
        <div className={showPreview ? styles.workspace : styles.workspaceSingle}>
          <div ref={editScrollRef} className={styles.editScroll}>
            {step.kind === 'config' ? (
              <>
                <ConfigForm value={d.config} onChange={(v) => d.patchConfig(() => v)} />
                <ContentPtSectionForm
                  section="seo"
                  value={d.content}
                  onChange={(v) => d.patchContent(() => v)}
                />
              </>
            ) : null}

            {step.kind === 'content' ? (
              <ContentPtSectionForm
                section={step.section}
                heroPart={step.section === 'hero' ? step.heroPart : undefined}
                value={d.content}
                onChange={(v) => d.patchContent(() => v)}
              />
            ) : null}

            {step.kind === 'projectsData' ? (
              <ProjectsPtForm
                value={d.projects}
                onChange={(v) => d.setProjects(v)}
                activeIndex={projectTab}
                onActiveIndexChange={setProjectTab}
              />
            ) : null}
          </div>

          {showPreview ? (
            <PortfolioDraftPreviewProvider>
              <aside
                className={styles.previewColumn}
                style={
                  syncPreviewHeight && previewColumnHeightPx !== undefined
                    ? { height: previewColumnHeightPx, maxHeight: previewColumnHeightPx }
                    : undefined
                }
              >
                <section className={styles.previewSection} aria-label="Pré-visualização da secção">
                  <h2 className={styles.previewHeading}>Pré-visualização</h2>
                  <p className={styles.previewNote}>
                    {step.kind === 'projectsData'
                      ? 'Só o cartão selecionado em «Projeto a editar» (alterações ainda não gravadas).'
                      : step.kind === 'content' && step.section === 'hero'
                        ? step.heroPart === 'intro'
                          ? 'Só o bloco de texto e o botão «Projetos» deste passo (GitHub/LinkedIn não são editados aqui).'
                          : 'Só o mock do browser e os painéis flutuantes deste passo.'
                        : 'Vista aproximada do site com as alterações deste passo (ainda não gravadas).'}
                  </p>
                  <div className={styles.previewFrame}>
                    <EditorWizardPreview step={step} projectCardIndex={projectTab} />
                  </div>
                </section>
              </aside>
            </PortfolioDraftPreviewProvider>
          ) : null}
        </div>
      </main>

    </div>
  )
}
