import { usePortfolioDisplay } from '../../pages/portfolio/PortfolioDraftContext'
import {
  findSkillByName,
  getSkillCatalogItems,
  getSkillGroupsForDisplay,
  getSkillLevelLabel,
} from '../../site/skillsCatalog'
import { Reveal } from '../Reveal/Reveal'
import { SkillIcon } from './SkillIcon'
import styles from './Skills.module.css'

export function Skills() {
  const { content } = usePortfolioDisplay()
  const { skills } = content
  const groups = getSkillGroupsForDisplay()
  const catalogItems = getSkillCatalogItems()

  return (
    <section id="skills" className={styles.section} aria-labelledby="skills-heading">
      <div className={styles.container}>
        <Reveal instant>
          <header className={styles.head}>
            <p className={styles.kicker}>{skills.kicker}</p>
            <h2 id="skills-heading" className={styles.title}>
              {skills.title}
            </h2>
            <p className={styles.sub}>{skills.sub}</p>
          </header>
        </Reveal>

        <ul className={styles.srSkillIndex} aria-hidden="true">
          {catalogItems.map((item) => (
            <li
              key={item.id}
              data-skill-id={item.id}
              data-skill-name={item.name}
              data-skill-category={item.category}
              data-skill-level={item.level}
            >
              {item.name}
              {item.aliases.length > 0 ? ` (${item.aliases.join(', ')})` : ''}
            </li>
          ))}
        </ul>

        <div className={styles.grid}>
          {groups.map((g, gi) => (
            <Reveal key={`${gi}-${g.title}`}>
              <article className={styles.card}>
                <h3 className={styles.cardTitle}>{g.title}</h3>
                <ul className={styles.list}>
                  {g.items.map((itemName) => {
                    const entry = findSkillByName(itemName)
                    return (
                      <li
                        key={itemName}
                        className={styles.item}
                        data-skill-id={entry?.id}
                        data-skill-category={entry?.category}
                        data-skill-level={entry?.level}
                      >
                        <SkillIcon name={itemName} />
                        <span>{itemName}</span>
                        {entry ? (
                          <span className={styles.level} aria-label={`Nível: ${getSkillLevelLabel(entry.level)}`}>
                            {getSkillLevelLabel(entry.level)}
                          </span>
                        ) : null}
                      </li>
                    )
                  })}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
