import styles from '../PartnerSlot.module.css'
import styles2 from './PartnerSlotSkeleton.module.css'
import { ImageSkeleton, TextSkeleton } from '@/shared'

interface PartnerSlotSkeletonProps {
  isClickable?: boolean
  className?: string
}

export function PartnerSlotSkeleton({ isClickable = false, className }: PartnerSlotSkeletonProps) {
  return (
    <div className={`${styles.container} ${isClickable ? `${styles.clickable} ${styles2.clickable}` : ''} ${styles2.container} ${className ?? ''}`}>
      <div className={styles.body}>
        <ImageSkeleton className={styles.avatar} />
        <div className={styles2.description}>
          <TextSkeleton rows={2} />
        </div>
      </div>
    </div>
  )
}
