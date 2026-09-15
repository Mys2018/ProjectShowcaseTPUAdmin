import type { ComponentPropsWithoutRef } from 'react'
import styles from './PartnerSlot.module.css'
import type { Partner } from '../model/types'

interface PartnerSlotProps extends ComponentPropsWithoutRef<'div'> {
  partner: Partner
  description?: string
}

export function PartnerSlot({ partner, description, className, children, onClick, ...props }: PartnerSlotProps) {
  return (
    <div className={`${styles.container} ${onClick && styles.clickable} ${className}`} onClick={onClick} {...props}>
      <div className={styles.body}>
        <img className={styles.avatar} src={partner.avatarUrl} alt='Фото партнёра' />
        <div className={styles.info}>
          <p title={partner.name} className={styles.name}>
            {partner.name}
          </p>
          {description && (
            <p title={description} className={styles.description}>{description}</p>
          )}
        </div>
      </div>
      {children}
    </div>
  )
}
