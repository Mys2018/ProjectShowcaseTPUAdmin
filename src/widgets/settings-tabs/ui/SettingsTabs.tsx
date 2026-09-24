import { ROUTES, VerticalTabs, type TabProps } from '@/shared'

const tabs: TabProps[] = [
  { name: 'Теги', to: ROUTES.SETTINGS.TAGS },
  { name: 'Партнёры', to: ROUTES.SETTINGS.PARTNERS },
  { name: 'Чекпоинты', to: ROUTES.SETTINGS.CHECKPOINTS },
  { name: 'Платформы', to: ROUTES.SETTINGS.PLATFORMS },
  { name: 'Жалобы', to: ROUTES.SETTINGS.COMPLAINTS }
]

export function SettingsTabs() {
  return <VerticalTabs items={tabs} />
}
