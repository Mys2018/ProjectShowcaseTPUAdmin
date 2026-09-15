import type { ComponentPropsWithoutRef } from 'react'
import styles from './Card.module.css'

interface CardProps extends ComponentPropsWithoutRef<'section'> {
  title?: string
}

export function Card({ title, children, className, ...props }: CardProps) {
  return (
    <section className={`${styles.container} ${className ?? ''}`} {...props}>
      {title && <h5 className={styles.title}>{title}</h5>}
      {children}
    </section>
  )
}
