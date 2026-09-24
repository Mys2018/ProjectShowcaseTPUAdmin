import { Link } from 'react-router-dom'
import styles from './QuickActionsProjects.module.css'
import { getStatusTranslation, type ProjectStatus } from '@/entities/project'
import { Card, ROUTES } from '@/shared'

const QUICK_STATUSES: ProjectStatus[] = ['pending', 'needsrework', 'recruiting', 'inprogress']

export const QuickActionsProjects = () => {
  return (
    <Card title='Быстрые действия' className={styles.card}>
      <p className={styles.snippet}>Частые фильтры</p>
      <div className={styles.chipRow}>
        {QUICK_STATUSES.map(status => (
          <Link key={status} className={styles.chip} to={`${ROUTES.PROJECTS}?status=${status}`}>
            {getStatusTranslation(status)}
          </Link>
        ))}
        <Link className={styles.chip} to={ROUTES.PROJECTS}>
          Все проекты
        </Link>
        <Link className={styles.chip} to={ROUTES.REPORTS}>
          Отчёты
        </Link>
      </div>
    </Card>
  )
}
