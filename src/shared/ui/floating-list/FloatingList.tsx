import type { ComponentPropsWithoutRef } from 'react'
import styles from './FloatingList.module.css'

export function FloatingList({ className, children, ...props }: ComponentPropsWithoutRef<'div'>) {
  return (
    <div className={`${styles.list} ${className ?? ''}`} {...props}>
      {children}
    </div>
  )
}
