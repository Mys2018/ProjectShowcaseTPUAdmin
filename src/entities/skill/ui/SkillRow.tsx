import type { ComponentPropsWithoutRef } from 'react'
import styles from './SkillRow.module.css'
import type { Skill } from '../model/types'

interface SkillRowProps extends ComponentPropsWithoutRef<'div'> {
  skill: Skill
}

export function SkillRow({ skill, className, children }: SkillRowProps) {
  return (
    <div className={`${styles.container} ${className ?? ''}`}>
      <p>{skill.name}</p>
      <div className={styles.actions}>{children}</div>
    </div>
  )
}
