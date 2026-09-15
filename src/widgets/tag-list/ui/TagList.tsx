import { Fragment } from 'react/jsx-runtime'
import styles from './TagList.module.css'
import { TagsSkeleton } from './skeleton/TagsSkeleton'
import { EditTagButton, RemoveTagButton } from '@/features/manage-tags'
import { EditTagGroupButton, RemoveTagGroupButton } from '@/features/manage-tag-groups'
import { TagGroupRow, TagRow, useTags } from '@/entities/tag'

export function TagList() {
  const { data: tagGroups = [], isSuccess, isLoading, isError } = useTags()

  return (
    <div className={styles.container}>
      <div className={`${styles.list} ${isLoading ? styles.loading : ''}`}>
        {isLoading && Array.from({ length: 3 }, (_, i) => <TagsSkeleton key={i} />)}
        {isError && <h3 className={styles.placeholder}>Произошла ошибка :P</h3>}
        {isSuccess && tagGroups.length === 0 ? (
          <h3 className={styles.placeholder}>Ничего не нашлось!</h3>
        ) : (
          tagGroups.map(group => (
            <Fragment key={group.id}>
              <TagGroupRow className={styles.groupRow} group={group}>
                <EditTagGroupButton group={group} />
                <RemoveTagGroupButton groupId={group.id} />
              </TagGroupRow>
              {group.tags.map(tag => (
                <TagRow tag={tag} key={tag.id}>
                  <EditTagButton tag={tag} group={group} />
                  <RemoveTagButton tagId={tag.id} />
                </TagRow>
              ))}
            </Fragment>
          ))
        )}
      </div>
    </div>
  )
}
