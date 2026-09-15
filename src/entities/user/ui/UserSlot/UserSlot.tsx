import type { ComponentPropsWithRef } from 'react'
import styles from './UserSlot.module.css'
import type { UserBase } from '../../model/types'

export interface UserSlotProps extends ComponentPropsWithRef<'div'> {
  user: UserBase
}

export const UserSlot = ({ user, className, children, onClick, ...props }: UserSlotProps) => {
  return (
    <div className={`${styles.container} ${onClick && styles.clickable} ${className}`} onClick={onClick} {...props}>
      <div className={styles.mainInfo}>
        <img className={styles.avatar} src={user.profilePicture} alt="Фото профиля" />
        <div className={styles.description}>
          <p title={user.meta.name} className={styles.name}>{user.meta.name}</p>
          <p className={styles.id}>{user.id}</p>
        </div>
      </div>
      {children}
    </div>
  )
}
