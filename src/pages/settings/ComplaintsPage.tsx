import { Link } from 'react-router-dom';
import { complaintsQueries } from '@/features/complaints/api/complaints.queries';
import {
  Alert,
  Badge,
  Button,
  PageLoader,
  Pagination,
  Table,
} from '@/components/ui';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { usePagination } from '@/hooks/usePagination';
import { getErrorMessage } from '@/api/errors';
import { useToast } from '@/providers';
import { formatDateTime } from '@/utils/format';
import type { Complaint, ComplaintStatus } from '@/types';

const STATUS_LABELS: Record<ComplaintStatus, string> = {
  Pending: 'Ожидает',
  Resolved: 'Принята',
  Dismissed: 'Отклонена',
};

const STATUS_TONES: Record<ComplaintStatus, 'warning' | 'success' | 'neutral'> = {
  Pending: 'warning',
  Resolved: 'success',
  Dismissed: 'neutral',
};

export function ComplaintsPage() {
  useDocumentTitle('Жалобы');
  const toast = useToast();
  const { offset, limit, setPage } = usePagination({ defaultLimit: 20 });
  const list = complaintsQueries.useList({ offset, limit });
  const resolve = complaintsQueries.useResolve();

  const act = (id: string, status: ComplaintStatus) => {
    resolve.mutate(
      { id, body: { status } },
      {
        onSuccess: () =>
          toast.success(status === 'Resolved' ? 'Жалоба принята' : 'Жалоба отклонена'),
        onError: (err) => toast.error(getErrorMessage(err)),
      },
    );
  };

  return (
    <div>
      {list.isLoading ? <PageLoader /> : null}
      {list.isError ? <Alert tone="error">{getErrorMessage(list.error)}</Alert> : null}

      {list.data ? (
        <div className="card" style={{ padding: 0 }}>
          <Table<Complaint>
            rows={list.data.items ?? []}
            rowKey={(row) => row.id}
            columns={[
              {
                key: 'status',
                header: 'Статус',
                render: (row) => (
                  <Badge tone={STATUS_TONES[row.status]}>
                    {STATUS_LABELS[row.status]}
                  </Badge>
                ),
              },
              {
                key: 'reason',
                header: 'Причина',
                render: (row) => row.reason,
              },
              {
                key: 'target',
                header: 'На кого',
                render: (row) => (
                  <Link to={`/users/${row.targetUserId}`}>{row.targetUserId}</Link>
                ),
              },
              {
                key: 'reporter',
                header: 'Кто',
                render: (row) => (
                  <Link to={`/users/${row.reporterId}`}>{row.reporterId}</Link>
                ),
              },
              {
                key: 'created',
                header: 'Создана',
                render: (row) => formatDateTime(row.createdAt),
              },
              {
                key: 'actions',
                header: '',
                render: (row) =>
                  row.status === 'Pending' ? (
                    <div className="row">
                      <Button
                        size="sm"
                        variant="primary"
                        loading={resolve.isPending}
                        onClick={() => act(row.id, 'Resolved')}
                      >
                        Принять
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        loading={resolve.isPending}
                        onClick={() => act(row.id, 'Dismissed')}
                      >
                        Отклонить
                      </Button>
                    </div>
                  ) : (
                    <span className="muted text-sm">
                      {row.resolvedAt ? formatDateTime(row.resolvedAt) : '—'}
                    </span>
                  ),
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
