import { Link } from 'react-router-dom'
import styles from './ReportsPage.module.css'
import {
  getProjectTeamStats,
  getStatusTranslation,
  useProjectsReportSnapshot,
  type ProjectStatus,
  type TeamReadiness
} from '@/entities/project'
import { Card, projectPath, ROUTES, Spinner } from '@/shared'

/** Воронка: от ранних (широких) статусов к финальным */
const FUNNEL_STATUSES: ProjectStatus[] = [
  'pending',
  'needsrework',
  'recruiting',
  'recruitmentcompleted',
  'inprogress',
  'completed'
]

const SIDE_STATUSES: ProjectStatus[] = ['rejected', 'notimplemented']

const READINESS_ORDER: TeamReadiness[] = ['not_ready', 'core_only', 'complete']

const READINESS_CLASS: Record<TeamReadiness, string> = {
  not_ready: styles.bad,
  core_only: styles.warn,
  complete: styles.good
}

export const ReportsPage = () => {
  const snapshot = useProjectsReportSnapshot(100)
  const projects = snapshot.data?.projects ?? []
  const totalKnown = snapshot.data?.total ?? projects.length

  const statusCounts: Record<string, number> = {}
  for (const s of [...FUNNEL_STATUSES, ...SIDE_STATUSES]) statusCounts[s] = 0
  for (const p of projects) {
    if (p.status in statusCounts) statusCounts[p.status] += 1
  }

  const readinessCounts: Record<TeamReadiness, number> = {
    not_ready: 0,
    core_only: 0,
    complete: 0
  }

  const rows = projects.map(project => {
    const stats = getProjectTeamStats(project)
    readinessCounts[stats.readiness] += 1
    return { project, stats }
  })

  // Детализация: сначала не готовы, потом основные, потом собраны; внутри — по статусу воронки
  const funnelIndex = (status: string) => {
    const i = FUNNEL_STATUSES.indexOf(status as ProjectStatus)
    return i === -1 ? FUNNEL_STATUSES.length + SIDE_STATUSES.indexOf(status as ProjectStatus) : i
  }

  rows.sort((a, b) => {
    const r =
      READINESS_ORDER.indexOf(a.stats.readiness) - READINESS_ORDER.indexOf(b.stats.readiness)
    if (r !== 0) return r
    return funnelIndex(a.project.status) - funnelIndex(b.project.status)
  })

  const maxFunnel = Math.max(1, ...FUNNEL_STATUSES.map(s => statusCounts[s] ?? 0))

  return (
    <main className={styles.main}>
      <h2>Отчёты</h2>
      <p className={styles.lead}>
        Воронка статусов и укомплектованность команд. Данные по {projects.length}
        {totalKnown > projects.length ? ` из ${totalKnown}` : ''} проектов.
      </p>

      <div className={styles.topGrid}>
        <Card title='Воронка статусов' className={styles.card}>
          {snapshot.isLoading ? <Spinner /> : null}
          {snapshot.isError ? <p className={styles.error}>Ошибка загрузки</p> : null}
          {snapshot.data ? (
            <div className={styles.funnel}>
              {FUNNEL_STATUSES.map((status, index) => {
                const count = statusCounts[status] ?? 0
                const width = Math.max(12, Math.round((count / maxFunnel) * 100))
                return (
                  <div key={status} className={styles.funnelRow}>
                    <div className={styles.funnelMeta}>
                      <span className={styles.funnelStep}>{index + 1}</span>
                      <span className={styles.funnelLabel}>{getStatusTranslation(status)}</span>
                      <strong className={styles.funnelCount}>{count}</strong>
                    </div>
                    <div className={styles.funnelTrack}>
                      <div className={styles.funnelBar} style={{ width: `${width}%` }} />
                    </div>
                    <Link className={styles.link} to={`${ROUTES.PROJECTS}?status=${status}`}>
                      Открыть
                    </Link>
                  </div>
                )
              })}
              <div className={styles.sideRow}>
                {SIDE_STATUSES.map(status => (
                  <Link
                    key={status}
                    className={styles.sideChip}
                    to={`${ROUTES.PROJECTS}?status=${status}`}
                  >
                    {getStatusTranslation(status)}: <strong>{statusCounts[status] ?? 0}</strong>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </Card>

        <Card title='Укомплектованность команд' className={styles.card}>
          {snapshot.isLoading ? <Spinner /> : null}
          {snapshot.data ? (
            <div className={styles.kpiRow}>
              <div className={styles.kpi}>
                <span className={styles.kpiLabel}>Не готовы</span>
                <strong className={styles.bad}>{readinessCounts.not_ready}</strong>
                <span className={styles.kpiHint}>мин. места не закрыты</span>
              </div>
              <div className={styles.kpi}>
                <span className={styles.kpiLabel}>Только основные роли</span>
                <strong className={styles.warn}>{readinessCounts.core_only}</strong>
                <span className={styles.kpiHint}>min ok, есть свободные места</span>
              </div>
              <div className={styles.kpi}>
                <span className={styles.kpiLabel}>Собраны</span>
                <strong className={styles.good}>{readinessCounts.complete}</strong>
                <span className={styles.kpiHint}>все места заняты</span>
              </div>
            </div>
          ) : null}
        </Card>
      </div>

      <Card title='Детализация проектов' className={styles.card}>
        {snapshot.isLoading ? <Spinner /> : null}
        {snapshot.isError ? <p className={styles.error}>Ошибка загрузки</p> : null}
        {snapshot.data ? (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Проект</th>
                  <th>Статус</th>
                  <th>Готовность</th>
                  <th>Укомплектованность</th>
                  <th>Роли</th>
                  <th>Заявки</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className={styles.empty}>
                      Нет проектов
                    </td>
                  </tr>
                ) : (
                  rows.map(({ project, stats }) => (
                    <tr key={project.id}>
                      <td>
                        <Link className={styles.projectLink} to={projectPath(project.id)}>
                          {project.meta.title}
                        </Link>
                      </td>
                      <td>{getStatusTranslation(project.status)}</td>
                      <td>
                        <span
                          className={`${styles.badge} ${READINESS_CLASS[stats.readiness]}`}
                        >
                          {stats.readinessLabel}
                        </span>
                      </td>
                      <td className={styles.num}>
                        {stats.filled}/{stats.places}
                        {stats.minRequired > 0 ? (
                          <span className={styles.muted}> · min {stats.minRequired}</span>
                        ) : null}
                      </td>
                      <td className={styles.roles} title={stats.rolesDetail}>
                        {stats.rolesLabel}
                      </td>
                      <td className={styles.num}>{stats.applications}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : null}
      </Card>
    </main>
  )
}
