import { useMemo, useState } from 'react';
import {
  roleTypesQueries,
  skillsQueries,
} from '@/features/roleTypes/api/roleTypes.queries';
import { PageHeader } from '@/components/layout/PageHeader';
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
import type { ProjectRoleType, Skill } from '@/types';

export function RolesPage() {
  useDocumentTitle('Роли');
  const toast = useToast();
  const roleTypes = roleTypesQueries.useList();
  const createRole = roleTypesQueries.useCreate();
  const updateRole = roleTypesQueries.useUpdate();
  const removeRole = roleTypesQueries.useRemove();

  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [roleModal, setRoleModal] = useState<'create' | 'edit' | null>(null);
  const [roleName, setRoleName] = useState('');
  const [editingRole, setEditingRole] = useState<ProjectRoleType | null>(null);
  const [roleToDelete, setRoleToDelete] = useState<ProjectRoleType | null>(null);

  const skillsParams = useMemo(
    () => ({
      offset: 0,
      limit: 100,
      roleType: selectedRoleId || undefined,
    }),
    [selectedRoleId],
  );
  const skills = skillsQueries.useList(skillsParams);
  const createSkill = skillsQueries.useCreate();
  const updateSkill = skillsQueries.useUpdate();
  const removeSkill = skillsQueries.useRemove();

  const [skillModal, setSkillModal] = useState<'create' | 'edit' | null>(null);
  const [skillName, setSkillName] = useState('');
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [skillToDelete, setSkillToDelete] = useState<Skill | null>(null);

  const openCreateRole = () => {
    setRoleName('');
    setEditingRole(null);
    setRoleModal('create');
  };

  const openEditRole = (role: ProjectRoleType) => {
    setEditingRole(role);
    setRoleName(role.name);
    setRoleModal('edit');
  };

  const saveRole = () => {
    if (!roleName.trim()) return;
    if (roleModal === 'create') {
      createRole.mutate(
        { name: roleName.trim() },
        {
          onSuccess: () => {
            toast.success('Компетенция создана');
            setRoleModal(null);
          },
          onError: (err) => toast.error(getErrorMessage(err)),
        },
      );
    } else if (editingRole) {
      updateRole.mutate(
        { id: editingRole.id, body: { id: editingRole.id, name: roleName.trim() } },
        {
          onSuccess: () => {
            toast.success('Компетенция обновлена');
            setRoleModal(null);
          },
          onError: (err) => toast.error(getErrorMessage(err)),
        },
      );
    }
  };

  const openCreateSkill = () => {
    if (!selectedRoleId) {
      toast.info('Сначала выберите компетенцию');
      return;
    }
    setSkillName('');
    setEditingSkill(null);
    setSkillModal('create');
  };

  const openEditSkill = (skill: Skill) => {
    setEditingSkill(skill);
    setSkillName(skill.skillName);
    setSkillModal('edit');
  };

  const saveSkill = () => {
    if (!skillName.trim() || !selectedRoleId) return;
    if (skillModal === 'create') {
      createSkill.mutate(
        { skillName: skillName.trim(), roleTypeId: selectedRoleId },
        {
          onSuccess: () => {
            toast.success('Скилл создан');
            setSkillModal(null);
          },
          onError: (err) => toast.error(getErrorMessage(err)),
        },
      );
    } else if (editingSkill) {
      updateSkill.mutate(
        {
          id: editingSkill.skillId,
          body: {
            skillId: editingSkill.skillId,
            skillName: skillName.trim(),
            roleTypeId: selectedRoleId,
          },
        },
        {
          onSuccess: () => {
            toast.success('Скилл обновлён');
            setSkillModal(null);
          },
          onError: (err) => toast.error(getErrorMessage(err)),
        },
      );
    }
  };

  return (
    <div>
      <PageHeader
        title="Роли и компетенции"
        description="Справочник компетенций (role-types) и скиллов"
        actions={
          <Button variant="primary" onClick={openCreateRole}>
            Добавить компетенцию
          </Button>
        }
      />

      {roleTypes.isLoading ? <PageLoader /> : null}
      {roleTypes.isError ? (
        <Alert tone="error">{getErrorMessage(roleTypes.error)}</Alert>
      ) : null}

      <div className="split-panels">
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: 16 }} className="card-title">
            Компетенции
          </div>
          <Table<ProjectRoleType>
            rows={roleTypes.data ?? []}
            rowKey={(row) => row.id}
            onRowClick={(row) => setSelectedRoleId(row.id)}
            columns={[
              {
                key: 'name',
                header: 'Название',
                render: (row) => (
                  <span style={{ fontWeight: selectedRoleId === row.id ? 650 : 400 }}>
                    {row.name}
                  </span>
                ),
              },
              {
                key: 'actions',
                header: '',
                render: (row) => (
                  <div className="row" onClick={(e) => e.stopPropagation()}>
                    <Button size="sm" onClick={() => openEditRole(row)}>
                      Изменить
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => setRoleToDelete(row)}>
                      Удалить
                    </Button>
                  </div>
                ),
              },
            ]}
          />
        </div>

        <div className="card" style={{ padding: 0 }}>
          <div
            style={{ padding: 16, display: 'flex', justifyContent: 'space-between', gap: 12 }}
          >
            <div className="card-title" style={{ marginBottom: 0 }}>
              Скиллы
              {selectedRoleId
                ? ` · ${(roleTypes.data ?? []).find((r) => r.id === selectedRoleId)?.name || selectedRoleId}`
                : ''}
            </div>
            <Button size="sm" variant="primary" onClick={openCreateSkill}>
              Добавить скилл
            </Button>
          </div>
          {!selectedRoleId ? (
            <div className="ui-empty">Выберите компетенцию слева</div>
          ) : skills.isLoading ? (
            <PageLoader />
          ) : skills.isError ? (
            <div style={{ padding: 16 }}>
              <Alert tone="error">{getErrorMessage(skills.error)}</Alert>
            </div>
          ) : (
            <Table<Skill>
              rows={skills.data ?? []}
              rowKey={(row) => row.skillId}
              columns={[
                {
                  key: 'name',
                  header: 'Скилл',
                  render: (row) => row.skillName,
                },
                {
                  key: 'actions',
                  header: '',
                  render: (row) => (
                    <div className="row">
                      <Button size="sm" onClick={() => openEditSkill(row)}>
                        Изменить
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => setSkillToDelete(row)}
                      >
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
        open={roleModal !== null}
        title={roleModal === 'create' ? 'Новая компетенция' : 'Редактировать компетенцию'}
        onClose={() => setRoleModal(null)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setRoleModal(null)}>
              Отмена
            </Button>
            <Button
              variant="primary"
              loading={createRole.isPending || updateRole.isPending}
              onClick={saveRole}
            >
              Сохранить
            </Button>
          </>
        }
      >
        <Field label="Название">
          <Input value={roleName} onChange={(e) => setRoleName(e.target.value)} />
        </Field>
      </Modal>

      <Modal
        open={skillModal !== null}
        title={skillModal === 'create' ? 'Новый скилл' : 'Редактировать скилл'}
        onClose={() => setSkillModal(null)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setSkillModal(null)}>
              Отмена
            </Button>
            <Button
              variant="primary"
              loading={createSkill.isPending || updateSkill.isPending}
              onClick={saveSkill}
            >
              Сохранить
            </Button>
          </>
        }
      >
        <Field label="Название скилла">
          <Input value={skillName} onChange={(e) => setSkillName(e.target.value)} />
        </Field>
      </Modal>

      <ConfirmDialog
        open={Boolean(roleToDelete)}
        title="Удалить компетенцию"
        message={roleToDelete ? `Удалить «${roleToDelete.name}»?` : ''}
        danger
        confirmLabel="Удалить"
        loading={removeRole.isPending}
        onClose={() => setRoleToDelete(null)}
        onConfirm={() => {
          if (!roleToDelete) return;
          removeRole.mutate(roleToDelete.id, {
            onSuccess: () => {
              toast.success('Компетенция удалена');
              if (selectedRoleId === roleToDelete.id) setSelectedRoleId(null);
              setRoleToDelete(null);
            },
            onError: (err) => toast.error(getErrorMessage(err)),
          });
        }}
      />

      <ConfirmDialog
        open={Boolean(skillToDelete)}
        title="Удалить скилл"
        message={skillToDelete ? `Удалить «${skillToDelete.skillName}»?` : ''}
        danger
        confirmLabel="Удалить"
        loading={removeSkill.isPending}
        onClose={() => setSkillToDelete(null)}
        onConfirm={() => {
          if (!skillToDelete) return;
          removeSkill.mutate(skillToDelete.skillId, {
            onSuccess: () => {
              toast.success('Скилл удалён');
              setSkillToDelete(null);
            },
            onError: (err) => toast.error(getErrorMessage(err)),
          });
        }}
      />
    </div>
  );
}
