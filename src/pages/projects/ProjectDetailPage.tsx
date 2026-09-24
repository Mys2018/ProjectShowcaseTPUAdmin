import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { projectsQueries } from '@/features/projects/api/projects.queries';
import { PageHeader } from '@/components/layout/PageHeader';
import {
  Alert,
  Badge,
  Button,
  ConfirmDialog,
  Field,
  PageLoader,
  Select,
  Table,
  Textarea,
} from '@/components/ui';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { getErrorMessage } from '@/api/errors';
import { useToast } from '@/providers';
import { formatDate } from '@/utils/format';
import { getDisplayName } from '@/utils/userRoles';
import {
  ALL_PROJECT_STATUSES,
  getProjectType,
  PROJECT_STATUS_LABELS,
  PROJECT_STATUS_TONES,
  PROJECT_TYPE_LABELS,
  statusNeedsComment,
} from '@/utils/projectStatus';
import type { ProjectStatus, UserCard } from '@/types';

export function ProjectDetailPage() {
  const { projectId = '' } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const detail = projectsQueries.useDetail(projectId);
  const team = projectsQueries.useTeam(projectId, Boolean(projectId));
  const review = projectsQueries.useReview(projectId, Boolean(projectId));
  const updateStatus = projectsQueries.useUpdateStatus(projectId);
  const promote = projectsQueries.usePromote(projectId);
  const removeMember = projectsQueries.useRemoveMember(projectId);
  const unblock = projectsQueries.useUnblock(projectId);
  const removeProject = projectsQueries.useRemove();

  const [statusDraft, setStatusDraft] = useState<ProjectStatus | null>(null);
  const [comment, setComment] = useState('');
  const [statusError, setStatusError] = useState<string | null>(null);
  const [memberToRemove, setMemberToRemove] = useState<UserCard | null>(null);
  const [confirmUnblock, setConfirmUnblock] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useDocumentTitle(detail.data?.meta.title || 'Проект');

  if (detail.isLoading) return <PageLoader />;
  if (detail.isError || !detail.data) {
    return <Alert tone="error">{getErrorMessage(detail.error, 'Проект не найден')}</Alert>;
  }

  const project = detail.data;
  const type = getProjectType(project);
  const status = statusDraft ?? project.status;

  const submitStatus = () => {
    if (statusNeedsComment(status) && !comment.trim()) {
      setStatusError('Для этого статуса нужен комментарий');
      return;
    }
    setStatusError(null);
    updateStatus.mutate(
      {
        status,
        body: comment.trim() ? { comment: comment.trim() } : undefined,
      },
      {
        onSuccess: () => {
          toast.success('Статус обновлён');
          setComment('');
          setStatusDraft(null);
        },
        onError: (err) => toast.error(getErrorMessage(err)),
      },
    );
  };

  return (
    <div>
      <PageHeader
        title={project.meta.title}
        description={`${PROJECT_TYPE_LABELS[type]} · ${project.id}`}
        actions={
          <>
            <Link to="/projects">
              <Button variant="ghost">← К списку</Button>
            </Link>
            <Button
              variant={project.isPromoted ? 'secondary' : 'primary'}
              loading={promote.isPending}
              onClick={() =>
                promote.mutate(
                  { isPromoted: !project.isPromoted },
                  {
                    onSuccess: () =>
                      toast.success(
                        project.isPromoted ? 'Продвижение снято' : 'Проект продвинут',
                      ),
                    onError: (err) => toast.error(getErrorMessage(err)),
                  },
                )
              }
            >
              {project.isPromoted ? 'Снять promo' : 'Продвинуть'}
            </Button>
            <Link to={`/projects/${project.id}/edit`}><Button variant="secondary">Редактировать</Button></Link>
            <Button variant="danger" onClick={() => setConfirmDelete(true)}>Удалить</Button>
            <Button variant="secondary" onClick={() => setConfirmUnblock(true)}>
              Разблокировать timesheet
            </Button>
          </>
        }
      />

      <div className="detail-grid">
        <div className="card">
          <div className="row" style={{ marginBottom: 12 }}>
            <Badge tone={PROJECT_STATUS_TONES[project.status]}>
              {PROJECT_STATUS_LABELS[project.status]}
            </Badge>
            {project.isPromoted ? <Badge tone="success">Promo</Badge> : null}
          </div>
          <p style={{ whiteSpace: 'pre-wrap' }}>{project.meta.description}</p>
          <dl style={{ marginTop: 16 }}>
            <div className="kv">
              <dt>Владелец</dt>
              <dd className="mono">{project.ownerId}</dd>
            </div>
            <div className="kv">
              <dt>Партнёр</dt>
              <dd>{project.partner.name}</dd>
            </div>
            <div className="kv">
              <dt>Основной тег</dt>
              <dd>{project.primaryTag?.tagName || '—'}</dd>
            </div>
            <div className="kv">
              <dt>Теги</dt>
              <dd>
                <div className="badge-list">
                  {(project.tags ?? []).map((tag) => (
                    <Badge key={tag.tagId}>{tag.tagName}</Badge>
                  ))}
                  {(project.tags ?? []).length === 0 ? '—' : null}
                </div>
              </dd>
            </div>
          </dl>
        </div>

        <div className="card">
          <div className="card-title">Смена статуса</div>
          <div className="stack">
            <Field label="Новый статус">
              <Select
                value={status}
                onChange={(e) => setStatusDraft(e.target.value as ProjectStatus)}
              >
                {ALL_PROJECT_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {PROJECT_STATUS_LABELS[s]}
                  </option>
                ))}
              </Select>
            </Field>
            <Field
              label="Комментарий"
              hint={
                statusNeedsComment(status)
                  ? 'Обязателен для «На доработке» и «Отклонён»'
                  : 'Необязательно'
              }
              error={statusError || undefined}
            >
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Комментарий модератора"
              />
            </Field>
            <div>
              <Button
                variant="primary"
                loading={updateStatus.isPending}
                onClick={submitStatus}
              >
                Обновить статус
              </Button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-title">Комментарий модерации</div>
          {review.isLoading ? (
            <span className="muted">Загрузка…</span>
          ) : (
            <p style={{ whiteSpace: 'pre-wrap' }}>
              {review.data?.comment || 'Комментариев нет'}
            </p>
          )}
        </div>

        <div className="card">
          <div className="card-title">Роли в проекте</div>
          {(project.roles ?? []).length === 0 ? (
            <span className="muted">Роли не заданы</span>
          ) : (
            <Table
              rows={project.roles ?? []}
              rowKey={(row) => row.roleId}
              columns={[
                {
                  key: 'type',
                  header: 'Роль',
                  render: (row) => row.roleType.name,
                },
                {
                  key: 'places',
                  header: 'Места',
                  render: (row) => `${row.places?.length ?? 0}/${row.placesCount}`,
                },
                {
                  key: 'min',
                  header: 'Мин.',
                  render: (row) => row.minPlacesCount,
                },
                {
                  key: 'apps',
                  header: 'Заявки',
                  render: (row) => row.applicationsCount,
                },
                {
                  key: 'skills',
                  header: 'Скиллы',
                  render: (row) =>
                    (row.skills ?? []).map((s) => s.skillName).join(', ') || '—',
                },
              ]}
            />
          )}
        </div>

        <div className="card">
          <div className="card-title">Команда</div>
          {team.isLoading ? <PageLoader label="Загрузка команды…" /> : null}
          {team.isError ? (
            <Alert tone="error">{getErrorMessage(team.error)}</Alert>
          ) : null}
          {team.data ? (
            <Table<UserCard>
              rows={team.data}
              rowKey={(row) => row.userId}
              emptyText="В команде никого нет"
              columns={[
                {
                  key: 'name',
                  header: 'Участник',
                  render: (row) => (
                    <Link to={`/users/${row.userId}`}>{getDisplayName(row)}</Link>
                  ),
                },
                {
                  key: 'email',
                  header: 'Email',
                  render: (row) => row.email,
                },
                {
                  key: 'actions',
                  header: '',
                  render: (row) => (
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMemberToRemove(row);
                      }}
                    >
                      Удалить
                    </Button>
                  ),
                },
              ]}
            />
          ) : null}
        </div>

        <div className="card">
          <div className="card-title">Чекпоинты</div>
          <div className="muted text-sm" style={{ marginBottom: 8 }}>
            Набор: <span className="mono">{project.checkpoints.id}</span>
          </div>
          <ul className="stack">
            {(project.checkpoints.checkpoints ?? []).map((cp) => (
              <li key={`${cp.title}-${cp.deadline}`}>
                <strong>{cp.title}</strong>
                <span className="muted"> · {formatDate(cp.deadline)}</span>
              </li>
            ))}
            {(project.customCheckpoints ?? []).map((cp) => (
              <li key={`c-${cp.title}-${cp.deadline}`}>
                <strong>{cp.title}</strong>
                <span className="muted"> · {formatDate(cp.deadline)} (custom)</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(memberToRemove)}
        title="Удалить из команды"
        message={
          memberToRemove
            ? `Удалить ${getDisplayName(memberToRemove)} из команды проекта?`
            : ''
        }
        confirmLabel="Удалить"
        danger
        loading={removeMember.isPending}
        onClose={() => setMemberToRemove(null)}
        onConfirm={() => {
          if (!memberToRemove) return;
          removeMember.mutate(memberToRemove.userId, {
            onSuccess: () => {
              toast.success('Участник удалён');
              setMemberToRemove(null);
            },
            onError: (err) => toast.error(getErrorMessage(err)),
          });
        }}
      />

      <ConfirmDialog
        open={confirmDelete}
        title="Удалить проект"
        message={`Удалить проект «${project.meta.title}»?`}
        confirmLabel="Удалить"
        danger
        loading={removeProject.isPending}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => {
          removeProject.mutate(project.id, {
            onSuccess: () => { toast.success('Проект удалён'); navigate('/projects'); },
            onError: (err) => toast.error(getErrorMessage(err)),
          });
        }}
      />

      <ConfirmDialog
        open={confirmUnblock}
        title="Разблокировать timesheet"
        message="Снять блокировку выставления часов/оценки по этому проекту?"
        confirmLabel="Разблокировать"
        loading={unblock.isPending}
        onClose={() => setConfirmUnblock(false)}
        onConfirm={() => {
          unblock.mutate(undefined, {
            onSuccess: () => {
              toast.success('Timesheet разблокирован');
              setConfirmUnblock(false);
            },
            onError: (err) => toast.error(getErrorMessage(err)),
          });
        }}
      />
    </div>
  );
}
