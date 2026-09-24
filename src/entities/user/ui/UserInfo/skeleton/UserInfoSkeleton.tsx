import styles from '../UserInfo.module.css'
import s from './UserInfoSkeleton.module.css'
import { TextSkeleton } from '@/shared'

export function UserInfoSkeleton() {
  return (
    <div className={`${styles.container}`}>
      <section className={styles.block}>
        <p className={styles.title}>Контакты</p>
        <TextSkeleton />
      </section>
      <section className={styles.block}>
        <p className={styles.title}>О себе</p>
        <div className={s.description}>
          <TextSkeleton rows={2} />
        </div>
      </section>
      <section className={styles.block}>
        <p className={styles.title}>Интересы</p>
        <TextSkeleton />
      </section>
      <section className={styles.block}>
        <p className={styles.title}>Компетенции и скиллы</p>
        <TextSkeleton />
      </section>
    </div>
  )
}
