import { useNavigate } from 'react-router-dom'
import styles from './ProjectsList.module.css'
import {
  ALL_PROJECT_STATUSES,
  getStatusTranslation,
  getTypeTranslation,
  ProjectSlot,
  useProjectsByName,
  type ProjectType
} from '@/entities/project'
import {
  Pagination,
  projectPath,
  ScrollableList,
  SearchInput,
  useQueryFilters,
  useQuerySync
} from '@/shared'

const PROJECT_TYPES: ProjectType[] = ['Study', 'Case', 'Real']

const ProjectsList = () => {
  const navigate = useNavigate()
  const {
    page,
    setPage,
    limit,
    offset,
    query,
    setQuery,
    status,
    setStatus,
    projectType,
    setProjectType
  } = useQueryFilters()
  const [localQuery, setLocalQuery] = useQuerySync(query, setQuery)

  const { data, isSuccess, isLoading, isError } = useProjectsByName({
    query: query.toLowerCase(),
    offset,
    limit,
    status: status || undefined,
    projectType: projectType || undefined
  })
  const { projects, total } = data || { projects: [], total: 0 }

  const totalPages = Math.ceil(total / limit) || 1

  return (
    <div className={styles.container}>
      <SearchInput
        value={localQuery}
        onChange={e => setLocalQuery(e.target.value)}
        onClear={() => setLocalQuery('')}
        placeholder={'Найти проект...'}
      />
      <div className={styles.filters}>
        <select
          className={styles.select}
          value={status}
          onChange={e => setStatus(e.target.value)}
          aria-label='Фильтр по статусу'
        >
          <option value=''>Все статусы</option>
          {ALL_PROJECT_STATUSES.map(s => (
            <option key={s} value={s}>
              {getStatusTranslation(s)}
            </option>
          ))}
        </select>
        <select
          className={styles.select}
          value={projectType}
          onChange={e => setProjectType(e.target.value)}
          aria-label='Фильтр по типу'
        >
          <option value=''>Все типы</option>
          {PROJECT_TYPES.map(t => (
            <option key={t} value={t}>
              {getTypeTranslation(t)}
            </option>
          ))}
        </select>
      </div>
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
      {totalPages !== 1 && (
        <Pagination currentPage={page} totalPages={totalPages} onPageSelect={setPage} />
      )}
    </div>
  )
}

export default ProjectsList
