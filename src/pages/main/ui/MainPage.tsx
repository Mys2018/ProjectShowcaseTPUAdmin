import { Link } from 'react-router-dom'
import styles from './MainPage.module.css'
import {
  getStatusTranslation,
  useProjectsStatusCounts,
  type ProjectStatus
} from '@/entities/project'
import { useComplaints } from '@/entities/complaint'
import { Card, ROUTES, Spinner } from '@/shared'

const DASHBOARD_STATUSES: ProjectStatus[] = [
  'pending',
  'needsrework',
  'recruiting',
  'inprogress',
  'completed',
  'rejected'
]

export const MainPage = () => {
  const counts = useProjectsStatusCounts(DASHBOARD_STATUSES)
  const complaints = useComplaints({ offset: 0, limit: 1 })

  const pendingComplaints = complaints.data?.items.filter(c => c.status === 'Pending').length

  return (
    <main className={styles.main}>
      <h2>Главная</h2>
      <p className={styles.lead}>Частые действия и сводка по витрине</p>

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

        <Card title='Проекты по статусам' className={styles.card}>
          {counts.isLoading ? <Spinner /> : null}
          {counts.isError ? <p className={styles.error}>Не удалось загрузить сводку</p> : null}
          {counts.data ? (
            <ul className={styles.statList}>
              {DASHBOARD_STATUSES.map(status => (
                <li key={status} className={styles.statRow}>
                  <Link to={`${ROUTES.PROJECTS}?status=${status}`} className={styles.statLink}>
                    <span>{getStatusTranslation(status)}</span>
                    <strong className={styles.statValue}>{counts.data[status] ?? 0}</strong>
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </Card>

        <Card title='Модерация' className={styles.card}>
          <dl className={styles.kv}>
            <div>
              <dt>Жалобы</dt>
              <dd>
                {complaints.isLoading
                  ? '…'
                  : complaints.isError
                    ? '—'
                    : `${pendingComplaints ?? 0} ожидают из ${complaints.data?.total ?? 0}`}
              </dd>
            </div>
          </dl>
          <Link className={styles.more} to={ROUTES.SETTINGS.COMPLAINTS}>
            Открыть жалобы →
          </Link>
        </Card>
      </div>
    </main>
  )
}
