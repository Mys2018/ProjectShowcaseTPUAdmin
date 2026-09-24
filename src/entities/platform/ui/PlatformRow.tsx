import type { ComponentPropsWithoutRef } from 'react'
import styles from './PlatformRow.module.css'
import type { Platform } from '../model/types'

interface PlatformRowProps extends ComponentPropsWithoutRef<'div'> {
  platform: Platform
}

export function PlatformRow({ platform, className, children }: PlatformRowProps) {
  return (
    <div className={`${styles.container} ${className ?? ''}`}>
      <div className={styles.info}>
        <p className={styles.name}>{platform.name}</p>
        <p className={styles.category}>{platform.category}</p>
      </div>
      <div className={styles.actions}>{children}</div>
    </div>
  )
}
