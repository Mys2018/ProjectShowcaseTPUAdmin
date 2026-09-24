import { useMemo, useState } from 'react';
import { platformsQueries } from '@/features/platforms/api/platforms.queries';
import {
  Alert,
  Button,
  ConfirmDialog,
  Field,
  Input,
  Modal,
  PageLoader,
  Select,
  Table,
  Tabs,
} from '@/components/ui';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { getErrorMessage } from '@/api/errors';
import { useToast } from '@/providers';
import type { Platform, PlatformCategory } from '@/types';

const CATEGORY_LABELS: Record<PlatformCategory, string> = {
  Repository: 'Репозиторий',
  TaskTracker: 'Трекер задач',
  OtherPlatforms: 'Другое',
};

export function PlatformsPage() {
  useDocumentTitle('Платформы');
  const toast = useToast();
  const list = platformsQueries.useList();
  const create = platformsQueries.useCreate();
  const update = platformsQueries.useUpdate();
  const remove = platformsQueries.useRemove();

  const [category, setCategory] = useState<PlatformCategory | 'all'>('all');
  const platforms = useMemo(() => {
    const rows = (list.data ?? []).flatMap((group) => group.platforms ?? []);
    if (category === 'all') return rows;
    return rows.filter((p) => p.category === category);
  }, [list.data, category]);

  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [name, setName] = useState('');
  const [cat, setCat] = useState<PlatformCategory>('Repository');
  const [editing, setEditing] = useState<Platform | null>(null);
  const [toDelete, setToDelete] = useState<Platform | null>(null);

  if (list.isLoading) return <PageLoader />;
  if (list.isError) return <Alert tone="error">{getErrorMessage(list.error)}</Alert>;

  return (
    <div>
      <div className="toolbar">
        <Tabs
          value={category}
          onChange={(id) => setCategory(id as PlatformCategory | 'all')}
          items={[
            { id: 'all', label: 'Все' },
            { id: 'Repository', label: CATEGORY_LABELS.Repository },
            { id: 'TaskTracker', label: CATEGORY_LABELS.TaskTracker },
            { id: 'OtherPlatforms', label: CATEGORY_LABELS.OtherPlatforms },
          ]}
        />
        <Button
          variant="primary"
          onClick={() => {
            setName('');
            setCat(category === 'all' ? 'Repository' : category);
            setEditing(null);
            setModal('create');
          }}
        >
          Добавить
        </Button>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <Table<Platform>
          rows={platforms}
          rowKey={(row) => row.platformId}
          columns={[
            {
              key: 'name',
              header: 'Название',
              render: (row) => row.name,
            },
            {
              key: 'category',
              header: 'Категория',
              render: (row) => CATEGORY_LABELS[row.category],
            },
            {
              key: 'actions',
              header: '',
              render: (row) => (
                <div className="row">
                  <Button
                    size="sm"
                    onClick={() => {
                      setEditing(row);
                      setName(row.name);
                      setCat(row.category);
                      setModal('edit');
                    }}
                  >
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
      </div>

      <Modal
        open={modal !== null}
        title={modal === 'create' ? 'Новая платформа' : 'Редактировать платформу'}
        onClose={() => setModal(null)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setModal(null)}>
              Отмена
            </Button>
            <Button
              variant="primary"
              loading={create.isPending || update.isPending}
              onClick={() => {
                if (!name.trim()) return;
                if (modal === 'create') {
                  create.mutate(
                    { name: name.trim(), category: cat },
                    {
                      onSuccess: () => {
                        toast.success('Платформа создана');
                        setModal(null);
                      },
                      onError: (err) => toast.error(getErrorMessage(err)),
                    },
                  );
                } else if (editing) {
                  update.mutate(
                    {
                      id: editing.platformId,
                      body: {
                        platformId: editing.platformId,
                        name: name.trim(),
                        category: cat,
                      },
                    },
                    {
                      onSuccess: () => {
                        toast.success('Платформа обновлена');
                        setModal(null);
                      },
                      onError: (err) => toast.error(getErrorMessage(err)),
                    },
                  );
                }
              }}
            >
              Сохранить
            </Button>
          </>
        }
      >
        <div className="stack">
          <Field label="Название">
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Категория">
            <Select
              value={cat}
              onChange={(e) => setCat(e.target.value as PlatformCategory)}
            >
              {(Object.keys(CATEGORY_LABELS) as PlatformCategory[]).map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_LABELS[c]}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Удалить платформу"
        message={toDelete ? `Удалить «${toDelete.name}»?` : ''}
        danger
        confirmLabel="Удалить"
        loading={remove.isPending}
        onClose={() => setToDelete(null)}
        onConfirm={() => {
          if (!toDelete) return;
          remove.mutate(toDelete.platformId, {
            onSuccess: () => {
              toast.success('Платформа удалена');
              setToDelete(null);
            },
            onError: (err) => toast.error(getErrorMessage(err)),
          });
        }}
      />
    </div>
  );
}
