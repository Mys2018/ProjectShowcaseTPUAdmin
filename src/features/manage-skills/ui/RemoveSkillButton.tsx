import { useState } from 'react'
import { useRemoveSkill } from '../api/mutations'
import { CloseButton, ConfirmModal } from '@/shared'

export function RemoveSkillButton({ skillId }: { skillId: string }) {
  const [open, setOpen] = useState(false)
  const { mutate: remove, isPending } = useRemoveSkill()

  return (
    <>
      <CloseButton onClick={() => setOpen(true)} />
      <ConfirmModal
        isOpened={open}
        isPending={isPending}
        onSubmit={() => remove(skillId, { onSettled: () => setOpen(false) })}
        onReject={() => setOpen(false)}
      />
    </>
  )
}
