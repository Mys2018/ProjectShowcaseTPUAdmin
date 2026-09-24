import { useState } from 'react'
import styles from './CreatePlatformForm.module.css'
import { useCreatePlatform } from '../api/mutations'
import type { PlatformCategory } from '@/entities/platform'
import { AgreeButton, Card, Input } from '@/shared'

const CATEGORIES: { value: PlatformCategory; label: string }[] = [
  { value: 'Repository', label: 'Репозиторий' },
  { value: 'TaskTracker', label: 'Трекер задач' },
  { value: 'OtherPlatforms', label: 'Другое' }
]

export function CreatePlatformForm() {
  const { mutate: create, isPending } = useCreatePlatform()
  const [name, setName] = useState('')
  const [category, setCategory] = useState<PlatformCategory>('Repository')

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault()
    create(
      { name: name.trim(), category },
      {
        onSuccess: () => setName('')
      }
    )
  }

  return (
    <Card title='Добавление платформы'>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input
          placeholder='Название'
          value={name}
          onChange={e => setName(e.target.value)}
          onClear={() => setName('')}
        />
        <select
          className={styles.select}
          value={category}
          onChange={e => setCategory(e.target.value as PlatformCategory)}
        >
          {CATEGORIES.map(c => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        <AgreeButton disabled={!name.trim()} isLoading={isPending}>
          Создать
        </AgreeButton>
      </form>
    </Card>
  )
}
