import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './UserProjectsList.module.css'
import { ProjectSlot, useUserProjects } from '@/entities/project'
import {
  Pagination,
  projectPath,
  ScrollableList,
  SearchInput,
  useDebounce
} from '@/shared'

interface UserProjectsListProps {
  userId: string
}

export function UserProjectsList({ userId }: UserProjectsListProps) {
  const navigate = useNavigate()
  const [localQuery, setLocalQuery] = useState('')
  const [page, setPage] = useState(1)
  const limit = 10
  const query = useDebounce(localQuery, 300)

  const { data, isSuccess, isLoading, isError } = useUserProjects(userId, {
    query: query.toLowerCase(),
    offset: (page - 1) * limit,
    limit
  })
  const { projects, total } = data || { projects: [], total: 0 }

  const totalPages = Math.ceil(total / limit) || 1

  return (
    <div className={styles.container}>
      <p className={styles.title}>Проекты пользователя</p>
      <p className={styles.hint}>Созданные и проекты, где пользователь в команде</p>
      <div className={styles.projectSearch}>
        <SearchInput
          value={localQuery}
          onChange={e => {
            setLocalQuery(e.target.value)
            setPage(1)
          }}
          onClear={() => {
            setLocalQuery('')
            setPage(1)
          }}
          placeholder={'Найти проект...'}
        />
        <ScrollableList>
          {isLoading && <h3 className={styles.placeholder}>Загрузка...</h3>}
          {isError && <h3 className={styles.placeholder}>Произошла ошибка :P</h3>}
          {isSuccess && projects.length === 0 ? (
            <h3 className={styles.placeholder}>Ничего не нашлось!</h3>
          ) : (
            projects.map(project => (
              <ProjectSlot
                key={project.id}
                project={project}
                isClickable
                onClick={() => {
                  void navigate(projectPath(project.id))
                }}
              />
            ))
          )}
        </ScrollableList>
        {totalPages > 1 && (
          <Pagination currentPage={page} totalPages={totalPages} onPageSelect={setPage} />
        )}
      </div>
    </div>
  )
}
