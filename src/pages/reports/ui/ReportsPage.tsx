import { Link } from 'react-router-dom'
import styles from './ReportsPage.module.css'
import {
  ALL_PROJECT_STATUSES,
  getStatusTranslation,
  useProjectsStatusCounts,
  type ProjectStatus
} from '@/entities/project'
import { useComplaints } from '@/entities/complaint'
import { Card, ROUTES, Spinner } from '@/shared'

const REPORT_STATUSES: ProjectStatus[] = [...ALL_PROJECT_STATUSES]

export const ReportsPage = () => {
  const counts = useProjectsStatusCounts(REPORT_STATUSES)
  const complaints = useComplaints({ offset: 0, limit: 50 })

  const items = complaints.data?.items ?? []
  const pending = items.filter(c => c.status === 'Pending').length
  const resolved = items.filter(c => c.status === 'Resolved').length
  const dismissed = items.filter(c => c.status === 'Dismissed').length

  const recruiting = counts.data?.recruiting ?? 0
  const inProgress = counts.data?.inprogress ?? 0
  const completed = counts.data?.completed ?? 0
  const pendingMod = counts.data?.pending ?? 0
  const rework = counts.data?.needsrework ?? 0

  return (
    <main className={styles.main}>
      <h2>Отчёты</h2>
      <p className={styles.lead}>
        Сводка по доступным данным API: статусы проектов и жалобы. Отдельного analytics API нет —
        цифры собраны из списков.
      </p>

      <div className={styles.grid}>
        <Card title='Воронка проектов' className={styles.card}>
          {counts.isLoading ? <Spinner /> : null}
          {counts.isError ? <p className={styles.error}>Ошибка загрузки</p> : null}
          {counts.data ? (
            <>
              <div className={styles.kpiRow}>
                <div className={styles.kpi}>
                  <span className={styles.kpiLabel}>На модерации</span>
                  <strong>{pendingMod}</strong>
                </div>
                <div className={styles.kpi}>
                  <span className={styles.kpiLabel}>Доработка</span>
                  <strong>{rework}</strong>
                </div>
                <div className={styles.kpi}>
                  <span className={styles.kpiLabel}>Набор</span>
                  <strong className={styles.good}>{recruiting}</strong>
                </div>
                <div className={styles.kpi}>
                  <span className={styles.kpiLabel}>В работе</span>
                  <strong className={styles.good}>{inProgress}</strong>
                </div>
                <div className={styles.kpi}>
                  <span className={styles.kpiLabel}>Завершено</span>
                  <strong className={styles.good}>{completed}</strong>
                </div>
              </div>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Статус</th>
                    <th>Кол-во</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {REPORT_STATUSES.map(status => (
                    <tr key={status}>
                      <td>{getStatusTranslation(status)}</td>
                      <td className={styles.num}>{counts.data[status] ?? 0}</td>
                      <td>
                        <Link className={styles.link} to={`${ROUTES.PROJECTS}?status=${status}`}>
                          Открыть
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : null}
        </Card>

        <Card title='Жалобы' className={styles.card}>
          {complaints.isLoading ? <Spinner /> : null}
          {complaints.isError ? <p className={styles.error}>Ошибка загрузки жалоб</p> : null}
          {complaints.isSuccess ? (
            <>
              <div className={styles.kpiRow}>
                <div className={styles.kpi}>
                  <span className={styles.kpiLabel}>Ожидают</span>
                  <strong className={styles.warn}>{pending}</strong>
                </div>
                <div className={styles.kpi}>
                  <span className={styles.kpiLabel}>Приняты</span>
                  <strong>{resolved}</strong>
                </div>
                <div className={styles.kpi}>
                  <span className={styles.kpiLabel}>Отклонены</span>
                  <strong>{dismissed}</strong>
                </div>
              </div>
              <p className={styles.hint}>
                Показаны до 50 последних жалоб. Полный список — в настройках.
              </p>
              <Link className={styles.more} to={ROUTES.SETTINGS.COMPLAINTS}>
                К жалобам →
              </Link>
            </>
          ) : null}
        </Card>

        <Card title='Студенты и баллы' className={styles.card}>
          <p className={styles.hint}>
            Массовой выгрузки баллов по всем студентам в API нет. Баллы конкретного пользователя
            доступны на его карточке (`GET /users/&#123;id&#125;/scores`).
          </p>
          <Link className={styles.more} to={ROUTES.USERS}>
            К пользователям →
          </Link>
        </Card>
      </div>
    </main>
  )
}
