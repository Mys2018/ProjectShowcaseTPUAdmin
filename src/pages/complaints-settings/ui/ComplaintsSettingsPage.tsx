import { Link } from 'react-router-dom'
import styles from './ComplaintsSettingsPage.module.css'
import { useResolveComplaint } from '@/features/manage-complaints'
import { useComplaints, type ComplaintStatus } from '@/entities/complaint'
import { Spinner, userPath } from '@/shared'

const STATUS_LABEL: Record<ComplaintStatus, string> = {
  Pending: 'Ожидает',
  Resolved: 'Принята',
  Dismissed: 'Отклонена'
}

export function ComplaintsSettingsPage() {
  const { data, isLoading, isError, isSuccess } = useComplaints({ offset: 0, limit: 50 })
  const resolve = useResolveComplaint()
  const items = data?.items ?? []

  return (
    <div className={styles.container}>
      <div className={`${styles.row} ${styles.head}`}>
        <span>Статус</span>
        <span>Причина</span>
        <span>На кого</span>
        <span>Кто</span>
        <span>Действия</span>
      </div>
      <div className={styles.list}>
        {isLoading && <Spinner />}
        {isError && <h3 className={styles.placeholder}>Произошла ошибка :P</h3>}
        {isSuccess && items.length === 0 ? (
          <h3 className={styles.placeholder}>Жалоб нет</h3>
        ) : (
          items.map(item => (
            <div key={item.id} className={styles.row}>
              <span
                className={`${styles.badge} ${
                  item.status === 'Pending'
                    ? styles.pending
                    : item.status === 'Resolved'
                      ? styles.resolved
                      : styles.dismissed
                }`}
              >
                {STATUS_LABEL[item.status]}
              </span>
              <span>{item.reason}</span>
              <Link className={styles.link} to={userPath(item.targetUserId)}>
                {item.targetUserId}
              </Link>
              <Link className={styles.link} to={userPath(item.reporterId)}>
                {item.reporterId}
              </Link>
              <div className={styles.actions}>
                {item.status === 'Pending' ? (
                  <>
                    <button
                      type='button'
                      className={styles.button}
                      disabled={resolve.isPending}
                      onClick={() => resolve.mutate({ id: item.id, status: 'Resolved' })}
                    >
                      Принять
                    </button>
                    <button
                      type='button'
                      className={`${styles.button} ${styles.danger}`}
                      disabled={resolve.isPending}
                      onClick={() => resolve.mutate({ id: item.id, status: 'Dismissed' })}
                    >
                      Отклонить
                    </button>
                  </>
                ) : (
                  <span className={styles.dismissed}>—</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
