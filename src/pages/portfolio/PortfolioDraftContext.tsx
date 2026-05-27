import { useSite } from '../../i18n/SiteProvider'

/** Site content for portfolio sections (English). */
export function usePortfolioDisplay() {
  const base = useSite()
  return {
    config: base.config,
    content: base.content,
    projects: base.projects,
  }
}
