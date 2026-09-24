import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { usersQueries } from '@/features/users/api/users.queries';
import { PageHeader } from '@/components/layout/PageHeader';
import {
  Alert,
  Badge,
  Button,
  ConfirmDialog,
  Field,
  PageLoader,
  Select,
} from '@/components/ui';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { getErrorMessage } from '@/api/errors';
import { useToast } from '@/providers';
import {
  getDisplayName,
  getStudentInfo,
  listRoleNames,
  ROLE_LABELS,
} from '@/utils/userRoles';
import { ASSIGNABLE_ROLES, type PlatformRoleName } from '@/types';

export function UserDetailPage() {
  const { userId = '' } = useParams();
  const toast = useToast();
  const detail = usersQueries.useDetail(userId, Boolean(userId));
  const scores = usersQueries.useScores(userId, Boolean(userId));
  const assign = usersQueries.useAssignRole(userId);
  const revoke = usersQueries.useRevokeRole(userId);

  const [roleToAdd, setRoleToAdd] = useState<PlatformRoleName>('Moderator');
  const [revokeRole, setRevokeRole] = useState<PlatformRoleName | null>(null);

  useDocumentTitle(detail.data ? getDisplayName(detail.data) : 'Пользователь');

  const roles = useMemo(
    () => (detail.data ? listRoleNames(detail.data) : []),
    [detail.data],
  );
  const student = detail.data ? getStudentInfo(detail.data) : null;
  const availableRoles = ASSIGNABLE_ROLES.filter((r) => !roles.includes(r));

  if (detail.isLoading) return <PageLoader />;
  if (detail.isError || !detail.data) {
    return <Alert tone="error">{getErrorMessage(detail.error, 'Пользователь не найден')}</Alert>;
  }

  const user = detail.data;

  const onAssign = () => {
    assign.mutate(roleToAdd, {
      onSuccess: () => toast.success(`Роль «${ROLE_LABELS[roleToAdd]}» назначена`),
      onError: (err) => toast.error(getErrorMessage(err)),
    });
  };

  const onRevoke = () => {
    if (!revokeRole) return;
    revoke.mutate(revokeRole, {
      onSuccess: () => {
        toast.success(`Роль «${ROLE_LABELS[revokeRole]}» снята`);
        setRevokeRole(null);
      },
      onError: (err) => toast.error(getErrorMessage(err)),
    });
  };

  return (
    <div>
      <PageHeader
        title={getDisplayName(user)}
        description={user.email}
        actions={
          <Link to="/users">
            <Button variant="ghost">← К списку</Button>
          </Link>
        }
      />

      <div className="detail-grid">
        <div className="card">
          <div className="card-title">Профиль</div>
          <dl>
            <div className="kv">
              <dt>ID</dt>
              <dd className="mono">{user.userId}</dd>
            </div>
            <div className="kv">
              <dt>Email</dt>
              <dd>{user.email}</dd>
            </div>
            <div className="kv">
              <dt>Био</dt>
              <dd>{user.meta.bio || '—'}</dd>
            </div>
            <div className="kv">
              <dt>Портфолио</dt>
              <dd>
                {user.meta.portfolioLink ? (
                  <a href={user.meta.portfolioLink} target="_blank" rel="noreferrer">
                    {user.meta.portfolioLink}
                  </a>
                ) : (
                  '—'
                )}
              </dd>
            </div>
            <div className="kv">
              <dt>Мессенджеры</dt>
              <dd>
                {[
                  user.meta.messengers.telegram && `TG: ${user.meta.messengers.telegram}`,
                  user.meta.messengers.vk && `VK: ${user.meta.messengers.vk}`,
                  user.meta.messengers.element && `Element: ${user.meta.messengers.element}`,
                ]
                  .filter(Boolean)
                  .join(' · ') || '—'}
              </dd>
            </div>
            <div className="kv">
              <dt>Баллы</dt>
              <dd>
                {scores.isLoading
                  ? '…'
                  : scores.data
                    ? scores.data.totalScore
                    : '—'}
              </dd>
            </div>
          </dl>
        </div>

        {student ? (
          <div className="card">
            <div className="card-title">Студент</div>
            <dl>
              <div className="kv">
                <dt>Курс</dt>
                <dd>{student.course}</dd>
              </div>
              <div className="kv">
                <dt>Школа</dt>
                <dd>{student.school}</dd>
              </div>
              <div className="kv">
                <dt>Группа</dt>
                <dd>{student.meta.group}</dd>
              </div>
            </dl>
          </div>
        ) : null}

        <div className="card">
          <div className="card-title">Роли платформы</div>
          <div className="badge-list" style={{ marginBottom: 16 }}>
            {roles.length === 0 ? (
              <span className="muted">Ролей нет</span>
            ) : (
              roles.map((role) => (
                <Badge key={role} tone={ASSIGNABLE_ROLES.includes(role as PlatformRoleName) ? 'info' : 'neutral'}>
                  {ROLE_LABELS[role] || role}
                  {ASSIGNABLE_ROLES.includes(role as PlatformRoleName) ? (
                    <button
                      type="button"
                      className="toast-close"
                      title="Снять роль"
                      onClick={() => setRevokeRole(role as PlatformRoleName)}
                    >
                      ×
                    </button>
                  ) : null}
                </Badge>
              ))
            )}
          </div>

          <div className="row">
            <Field label="Назначить роль">
              <Select
                value={roleToAdd}
                onChange={(e) => setRoleToAdd(e.target.value as PlatformRoleName)}
              >
                {(availableRoles.length ? availableRoles : ASSIGNABLE_ROLES).map((role) => (
                  <option key={role} value={role}>
                    {ROLE_LABELS[role]}
                  </option>
                ))}
              </Select>
            </Field>
            <Button
              variant="primary"
              loading={assign.isPending}
              disabled={!availableRoles.length}
              onClick={onAssign}
            >
              Назначить
            </Button>
          </div>
        </div>

        {user.capabilities && user.capabilities.length > 0 ? (
          <div className="card">
            <div className="card-title">Capabilities</div>
            <div className="badge-list">
              {user.capabilities.map((cap) => (
                <Badge key={cap}>{cap}</Badge>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <ConfirmDialog
        open={Boolean(revokeRole)}
        title="Снять роль"
        message={
          revokeRole
            ? `Снять роль «${ROLE_LABELS[revokeRole]}» у пользователя ${getDisplayName(user)}?`
            : ''
        }
        confirmLabel="Снять"
        danger
        loading={revoke.isPending}
        onClose={() => setRevokeRole(null)}
        onConfirm={onRevoke}
      />
    </div>
  );
}
