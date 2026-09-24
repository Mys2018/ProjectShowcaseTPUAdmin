import { useState, type FormEvent } from 'react'
import styles from './UserRolesUpdateForm.module.css'
import { useRemoveUserRole, useSetUserRole } from '../api/mutations'
import { ROLES_TRANSLATIONS, useUserById, type UserRole } from '@/entities/user'
import { AgreeButton, ConfirmModal, Input } from '@/shared'

interface UserRolesUpdateFormProps {
  userId: string
}

type ChangingRole = {
  role: UserRole['type']
  isActive: boolean
}

const ASSIGNABLE_ROLES = Object.keys(ROLES_TRANSLATIONS).filter(
  r => r !== 'Default'
) as UserRole['type'][]

export function UserRolesUpdateForm({ userId }: UserRolesUpdateFormProps) {
  const { data: user, isError } = useUserById(userId)

  const { mutate: setRoleMutate, isPending: isSetPending } = useSetUserRole()
  const { mutate: removeRoleMutate, isPending: isRemovePending } = useRemoveUserRole()

  const [changingRole, setChangingRole] = useState<ChangingRole | null>(null)
  const [studentDraft, setStudentDraft] = useState<{
    course: string
    school: string
    group: string
  } | null>(null)
  const [studentError, setStudentError] = useState<string | null>(null)

  if (isError || !user) return <h2>Произошла ошибка :P</h2>

  const requestChange = (roleType: UserRole['type'], isActive: boolean) => {
    if (!isActive && roleType === 'Student') {
      setStudentError(null)
      setStudentDraft({ course: '', school: '', group: '' })
      setChangingRole({ role: roleType, isActive })
      return
    }
    setStudentDraft(null)
    setChangingRole({ role: roleType, isActive })
  }

  const handleConfirm = () => {
    if (!changingRole) return
    const { role, isActive } = changingRole

    if (isActive) {
      removeRoleMutate(
        { userId, type: role },
        { onSettled: () => setChangingRole(null) }
      )
      return
    }

    if (role === 'Student') {
      if (!studentDraft) return
      const course = studentDraft.course.trim()
      const school = studentDraft.school.trim()
      const group = studentDraft.group.trim()
      if (!course || !school || !group) {
        setStudentError('Заполните курс, школу и группу')
        return
      }
      setRoleMutate(
        {
          userId,
          type: 'Student',
          payload: { course, school, meta: { group } }
        },
        {
          onSettled: () => {
            setChangingRole(null)
            setStudentDraft(null)
            setStudentError(null)
          }
        }
      )
      return
    }

    setRoleMutate(
      { userId, type: role, payload: {} },
      { onSettled: () => setChangingRole(null) }
    )
  }

  const handleStudentSubmit = (e: FormEvent) => {
    e.preventDefault()
    handleConfirm()
  }

  const roleItems = ASSIGNABLE_ROLES.map(roleType => {
    const isActive = user.roles.some(r => r.type === roleType)
    return (
      <li key={roleType}>
        <button
          type='button'
          className={`${styles.item} ${isActive ? styles.active : ''}`}
          onClick={() => requestChange(roleType, isActive)}
          aria-pressed={isActive}
        >
          <span className={styles.radio} aria-hidden />
          <span className={styles.label}>{ROLES_TRANSLATIONS[roleType]}</span>
        </button>
      </li>
    )
  })

  const confirmText = changingRole
    ? changingRole.isActive
      ? `Снять роль «${ROLES_TRANSLATIONS[changingRole.role]}»?`
      : changingRole.role === 'Student'
        ? undefined
        : `Назначить роль «${ROLES_TRANSLATIONS[changingRole.role]}»?`
    : undefined

  return (
    <aside className={styles.container}>
      <p className={styles.title}>Роли пользователя</p>
      <ul className={styles.list}>{roleItems}</ul>

      {changingRole?.role === 'Student' && !changingRole.isActive && studentDraft ? (
        <form className={styles.studentForm} onSubmit={handleStudentSubmit}>
          <p className={styles.studentTitle}>Данные студента</p>
          <Input
            placeholder='Курс'
            value={studentDraft.course}
            onChange={e => setStudentDraft(d => (d ? { ...d, course: e.target.value } : d))}
          />
          <Input
            placeholder='Инженерная школа'
            value={studentDraft.school}
            onChange={e => setStudentDraft(d => (d ? { ...d, school: e.target.value } : d))}
          />
          <Input
            placeholder='Группа'
            value={studentDraft.group}
            onChange={e => setStudentDraft(d => (d ? { ...d, group: e.target.value } : d))}
          />
          {studentError ? <p className={styles.error}>{studentError}</p> : null}
          <div className={styles.studentActions}>
            <button
              type='button'
              className={styles.cancel}
              onClick={() => {
                setChangingRole(null)
                setStudentDraft(null)
                setStudentError(null)
              }}
            >
              Отмена
            </button>
            <AgreeButton type='submit' isLoading={isSetPending}>
              Назначить
            </AgreeButton>
          </div>
        </form>
      ) : (
        <ConfirmModal
          isOpened={changingRole !== null}
          isPending={isSetPending || isRemovePending}
          text={confirmText}
          onSubmit={handleConfirm}
          onReject={() => {
            setChangingRole(null)
            setStudentDraft(null)
          }}
        />
      )}
    </aside>
  )
}
