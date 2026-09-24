import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { projectsQueries } from '@/features/projects/api/projects.queries';
import { PageHeader } from '@/components/layout/PageHeader';
import {
  Alert,
  Badge,
  Button,
  Field,
  PageLoader,
  Pagination,
  SearchInput,
  Select,
  Table,
} from '@/components/ui';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { usePagination } from '@/hooks/usePagination';
import { getErrorMessage } from '@/api/errors';
import {
  ALL_PROJECT_STATUSES,
  getProjectType,
  PROJECT_STATUS_LABELS,
  PROJECT_STATUS_TONES,
  PROJECT_TYPE_LABELS,
} from '@/utils/projectStatus';
import type { ProjectResponse, ProjectStatus, ProjectType } from '@/types';

export function ProjectsPage() {
  useDocumentTitle('Проекты');
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const { offset, limit, setPage } = usePagination({ defaultLimit: 20 });

  const [q, setQ] = useState(params.get('q') || '');
  const debouncedQ = useDebouncedValue(q, 350);
  const status = (params.get('status') || '') as ProjectStatus | '';
  const projectType = (params.get('type') || '') as ProjectType | '';

  const listParams = useMemo(
    () => ({
      offset,
      limit,
      q: debouncedQ || undefined,
      status: status || undefined,
      projectType: projectType || undefined,
      sort: 'created_desc' as const,
    }),
    [offset, limit, debouncedQ, status, projectType],
  );

  const list = projectsQueries.useList(listParams);

  const patchParams = (patch: Record<string, string | null>) => {
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      Object.entries(patch).forEach(([key, value]) => {
        if (!value) next.delete(key);
        else next.set(key, value);
      });
      next.set('offset', '0');
      return next;
    });
  };

  return (
    <div>
      <PageHeader
        title="Проекты"
        description="Список проектов, статусы, продвижение и команда"
        actions={
          <Button variant="primary" onClick={() => navigate('/projects/new')}>
            Создать проект
          </Button>
        }
      />

      <div className="toolbar">
        <div className="toolbar-grow">
          <SearchInput
            value={q}
            onChange={(value) => {
              setQ(value);
              patchParams({ q: value || null });
            }}
            placeholder="Поиск по названию"
          />
        </div>
        <Field label="Статус">
          <Select
            value={status}
            onChange={(e) => patchParams({ status: e.target.value || null })}
          >
            <option value="">Все</option>
            {ALL_PROJECT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {PROJECT_STATUS_LABELS[s]}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Тип">
          <Select
            value={projectType}
            onChange={(e) => patchParams({ type: e.target.value || null })}
          >
            <option value="">Все</option>
            {(Object.keys(PROJECT_TYPE_LABELS) as ProjectType[]).map((t) => (
              <option key={t} value={t}>
                {PROJECT_TYPE_LABELS[t]}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      {list.isLoading ? <PageLoader /> : null}
      {list.isError ? <Alert tone="error">{getErrorMessage(list.error)}</Alert> : null}

      {list.data ? (
        <div className="card" style={{ padding: 0 }}>
          <Table<ProjectResponse>
            rows={list.data.hits ?? []}
            rowKey={(row) => row.id}
            onRowClick={(row) => navigate(`/projects/${row.id}`)}
            columns={[
              {
                key: 'title',
                header: 'Название',
                render: (row) => (
                  <div>
                    <div>{row.meta.title}</div>
                    <div className="muted text-sm mono">{row.id}</div>
                  </div>
                ),
              },
              {
                key: 'type',
                header: 'Тип',
                render: (row) => PROJECT_TYPE_LABELS[getProjectType(row)],
              },
              {
                key: 'status',
                header: 'Статус',
                render: (row) => (
                  <Badge tone={PROJECT_STATUS_TONES[row.status]}>
                    {PROJECT_STATUS_LABELS[row.status]}
                  </Badge>
                ),
              },
              {
                key: 'partner',
                header: 'Партнёр',
                render: (row) => row.partner.name,
              },
              {
                key: 'tag',
                header: 'Тег',
                render: (row) => row.primaryTag?.tagName || '—',
              },
              {
                key: 'promoted',
                header: 'Promo',
                render: (row) =>
                  row.isPromoted ? <Badge tone="success">Да</Badge> : '—',
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
