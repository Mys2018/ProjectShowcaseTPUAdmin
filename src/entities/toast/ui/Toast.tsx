import { useEffect, useState } from 'react'
import styles from './Toast.module.css'
import type { Toast } from '../model/types'

interface ToastProps {
  toast: Toast
  onClose: (id: string) => void
}

export function Toast({ toast, onClose }: ToastProps) {
  const { id, status, title, description, link } = toast
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) return
  
    const closeTimer = setTimeout(() => onClose(id), 5000)
    return () => clearTimeout(closeTimer)
  }, [onClose, id, isPaused])
  
  return (
    <div
      className={`${styles.toast} ${styles[status]} ${isPaused ? "" : styles.fadeOut}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onClick={() => onClose(id)}
    >
      {title && <h5>{title}</h5>}
      {description && <p>{description}</p>}
      {link && (
        <a href={link.to} target='_blank' rel='noopener noreferrer' className={styles.link}>
          {link.title}
        </a>
      )}
    </div>
  )
}
