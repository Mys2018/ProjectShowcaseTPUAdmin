import type { ComponentPropsWithoutRef, ReactElement } from 'react'
import styles from './CheckpointGroupCard.module.css'
import type { CheckpointGroup } from '../../model/types'
import { CheckpointRow } from '../checkpoint-row/CheckpointRow'

interface CheckpointGroupCardProps extends ComponentPropsWithoutRef<'div'> {
  group: CheckpointGroup
  actions?: ReactElement
}

export function CheckpointGroupCard({ group, actions, children, className, ...props }: CheckpointGroupCardProps) {
  const sorted = [...group.checkpoints].sort(
    (a, b) => a.deadline.getTime() - b.deadline.getTime()
  )

  return (
    <div className={`${styles.container} ${className ?? ''}`} {...props}>
      <div className={styles.header}>
        <h5 className={styles.title}>{group.title}</h5>
        <div className={styles.actions}>{actions}</div>
      </div>
      <ul className={styles.list}>
        {sorted.map(c => (
          <li key={`${c.title}-${c.deadline.toISOString()}`}>
            <CheckpointRow checkpoint={c} />
          </li>
        ))}
      </ul>
      {children}
    </div>
  )
}
