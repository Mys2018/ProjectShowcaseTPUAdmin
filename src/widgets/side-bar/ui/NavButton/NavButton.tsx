import { NavLink, type LinkProps } from 'react-router-dom'
import styles from './NavButton.module.css'

interface NavButtonProps extends LinkProps {
  Icon?: React.FC<React.SVGProps<SVGSVGElement>>
  className?: string
}

export function NavButton({ Icon, className, children, ...props }: NavButtonProps) {
  return (
    <NavLink className={({isActive}) => `${styles.button} ${isActive && styles.active} ${className}`} {...props}>
      {Icon && <Icon className={styles.icon} />}
      {children}
    </NavLink>
  )
}