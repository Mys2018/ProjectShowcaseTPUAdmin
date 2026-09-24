import { Link } from 'react-router-dom'
import styles from './MainPage.module.css'
import { Card, ROUTES } from '@/shared'

export const MainPage = () => {
  return (
    <main className={styles.main}>
      <h2>Главная</h2>
      <p className={styles.lead}>Частые действия админки</p>

      <div className={styles.grid}>
        <Card title='Быстрые переходы' className={styles.card}>
          <div className={styles.actions}>
            <Link className={styles.action} to={`${ROUTES.PROJECTS}?status=pending`}>
              Модерация проектов
            </Link>
            <Link className={styles.action} to={`${ROUTES.PROJECTS}?status=needsrework`}>
              На доработке
            </Link>
            <Link className={styles.action} to={`${ROUTES.PROJECTS}?status=recruiting`}>
              Набор открыт
            </Link>
            <Link className={styles.action} to={ROUTES.USERS}>
              Пользователи
            </Link>
            <Link className={styles.action} to={ROUTES.ROLES}>
              Роли и компетенции
            </Link>
            <Link className={styles.action} to={ROUTES.SETTINGS.COMPLAINTS}>
              Жалобы
            </Link>
            <Link className={styles.action} to={ROUTES.REPORTS}>
              Отчёты
            </Link>
          </div>
        </Card>
      </div>
    </main>
  )
}
