import { Outlet } from 'react-router-dom'
import styles from './SettingsLayout.module.css'
import { SettingsTabs } from '@/widgets/settings-tabs'

export function SettingsLayout() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Настройки</h2>
      <div className={styles.header}>
        <SettingsTabs />
      </div>
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  )
}
