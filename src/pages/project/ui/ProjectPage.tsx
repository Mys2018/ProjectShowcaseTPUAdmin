import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import styles from './ProjectPage.module.css'
import {
  useRemoveProjectTeamMember,
  useSetProjectPromoted,
  useUnblockProject,
  useUpdateProjectStatus
} from '@/features/manage-project'
import {
  ALL_PROJECT_STATUSES,
  getStatusTranslation,
  getTypeTranslation,
  statusNeedsComment,
  useProjectById,
  useProjectReview,
  useProjectTeam,
  type ProjectStatus
} from '@/entities/project'
import { AgreeButton, Card, ConfirmModal, ROUTES, Spinner, userPath } from '@/shared'

export function ProjectPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const detail = useProjectById(id, Boolean(id))
  const team = useProjectTeam(id, Boolean(id))
  const review = useProjectReview(id, Boolean(id))

  const updateStatus = useUpdateProjectStatus(id)
  const promote = useSetProjectPromoted(id)
  const removeMember = useRemoveProjectTeamMember(id)
  const unblock = useUnblockProject(id)

  const [statusDraft, setStatusDraft] = useState<ProjectStatus | null>(null)
  const [comment, setComment] = useState('')
  const [statusError, setStatusError] = useState<string | null>(null)
  const [memberToRemove, setMemberToRemove] = useState<{ id: string; name: string } | null>(null)
  const [confirmUnblock, setConfirmUnblock] = useState(false)

  if (!id) return <h1 className={styles.placeholder}>Произошла ошибка :P</h1>
  if (detail.isLoading) {
    return (
      <main className={styles.main}>
        <Spinner />
      </main>
    )
  }
  if (detail.isError || !detail.data) {
    return <h1 className={styles.placeholder}>Проект не найден</h1>
  }

  const project = detail.data
  const status = statusDraft ?? project.status

  const submitStatus = () => {
    if (statusNeedsComment(status) && !comment.trim()) {
      setStatusError('Для этого статуса нужен комментарий')
      return
    }
    setStatusError(null)
    updateStatus.mutate(
      { status, comment: comment.trim() || undefined },
      {
        onSuccess: () => {
          setComment('')
          setStatusDraft(null)
        }
      }
    )
  }

  return (
    <main className={styles.main}>
      <button
        type='button'
        className={styles.back}
        onClick={() => {
          void navigate(ROUTES.PROJECTS)
        }}
      >
        ← К списку проектов
      </button>

      <div className={styles.header}>
        <div className={styles.titleBlock}>
          <h2>{project.meta.title}</h2>
          <div className={styles.meta}>
            <span>{getStatusTranslation(project.status)}</span>
            <span className={styles.dot} />
            <span>{getTypeTranslation(project.type)}</span>
            <span className={styles.dot} />
            <span title={project.id}>{project.id}</span>
            {project.isPromoted ? (
              <>
                <span className={styles.dot} />
                <span>Promo</span>
              </>
            ) : null}
          </div>
        </div>
        <div className={styles.actions}>
          <AgreeButton
            type='button'
            isLoading={promote.isPending}
            onClick={() => promote.mutate(!project.isPromoted)}
          >
            {project.isPromoted ? 'Снять promo' : 'Продвинуть'}
          </AgreeButton>
          <button type='button' className={styles.ghost} onClick={() => setConfirmUnblock(true)}>
            Разблокировать timesheet
          </button>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.stack}>
          <Card title='О проекте'>
            <p style={{ whiteSpace: 'pre-wrap' }}>{project.meta.description}</p>
            <dl style={{ marginTop: 12 }}>
              <div className={styles.kv}>
                <dt>Владелец</dt>
                <dd>
                  <Link to={userPath(project.ownerId)}>{project.ownerId}</Link>
                </dd>
              </div>
              <div className={styles.kv}>
                <dt>Партнёр</dt>
                <dd>{project.partner?.name || '—'}</dd>
              </div>
              <div className={styles.kv}>
                <dt>Основной тег</dt>
                <dd>{project.primaryTag.name}</dd>
              </div>
              <div className={styles.kv}>
                <dt>Теги</dt>
                <dd>
                  <div className={styles.badgeList}>
                    {(project.tags ?? []).length === 0
                      ? '—'
                      : (project.tags ?? []).map(tag => (
                          <span key={tag.id} className={styles.badge}>
                            {tag.name}
                          </span>
                        ))}
                  </div>
                </dd>
              </div>
            </dl>
          </Card>

          <Card title='Роли в проекте'>
            {(project.roles ?? []).length === 0 ? (
              <p className={styles.placeholder}>Роли не заданы</p>
            ) : (
              <>
                <div className={`${styles.roleRow} ${styles.roleHead}`}>
                  <span>Роль</span>
                  <span>Места</span>
                  <span>Мин.</span>
                  <span>Скиллы</span>
                </div>
                {(project.roles ?? []).map(role => (
                  <div key={role.roleId} className={styles.roleRow}>
                    <span>{role.roleType.name}</span>
                    <span>
                      {role.studentIds.length}/{role.placesCount}
                    </span>
                    <span>{role.minPlacesCount}</span>
                    <span>{role.skills.map(s => s.skillName).join(', ') || '—'}</span>
                  </div>
                ))}
              </>
            )}
          </Card>

          <Card title='Чекпоинты'>
            <p className={styles.hint} style={{ marginBottom: 8 }}>
              Набор: {project.checkpointGroup.title} ({project.checkpointGroup.id})
            </p>
            <div className={styles.stack}>
              {project.checkpointGroup.checkpoints.map(cp => (
                <div key={`${cp.title}-${cp.deadline.toISOString()}`} className={styles.teamRow}>
                  <strong>{cp.title}</strong>
                  <span className={styles.hint}>{cp.deadline.toLocaleDateString('ru-RU')}</span>
                </div>
              ))}
              {(project.customCheckpoints ?? []).map(cp => (
                <div key={`c-${cp.title}-${cp.deadline.toISOString()}`} className={styles.teamRow}>
                  <strong>{cp.title} (custom)</strong>
                  <span className={styles.hint}>{cp.deadline.toLocaleDateString('ru-RU')}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className={styles.stack}>
          <Card title='Смена статуса'>
            <div className={styles.form}>
              <select
                className={styles.select}
                value={status}
                onChange={e => setStatusDraft(e.target.value as ProjectStatus)}
              >
                {ALL_PROJECT_STATUSES.map(s => (
                  <option key={s} value={s}>
                    {getStatusTranslation(s)}
                  </option>
                ))}
              </select>
              <textarea
                className={styles.textarea}
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder='Комментарий модератора'
              />
              <p className={styles.hint}>
                {statusNeedsComment(status)
                  ? 'Обязателен для «На доработке» и «Отклонён»'
                  : 'Комментарий необязателен'}
              </p>
              {statusError ? <p className={styles.error}>{statusError}</p> : null}
              <AgreeButton type='button' isLoading={updateStatus.isPending} onClick={submitStatus}>
                Обновить статус
              </AgreeButton>
            </div>
          </Card>

          <Card title='Комментарий модерации'>
            {review.isLoading ? (
              <Spinner />
            ) : (
              <p style={{ whiteSpace: 'pre-wrap' }}>{review.data?.comment || 'Комментариев нет'}</p>
            )}
          </Card>

          <Card title='Команда'>
            {team.isLoading ? <Spinner /> : null}
            {team.isError ? <p className={styles.error}>Не удалось загрузить команду</p> : null}
            {team.data && team.data.length === 0 ? (
              <p className={styles.placeholder}>В команде никого нет</p>
            ) : null}
            <div className={styles.stack}>
              {(team.data ?? []).map(member => (
                <div key={member.id} className={styles.teamRow}>
                  <div className={styles.teamInfo}>
                    <Link className={styles.teamName} to={userPath(member.id)}>
                      {member.name}
                    </Link>
                    <span className={styles.teamEmail}>{member.email}</span>
                  </div>
                  <button
                    type='button'
                    className={styles.danger}
                    onClick={() => setMemberToRemove({ id: member.id, name: member.name })}
                  >
                    Удалить
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <ConfirmModal
        isOpened={Boolean(memberToRemove)}
        isPending={removeMember.isPending}
        text={memberToRemove ? `Удалить ${memberToRemove.name} из команды проекта?` : undefined}
        onReject={() => setMemberToRemove(null)}
        onSubmit={() => {
          if (!memberToRemove) return
          removeMember.mutate(memberToRemove.id, {
            onSuccess: () => setMemberToRemove(null)
          })
        }}
      />

      <ConfirmModal
        isOpened={confirmUnblock}
        isPending={unblock.isPending}
        text='Снять блокировку выставления часов/оценки по этому проекту?'
        onReject={() => setConfirmUnblock(false)}
        onSubmit={() => {
          unblock.mutate(undefined, {
            onSuccess: () => setConfirmUnblock(false)
          })
        }}
      />
    </main>
  )
}
