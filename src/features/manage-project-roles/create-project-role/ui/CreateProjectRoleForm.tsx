import { useState } from 'react'
import styles from './CreateProjectRoleForm.module.css'
import { useCreateProjectRole } from '../api/mutations'
import { AgreeButton, Card, Input } from '@/shared'

export function CreateProjectRoleForm() {
  const { mutate: createTag, isPending } = useCreateProjectRole()
  const [value, setValue] = useState('')

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault()
    createTag({ name: value }, { onSuccess: () => setValue('') })
  }

  return (
    <Card title='Добавление роли'>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input placeholder='Название роли' value={value} onChange={e => setValue(e.target.value)} onClear={() => setValue('')} />
        <AgreeButton disabled={!value.trim()} isLoading={isPending}>
          Создать
        </AgreeButton>
      </form>
    </Card>
  )
}
