import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { usersQueries } from '@/features/users/api/users.queries';
import { PageHeader } from '@/components/layout/PageHeader';
import {
  Alert,
  Badge,
  PageLoader,
  Pagination,
  SearchInput,
  Table,
} from '@/components/ui';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { usePagination } from '@/hooks/usePagination';
import { getErrorMessage } from '@/api/errors';
import { getDisplayName, ROLE_LABELS } from '@/utils/userRoles';
import type { UserCard } from '@/types';

export function UsersPage() {
  useDocumentTitle('Пользователи');
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const { offset, limit, setPage } = usePagination({ defaultLimit: 20 });
  const [query, setQuery] = useState(params.get('q') || '');
  const debouncedQuery = useDebouncedValue(query, 350);

  const listParams = useMemo(
    () => ({ offset, limit, query: debouncedQuery || undefined }),
    [offset, limit, debouncedQuery],
  );

  const list = usersQueries.useList(listParams);

  const onSearch = (value: string) => {
    setQuery(value);
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set('q', value);
      else next.delete('q');
      next.set('offset', '0');
      return next;
    });
  };

  return (
    <div>
      <PageHeader
        title="Пользователи"
        description="Поиск пользователей, просмотр курса и управление ролями"
      />
      <div className="toolbar">
        <div className="toolbar-grow">
          <SearchInput
            value={query}
            onChange={onSearch}
            placeholder="Поиск по имени или email"
          />
        </div>
      </div>

      {list.isLoading ? <PageLoader /> : null}
      {list.isError ? (
        <Alert tone="error">{getErrorMessage(list.error)}</Alert>
      ) : null}

      {list.data ? (
        <div className="card" style={{ padding: 0 }}>
          <Table<UserCard>
            rows={list.data.users ?? []}
            rowKey={(row) => row.userId}
            onRowClick={(row) => navigate(`/users/${row.userId}`)}
            columns={[
              {
                key: 'name',
                header: 'ФИО',
                render: (row) => getDisplayName(row),
              },
              {
                key: 'email',
                header: 'Email',
                render: (row) => row.email,
              },
              {
                key: 'roles',
                header: 'Роли',
                render: (row) => (
                  <div className="badge-list">
                    {(row.roles ?? []).length === 0 ? (
                      <span className="muted">—</span>
                    ) : (
                      (row.roles ?? []).map((role) => (
                        <Badge key={role}>{ROLE_LABELS[role] || role}</Badge>
                      ))
                    )}
                  </div>
                ),
              },
              {
                key: 'id',
                header: 'ID',
                render: (row) => <span className="mono muted">{row.userId}</span>,
              },
            ]}
          />
          <div style={{ padding: 16 }}>
            <Pagination
              total={list.data.total}
              offset={list.data.offset}
              limit={list.data.limit}
              onChange={setPage}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
