import { useParams } from 'react-router-dom'
import styles from './UserPage.module.css'
import { UserProjectsList } from '@/widgets/user-projects-list'
import { UserProfileInfo } from '@/widgets/user-profile-info'
import { UserRolesManager } from '@/widgets/user-roles-manager'

export const UserPage = () => {
  const { id } = useParams()
  if (!id) return <h1>Произошла ошибка :P</h1>

  return (
    <main className={styles.main}>
      <h2>Страница пользователя</h2>
      <div className={styles.container}>
        <div className={styles.side}>
          <UserRolesManager userId={id} />
        </div>
        <div className={styles.info}>
          <UserProfileInfo userId={id} />
          <UserProjectsList userId={id} />
        </div>
      </div>
    </main>
  )
}
