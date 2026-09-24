import { useState } from 'react'
import styles from './RolesPage.module.css'
import {
  CreateProjectRoleForm,
  EditProjectRoleButton,
  RemoveProjectRoleButton
} from '@/features/manage-project-roles'
import {
  CreateSkillForm,
  EditSkillButton,
  RemoveSkillButton
} from '@/features/manage-skills'
import { useProjectRoleTypes } from '@/entities/project-role-type'
import { SkillRow, useSkills } from '@/entities/skill'
import { Spinner } from '@/shared'

export const RolesPage = () => {
  const { data: roleTypes = [], isLoading, isError } = useProjectRoleTypes()
  const [selectedRoleTypeId, setSelectedRoleTypeId] = useState<string | null>(null)
  const selected = selectedRoleTypeId ?? roleTypes[0]?.id ?? null

  const skills = useSkills({
    offset: 0,
    limit: 100,
    roleType: selected || undefined
  })

  return (
    <main className={styles.main}>
      <h2>Роли и компетенции</h2>
      <p className={styles.hint}>
        Каталог компетенций проекта и скиллов. Управление перенесено из настроек на эту вкладку.
      </p>

      <div className={styles.grid}>
        <section className={styles.panel}>
          <div className={styles.panelTitle}>Компетенции</div>
          <div className={styles.list}>
            {isLoading && <Spinner />}
            {isError && <h3 className={styles.placeholder}>Произошла ошибка :P</h3>}
            {!isLoading && roleTypes.length === 0 ? (
              <h3 className={styles.placeholder}>Ничего не нашлось!</h3>
            ) : (
              roleTypes.map(roleType => (
                <div
                  key={roleType.id}
                  className={`${styles.roleItem} ${selected === roleType.id ? styles.roleItemActive : ''}`}
                  onClick={() => setSelectedRoleTypeId(roleType.id)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') setSelectedRoleTypeId(roleType.id)
                  }}
                  role='button'
                  tabIndex={0}
                >
                  <span>{roleType.name}</span>
                  <div className={styles.actions} onClick={e => e.stopPropagation()}>
                    <EditProjectRoleButton roleType={roleType} />
                    <RemoveProjectRoleButton roleId={roleType.id} />
                  </div>
                </div>
              ))
            )}
          </div>
          <div className={styles.forms}>
            <CreateProjectRoleForm />
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelTitle}>
            Скиллы
            {selected ? ` · ${roleTypes.find(r => r.id === selected)?.name || selected}` : ''}
          </div>
          <div className={styles.list}>
            {!selected && <h3 className={styles.placeholder}>Выберите компетенцию</h3>}
            {selected && skills.isLoading && <Spinner />}
            {selected && skills.isError && (
              <h3 className={styles.placeholder}>Произошла ошибка :P</h3>
            )}
            {selected && skills.isSuccess && (skills.data ?? []).length === 0 ? (
              <h3 className={styles.placeholder}>Скиллов нет</h3>
            ) : null}
            {(skills.data ?? []).map(skill => (
              <SkillRow key={skill.id} skill={skill}>
                <EditSkillButton skill={skill} />
                <RemoveSkillButton skillId={skill.id} />
              </SkillRow>
            ))}
          </div>
          <div className={styles.forms}>
            <CreateSkillForm roleTypeId={selected || undefined} />
          </div>
        </section>
      </div>
    </main>
  )
}
