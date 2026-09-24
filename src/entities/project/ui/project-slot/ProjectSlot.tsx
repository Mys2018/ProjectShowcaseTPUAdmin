import type { ComponentPropsWithoutRef, ReactElement } from 'react'
import s from './ProjectSlot.module.css'
import type { Project } from '../../model/types.ts'
import { getStatusTranslation } from '../../lib/getStatusTranslation.ts'
import { getTypeTranslation } from '../../lib/getTypeTranslation.ts'

interface ProjectSlotProps extends ComponentPropsWithoutRef<'div'> {
  project: Project
  partnerElement?: ReactElement
  isClickable?: boolean
}

export const ProjectSlot = ({
  project,
  partnerElement,
  isClickable = false,
  className,
  children,
  ...props
}: ProjectSlotProps) => {
  const tagsAmount = project.tags?.length || 0
  return (
    <div className={`${s.container} ${isClickable ? s.clickable : ''} ${className ?? ''}`} {...props}>
      <div className={s.header}>
        <div className={s.upper}>
          <h6 className={s.title} title={project.meta.title}>
            {project.meta.title}
          </h6>
          <div className={s.tag}>
            <p className={s.tagText}>{project.primaryTag.name}</p>
            {tagsAmount > 0 && (
              <>
                <span className={s.dot} />
                <p className={s.tagText}>Ещё +{tagsAmount}</p>
              </>
            )}
          </div>
        </div>
        <div className={s.lower}>
          <p className={`${s.status} ${s[project.status]}`}>{getStatusTranslation(project.status)}</p>
          <span className={s.dot} />
          <p className={s.metaItem}>{getTypeTranslation(project.type)}</p>
          <span className={s.dot} />
          <p className={s.ellipsis} title={project.id}>
            {project.id}
          </p>
        </div>
      </div>
      {(partnerElement || children) && (
        <div className={s.footer}>
          {partnerElement}
          {children}
        </div>
      )}
    </div>
  )
}
