import { NavLink } from 'react-router-dom'
import type { ComponentPropsWithoutRef } from 'react'
import styles from './VerticalTabs.module.css'

export interface TabProps {
  name: string
  to: string
}

interface VerticalTabsProps extends Omit<ComponentPropsWithoutRef<'nav'>, 'children'> {
  items: TabProps[]
}

export function VerticalTabs({ items, className, ...props }: VerticalTabsProps) {
  return (
    <nav className={`${styles.list} ${className ?? ''}`} {...props}>
      {items.map(tab => (
        <NavLink key={tab.name} to={tab.to} className={({ isActive }) => `${styles.tab} ${isActive && styles.active}`}>
          {tab.name}
        </NavLink>
      ))}
    </nav>
  )
}
