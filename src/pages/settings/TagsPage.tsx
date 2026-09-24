import { useMemo, useState } from 'react';
import { tagsQueries } from '@/features/tags/api/tags.queries';
import {
  Alert,
  Button,
  ConfirmDialog,
  Field,
  Input,
  Modal,
  PageLoader,
  Table,
} from '@/components/ui';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { getErrorMessage } from '@/api/errors';
import { useToast } from '@/providers';
import type { ProjectTag, TagGroupWithTagsResponse } from '@/types';

export function TagsPage() {
  useDocumentTitle('Теги');
  const toast = useToast();
  const grouped = tagsQueries.useGrouped();
  const createGroup = tagsQueries.useCreateGroup();
  const updateGroup = tagsQueries.useUpdateGroup();
  const deleteGroup = tagsQueries.useDeleteGroup();
  const createTag = tagsQueries.useCreateTag();
  const updateTag = tagsQueries.useUpdateTag();
  const deleteTag = tagsQueries.useDeleteTag();

  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const groups = useMemo(() => grouped.data ?? [], [grouped.data]);
  const selected = useMemo(
    () => groups.find((g) => g.groupId === selectedGroupId) || groups[0] || null,
    [groups, selectedGroupId],
  );

  const [groupModal, setGroupModal] = useState<'create' | 'edit' | null>(null);
  const [groupName, setGroupName] = useState('');
  const [editingGroup, setEditingGroup] = useState<TagGroupWithTagsResponse | null>(null);
  const [groupToDelete, setGroupToDelete] = useState<TagGroupWithTagsResponse | null>(null);

  const [tagModal, setTagModal] = useState<'create' | 'edit' | null>(null);
  const [tagName, setTagName] = useState('');
  const [editingTag, setEditingTag] = useState<ProjectTag | null>(null);
  const [tagToDelete, setTagToDelete] = useState<ProjectTag | null>(null);

  if (grouped.isLoading) return <PageLoader />;
  if (grouped.isError) return <Alert tone="error">{getErrorMessage(grouped.error)}</Alert>;

  return (
    <div>
      <div className="toolbar">
        <Button
          variant="secondary"
          onClick={() => {
            setGroupName('');
            setEditingGroup(null);
            setGroupModal('create');
          }}
        >
          Группа
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            if (!selected) {
              toast.info('Сначала создайте группу');
              return;
            }
            setTagName('');
            setEditingTag(null);
            setTagModal('create');
          }}
        >
          Тег
        </Button>
      </div>

      <div className="split-panels">
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: 16 }} className="card-title">
            Группы
          </div>
          <Table<TagGroupWithTagsResponse>
            rows={groups}
            rowKey={(row) => row.groupId}
            onRowClick={(row) => setSelectedGroupId(row.groupId)}
            columns={[
              {
                key: 'name',
                header: 'Группа',
                render: (row) => (
                  <span
                    style={{
                      fontWeight:
                        (selected?.groupId || selectedGroupId) === row.groupId ? 650 : 400,
                    }}
                  >
                    {row.groupName}
                  </span>
                ),
              },
              {
                key: 'count',
                header: 'Тегов',
                render: (row) => row.tags?.length ?? 0,
              },
              {
                key: 'actions',
                header: '',
                render: (row) => (
                  <div className="row" onClick={(e) => e.stopPropagation()}>
                    <Button
                      size="sm"
                      onClick={() => {
                        setEditingGroup(row);
                        setGroupName(row.groupName);
                        setGroupModal('edit');
                      }}
                    >
                      Изменить
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => setGroupToDelete(row)}>
                      Удалить
                    </Button>
                  </div>
                ),
              },
            ]}
          />
        </div>

        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: 16 }} className="card-title">
            Теги {selected ? `· ${selected.groupName}` : ''}
          </div>
          {!selected ? (
            <div className="ui-empty">Нет групп</div>
          ) : (
            <Table<ProjectTag>
              rows={selected.tags ?? []}
              rowKey={(row) => row.tagId}
              columns={[
                {
                  key: 'name',
                  header: 'Тег',
                  render: (row) => row.tagName,
                },
                {
                  key: 'actions',
                  header: '',
                  render: (row) => (
                    <div className="row">
                      <Button
                        size="sm"
                        onClick={() => {
                          setEditingTag(row);
                          setTagName(row.tagName);
                          setTagModal('edit');
                        }}
                      >
                        Изменить
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => setTagToDelete(row)}>
                        Удалить
                      </Button>
                    </div>
                  ),
                },
              ]}
            />
          )}
        </div>
      </div>

      <Modal
        open={groupModal !== null}
        title={groupModal === 'create' ? 'Новая группа' : 'Редактировать группу'}
        onClose={() => setGroupModal(null)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setGroupModal(null)}>
              Отмена
            </Button>
            <Button
              variant="primary"
              loading={createGroup.isPending || updateGroup.isPending}
              onClick={() => {
                if (!groupName.trim()) return;
                if (groupModal === 'create') {
                  createGroup.mutate(
                    { groupName: groupName.trim() },
                    {
                      onSuccess: () => {
                        toast.success('Группа создана');
                        setGroupModal(null);
                      },
                      onError: (err) => toast.error(getErrorMessage(err)),
                    },
                  );
                } else if (editingGroup) {
                  updateGroup.mutate(
                    {
                      id: editingGroup.groupId,
                      body: {
                        groupId: editingGroup.groupId,
                        groupName: groupName.trim(),
                      },
                    },
                    {
                      onSuccess: () => {
                        toast.success('Группа обновлена');
                        setGroupModal(null);
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
        <Field label="Название группы">
          <Input value={groupName} onChange={(e) => setGroupName(e.target.value)} />
        </Field>
      </Modal>

      <Modal
        open={tagModal !== null}
        title={tagModal === 'create' ? 'Новый тег' : 'Редактировать тег'}
        onClose={() => setTagModal(null)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setTagModal(null)}>
              Отмена
            </Button>
            <Button
              variant="primary"
              loading={createTag.isPending || updateTag.isPending}
              onClick={() => {
                if (!tagName.trim() || !selected) return;
                if (tagModal === 'create') {
                  createTag.mutate(
                    { tagName: tagName.trim(), groupId: selected.groupId },
                    {
                      onSuccess: () => {
                        toast.success('Тег создан');
                        setTagModal(null);
                      },
                      onError: (err) => toast.error(getErrorMessage(err)),
                    },
                  );
                } else if (editingTag) {
                  updateTag.mutate(
                    {
                      id: editingTag.tagId,
                      body: {
                        tagId: editingTag.tagId,
                        tagName: tagName.trim(),
                        groupId: selected.groupId,
                      },
                    },
                    {
                      onSuccess: () => {
                        toast.success('Тег обновлён');
                        setTagModal(null);
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
        <Field label="Название тега">
          <Input value={tagName} onChange={(e) => setTagName(e.target.value)} />
        </Field>
      </Modal>

      <ConfirmDialog
        open={Boolean(groupToDelete)}
        title="Удалить группу"
        message={groupToDelete ? `Удалить группу «${groupToDelete.groupName}»?` : ''}
        danger
        confirmLabel="Удалить"
        loading={deleteGroup.isPending}
        onClose={() => setGroupToDelete(null)}
        onConfirm={() => {
          if (!groupToDelete) return;
          deleteGroup.mutate(groupToDelete.groupId, {
            onSuccess: () => {
              toast.success('Группа удалена');
              setGroupToDelete(null);
            },
            onError: (err) => toast.error(getErrorMessage(err)),
          });
        }}
      />

      <ConfirmDialog
        open={Boolean(tagToDelete)}
        title="Удалить тег"
        message={tagToDelete ? `Удалить тег «${tagToDelete.tagName}»?` : ''}
        danger
        confirmLabel="Удалить"
        loading={deleteTag.isPending}
        onClose={() => setTagToDelete(null)}
        onConfirm={() => {
          if (!tagToDelete) return;
          deleteTag.mutate(tagToDelete.tagId, {
            onSuccess: () => {
              toast.success('Тег удалён');
              setTagToDelete(null);
            },
            onError: (err) => toast.error(getErrorMessage(err)),
          });
        }}
      />
    </div>
  );
}
