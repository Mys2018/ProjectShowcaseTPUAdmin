import { useState } from 'react'
import styles from './EditSkillButton.module.css'
import { useEditSkill } from '../api/mutations'
import type { Skill } from '@/entities/skill'
import { AgreeButton, Card, EditIcon, Input, Modal } from '@/shared'

export function EditSkillButton({ skill }: { skill: Skill }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(skill.name)
  const { mutate: edit, isPending } = useEditSkill()

  return (
    <>
      <EditIcon
        className={styles.button}
        onClick={() => {
          setName(skill.name)
          setOpen(true)
        }}
      />
      <Modal isOpened={open} onClose={() => setOpen(false)}>
        <Card title='Изменение скилла'>
          <form
            className={styles.form}
            onSubmit={e => {
              e.preventDefault()
              edit(
                { id: skill.id, name: name.trim(), roleTypeId: skill.roleTypeId },
                { onSettled: () => setOpen(false) }
              )
            }}
          >
            <Input value={name} onChange={e => setName(e.target.value)} onClear={() => setName('')} />
            <AgreeButton isLoading={isPending} disabled={!name.trim() || name === skill.name}>
              Подтвердить
            </AgreeButton>
          </form>
        </Card>
      </Modal>
    </>
  )
}
