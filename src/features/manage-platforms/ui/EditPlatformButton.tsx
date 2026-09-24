import { useState } from 'react'
import styles from './EditPlatformButton.module.css'
import { useEditPlatform } from '../api/mutations'
import type { Platform, PlatformCategory } from '@/entities/platform'
import { AgreeButton, Card, EditIcon, Input, Modal } from '@/shared'

const CATEGORIES: PlatformCategory[] = ['Repository', 'TaskTracker', 'OtherPlatforms']

export function EditPlatformButton({ platform }: { platform: Platform }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(platform.name)
  const [category, setCategory] = useState(platform.category)
  const { mutate: edit, isPending } = useEditPlatform()

  return (
    <>
      <EditIcon
        className={styles.button}
        onClick={() => {
          setName(platform.name)
          setCategory(platform.category)
          setOpen(true)
        }}
      />
      <Modal isOpened={open} onClose={() => setOpen(false)}>
        <Card title='Изменение платформы'>
          <form
            className={styles.form}
            onSubmit={e => {
              e.preventDefault()
              edit(
                { id: platform.id, name: name.trim(), category },
                { onSettled: () => setOpen(false) }
              )
            }}
          >
            <Input value={name} onChange={e => setName(e.target.value)} onClear={() => setName('')} />
            <select
              className={styles.select}
              value={category}
              onChange={e => setCategory(e.target.value as PlatformCategory)}
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <AgreeButton
              isLoading={isPending}
              disabled={!name.trim() || (name === platform.name && category === platform.category)}
            >
              Подтвердить
            </AgreeButton>
          </form>
        </Card>
      </Modal>
    </>
  )
}
