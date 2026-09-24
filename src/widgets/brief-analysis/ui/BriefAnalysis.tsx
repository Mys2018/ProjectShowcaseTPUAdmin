import { Link } from 'react-router-dom'
import styles from './BriefAnalysis.module.css'
import {
  getStatusTranslation,
  useProjectsStatusCounts,
  type ProjectStatus
} from '@/entities/project'
import { Card, ROUTES, Spinner } from '@/shared'

const BRIEF: ProjectStatus[] = ['pending', 'recruiting', 'inprogress', 'needsrework']

export const BriefAnalysis = () => {
  const counts = useProjectsStatusCounts(BRIEF)

  return (
    <Card title='Краткая аналитика' className={styles.card}>
      {counts.isLoading ? <Spinner /> : null}
      {counts.isError ? <p className={styles.error}>Не удалось загрузить</p> : null}
      {counts.data ? (
        <ul className={styles.list}>
          {BRIEF.map(status => (
            <li key={status}>
              <Link className={styles.row} to={`${ROUTES.PROJECTS}?status=${status}`}>
                <span>{getStatusTranslation(status)}</span>
                <strong>{counts.data[status] ?? 0}</strong>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </Card>
  )
}
