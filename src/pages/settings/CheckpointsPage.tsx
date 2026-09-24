import { useState } from 'react';
import { checkpointsQueries } from '@/features/checkpoints/api/checkpoints.queries';
import {
  Alert,
  Button,
  ConfirmDialog,
  Field,
  Input,
  Modal,
  PageLoader,
  Pagination,
  Table,
} from '@/components/ui';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { usePagination } from '@/hooks/usePagination';
import { getErrorMessage } from '@/api/errors';
import { useToast } from '@/providers';
import { formatDate } from '@/utils/format';
import type { ProjectCheckpoint, ProjectCheckpoints } from '@/types';

const emptyItem = (): ProjectCheckpoint => ({ title: '', deadline: '' });

export function CheckpointsPage() {
  useDocumentTitle('Чекпоинты');
  const toast = useToast();
  const { offset, limit, setPage } = usePagination({ defaultLimit: 10 });
  const list = checkpointsQueries.useList({ offset, limit });
  const create = checkpointsQueries.useCreate();
  const update = checkpointsQueries.useUpdate();
  const remove = checkpointsQueries.useRemove();

  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [items, setItems] = useState<ProjectCheckpoint[]>([emptyItem()]);
  const [editing, setEditing] = useState<ProjectCheckpoints | null>(null);
  const [toDelete, setToDelete] = useState<ProjectCheckpoints | null>(null);

  const openCreate = () => {
    setEditing(null);
    setItems([emptyItem(), emptyItem()]);
    setModal('create');
  };

  const openEdit = (set: ProjectCheckpoints) => {
    setEditing(set);
    setItems(set.checkpoints?.length ? set.checkpoints.map((c) => ({ ...c })) : [emptyItem()]);
    setModal('edit');
  };

  const save = () => {
    const checkpoints = items
      .map((i) => ({ title: i.title.trim(), deadline: i.deadline }))
      .filter((i) => i.title && i.deadline);
    if (!checkpoints.length) {
      toast.error('Добавьте хотя бы один чекпоинт с названием и датой');
      return;
    }
    if (modal === 'create') {
      create.mutate(
        { checkpoints },
        {
          onSuccess: () => {
            toast.success('Набор создан');
            setModal(null);
          },
          onError: (err) => toast.error(getErrorMessage(err)),
        },
      );
    } else if (editing) {
      update.mutate(
        { id: editing.id, body: { checkpoints } },
        {
          onSuccess: () => {
            toast.success('Набор обновлён');
            setModal(null);
          },
          onError: (err) => toast.error(getErrorMessage(err)),
        },
      );
    }
  };

  return (
    <div>
      <div className="toolbar">
        <Button variant="primary" onClick={openCreate}>
          Новый набор
        </Button>
      </div>

      {list.isLoading ? <PageLoader /> : null}
      {list.isError ? <Alert tone="error">{getErrorMessage(list.error)}</Alert> : null}

      {list.data ? (
        <div className="card" style={{ padding: 0 }}>
          <Table<ProjectCheckpoints>
            rows={list.data.checkpoints ?? []}
            rowKey={(row) => row.id}
            columns={[
              {
                key: 'id',
                header: 'ID набора',
                render: (row) => <span className="mono">{row.id}</span>,
              },
              {
                key: 'items',
                header: 'Чекпоинты',
                render: (row) =>
                  (row.checkpoints ?? [])
                    .map((c) => `${c.title} (${formatDate(c.deadline)})`)
                    .join(' · ') || '—',
              },
              {
                key: 'actions',
                header: '',
                render: (row) => (
                  <div className="row">
                    <Button size="sm" onClick={() => openEdit(row)}>
                      Изменить
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => setToDelete(row)}>
                      Удалить
                    </Button>
                  </div>
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

      <Modal
        open={modal !== null}
        title={modal === 'create' ? 'Новый набор чекпоинтов' : 'Редактировать набор'}
        onClose={() => setModal(null)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setModal(null)}>
              Отмена
            </Button>
            <Button
              variant="primary"
              loading={create.isPending || update.isPending}
              onClick={save}
            >
              Сохранить
            </Button>
          </>
        }
      >
        <div className="stack">
          {items.map((item, index) => (
            <div className="row" key={index}>
              <Field label={`Название #${index + 1}`}>
                <Input
                  value={item.title}
                  onChange={(e) => {
                    const next = [...items];
                    next[index] = { ...next[index], title: e.target.value };
                    setItems(next);
                  }}
                />
              </Field>
              <Field label="Дедлайн">
                <Input
                  type="date"
                  value={item.deadline}
                  onChange={(e) => {
                    const next = [...items];
                    next[index] = { ...next[index], deadline: e.target.value };
                    setItems(next);
                  }}
                />
              </Field>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setItems(items.filter((_, i) => i !== index))}
                disabled={items.length <= 1}
              >
                ×
              </Button>
            </div>
          ))}
          <Button size="sm" onClick={() => setItems([...items, emptyItem()])}>
            + Чекпоинт
          </Button>
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Удалить набор"
        message={toDelete ? `Удалить набор ${toDelete.id}?` : ''}
        danger
        confirmLabel="Удалить"
        loading={remove.isPending}
        onClose={() => setToDelete(null)}
        onConfirm={() => {
          if (!toDelete) return;
          remove.mutate(toDelete.id, {
            onSuccess: () => {
              toast.success('Набор удалён');
              setToDelete(null);
            },
            onError: (err) => toast.error(getErrorMessage(err)),
          });
        }}
      />
    </div>
  );
}
