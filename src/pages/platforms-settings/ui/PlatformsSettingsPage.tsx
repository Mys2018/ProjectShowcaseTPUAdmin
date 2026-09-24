import styles from './PlatformsSettingsPage.module.css'
import {
  CreatePlatformForm,
  EditPlatformButton,
  RemovePlatformButton
} from '@/features/manage-platforms'
import { PlatformRow, usePlatforms } from '@/entities/platform'

export function PlatformsSettingsPage() {
  const { data: platforms = [], isLoading, isError, isSuccess } = usePlatforms()

  return (
    <div className={styles.container}>
      <div className={styles.list}>
        {isLoading && <h3 className={styles.placeholder}>Загрузка...</h3>}
        {isError && <h3 className={styles.placeholder}>Произошла ошибка :P</h3>}
        {isSuccess && platforms.length === 0 ? (
          <h3 className={styles.placeholder}>Ничего не нашлось!</h3>
        ) : (
          platforms.map(platform => (
            <PlatformRow key={platform.id} platform={platform}>
              <EditPlatformButton platform={platform} />
              <RemovePlatformButton platformId={platform.id} />
            </PlatformRow>
          ))
        )}
      </div>
      <div className={styles.forms}>
        <CreatePlatformForm />
      </div>
    </div>
  )
}
