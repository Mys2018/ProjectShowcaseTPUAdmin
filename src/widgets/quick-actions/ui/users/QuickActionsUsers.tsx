import { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './QuickActionsUsers.module.css'
import { useSetUserRole } from '@/features/update-user-roles'
import { ROLES_TRANSLATIONS, useUsersByName, type UserBase, type UserRole } from '@/entities/user'
import {
  AgreeButton,
  Card,
  FloatingList,
  Input,
  ROUTES,
  SearchIcon,
  TextSkeleton,
  useQuerySync
} from '@/shared'

const QUICK_ROLE: UserRole['type'] = 'Mentor'

export const QuickActionsUsers = () => {
  const [chosenUsers, setChosenUsers] = useState<UserBase[]>([])

  const [query, setQuery] = useState('')
  const [localQuery, setLocalQuery] = useQuerySync(query, setQuery)

  const { data, isLoading, isError } = useUsersByName(query.toLowerCase(), 0, 5, !!query)
  const users = data?.users.filter(user => !chosenUsers.some(u => u.id === user.id)) || []

  const { mutate: setRoleMutate, isPending } = useSetUserRole()

  const renderUserList = () => {
    if (isLoading) {
      return Array.from({ length: 3 }, (_, i) => (
        <TextSkeleton className={styles.skeleton} key={i} />
      ))
    }
    if (isError) return <h6>Произошла ошибка :P</h6>
    return users.map(user => (
      <button
        type='button'
        onClick={() => setChosenUsers(p => [...p, user])}
        className={styles.user}
        key={user.id}
      >
        <p>
          {user.meta.name} [{user.id}]
        </p>
      </button>
    ))
  }

  const isListVisible = users.length > 0 || isError || isLoading

  const handleSubmit = () => {
    chosenUsers.forEach(user =>
      setRoleMutate({ userId: user.id, type: QUICK_ROLE, payload: {} })
    )
    setChosenUsers([])
  }

  return (
    <Card title='Быстрые действия' className={styles.card}>
      <p className={styles.snippet}>Выдать роль «{ROLES_TRANSLATIONS[QUICK_ROLE]}»</p>

      <div className={styles.searchWrapper}>
        <Input
          leadingIcon={<SearchIcon className={styles.searchIcon} />}
          placeholder='Имя или ID пользователя'
          value={localQuery}
          onChange={e => setLocalQuery(e.target.value)}
          onClear={() => setLocalQuery('')}
        />
        {isListVisible && (
          <FloatingList className={`${styles.userList} ${isLoading ? styles.loading : ''}`}>
            {renderUserList()}
          </FloatingList>
        )}
      </div>

      <div className={styles.chosenUserList}>
        {chosenUsers.map(user => (
          <div key={user.id} className={styles.chosenUser}>
            <p>
              {user.meta.name} [{user.id}]
            </p>
            <button
              type='button'
              className={styles.removeButton}
              onClick={() => setChosenUsers(p => p.filter(u => u.id !== user.id))}
              aria-label='Убрать'
            />
          </div>
        ))}
      </div>

      <AgreeButton
        className={styles.submitButton}
        disabled={chosenUsers.length === 0}
        onClick={handleSubmit}
        isLoading={isPending}
      >
        Подтвердить
      </AgreeButton>

      <Link className={styles.more} to={ROUTES.USERS}>
        К списку пользователей →
      </Link>
    </Card>
  )
}
