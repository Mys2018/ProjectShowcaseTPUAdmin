import type { ComponentPropsWithoutRef } from 'react'
import styles from './ProjectRoleTypeRow.module.css'
import type { ProjectRoleType } from '../model/types'

interface ProjectRoleTypeRowProps extends ComponentPropsWithoutRef<'div'> {
  roleType: ProjectRoleType
}

export function ProjectRoleTypeRow({ roleType, className, children }: ProjectRoleTypeRowProps) {
  return (
    <div className={`${styles.container} ${className ?? ''}`} key={roleType.id}>
      <p>{roleType.name}</p>
      <div className={styles.actions}>{children}</div>
    </div>
  )
}
