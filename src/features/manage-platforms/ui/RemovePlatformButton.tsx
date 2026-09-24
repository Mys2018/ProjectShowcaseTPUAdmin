import { useState } from 'react'
import { useRemovePlatform } from '../api/mutations'
import { CloseButton, ConfirmModal } from '@/shared'

export function RemovePlatformButton({ platformId }: { platformId: string }) {
  const [open, setOpen] = useState(false)
  const { mutate: remove, isPending } = useRemovePlatform()

  return (
    <>
      <CloseButton onClick={() => setOpen(true)} />
      <ConfirmModal
        isOpened={open}
        isPending={isPending}
        onSubmit={() => remove(platformId, { onSettled: () => setOpen(false) })}
        onReject={() => setOpen(false)}
      />
    </>
  )
}
