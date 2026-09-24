import { useState } from 'react'
import styles from './CreateSkillForm.module.css'
import { useCreateSkill } from '../api/mutations'
import { useProjectRoleTypes } from '@/entities/project-role-type'
import { AgreeButton, Card, Input } from '@/shared'

export function CreateSkillForm({ roleTypeId }: { roleTypeId?: string }) {
  const { data: roleTypes = [] } = useProjectRoleTypes()
  const { mutate: create, isPending } = useCreateSkill()
  const [name, setName] = useState('')
  const [selectedRoleTypeId, setSelectedRoleTypeId] = useState(roleTypeId ?? '')

  const effectiveRoleTypeId = roleTypeId || selectedRoleTypeId

  return (
    <Card title='Добавление скилла'>
      <form
        className={styles.form}
        onSubmit={e => {
          e.preventDefault()
          if (!effectiveRoleTypeId || !name.trim()) return
          create(
            { name: name.trim(), roleTypeId: effectiveRoleTypeId },
            { onSuccess: () => setName('') }
          )
        }}
      >
        {!roleTypeId ? (
          <select
            className={styles.select}
            value={selectedRoleTypeId}
            onChange={e => setSelectedRoleTypeId(e.target.value)}
          >
            <option value=''>— компетенция —</option>
            {roleTypes.map(rt => (
              <option key={rt.id} value={rt.id}>
                {rt.name}
              </option>
            ))}
          </select>
        ) : null}
        <Input
          placeholder='Название скилла'
          value={name}
          onChange={e => setName(e.target.value)}
          onClear={() => setName('')}
        />
        <AgreeButton disabled={!name.trim() || !effectiveRoleTypeId} isLoading={isPending}>
          Создать
        </AgreeButton>
      </form>
    </Card>
  )
}
