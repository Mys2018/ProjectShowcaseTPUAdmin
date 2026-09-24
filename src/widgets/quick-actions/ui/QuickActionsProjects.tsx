import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './QuickActionsProjects.module.css'
import {
  getStatusTranslation,
  useProjectsByName,
  type ProjectStatus
} from '@/entities/project'
import {
  Card,
  FloatingList,
  Input,
  projectPath,
  ROUTES,
  SearchIcon,
  TextSkeleton,
  useQuerySync
} from '@/shared'

const QUICK_STATUSES: ProjectStatus[] = ['pending', 'needsrework', 'recruiting']

export const QuickActionsProjects = () => {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [localQuery, setLocalQuery] = useQuerySync(query, setQuery)

  const trimmed = query.trim()
  const { data, isLoading, isError } = useProjectsByName(
    {
      query: trimmed.toLowerCase(),
      offset: 0,
      limit: 5
    },
    Boolean(trimmed)
  )

  const projects = data?.projects ?? []

  const renderList = () => {
    if (isLoading) {
      return Array.from({ length: 3 }, (_, i) => (
        <TextSkeleton className={styles.skeleton} key={i} />
      ))
    }
    if (isError) return <h6>Произошла ошибка :P</h6>
    if (projects.length === 0) return <h6 className={styles.empty}>Ничего не найдено</h6>
    return projects.map(project => (
      <button
        type='button'
        key={project.id}
        className={styles.item}
        onClick={() => {
          void navigate(projectPath(project.id))
          setLocalQuery('')
          setQuery('')
        }}
      >
        <p>
          {project.meta.title} [{project.id}]
        </p>
      </button>
    ))
  }

  const isListVisible = Boolean(trimmed) && (projects.length > 0 || isError || isLoading)

  return (
    <Card title='Быстрые действия' className={styles.card}>
      <p className={styles.snippet}>Открыть проект по имени или ID</p>

      <div className={styles.searchWrapper}>
        <Input
          leadingIcon={<SearchIcon className={styles.searchIcon} />}
          placeholder='Название или ID проекта'
          value={localQuery}
          onChange={e => setLocalQuery(e.target.value)}
          onClear={() => setLocalQuery('')}
        />
        {isListVisible && (
          <FloatingList className={`${styles.list} ${isLoading ? styles.loading : ''}`}>
            {renderList()}
          </FloatingList>
        )}
      </div>

      <div className={styles.links}>
        <p className={styles.snippet}>Частые фильтры</p>
        <div className={styles.chipRow}>
          {QUICK_STATUSES.map(status => (
            <Link key={status} className={styles.chip} to={`${ROUTES.PROJECTS}?status=${status}`}>
              {getStatusTranslation(status)}
            </Link>
          ))}
          <Link className={styles.chip} to={ROUTES.PROJECTS}>
            Все проекты
          </Link>
        </div>
      </div>
    </Card>
  )
}
