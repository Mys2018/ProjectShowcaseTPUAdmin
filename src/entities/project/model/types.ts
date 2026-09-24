export type ProjectStatus =
  | 'completed'
  | 'inprogress'
  | 'needsrework'
  | 'notimplemented'
  | 'pending'
  | 'recruiting'
  | 'recruitmentcompleted'
  | 'rejected'
  // legacy aliases (mapper may still receive older values)
  | 'active'
  | 'approved'
  | 'archived'

export type ProjectType = 'Case' | 'Real' | 'Study'

export type ProjectPartner = {
  id: string
  name: string
  avatarUrl?: string
}

/** Local VO — avoid entity→entity imports (FSD) */
export type ProjectTagRef = {
  id: string
  name: string
  groupId: string
}

export type ProjectRoleTypeRef = {
  id: string
  name: string
}

export type ProjectCheckpointRef = {
  title: string
  deadline: Date
}

export type ProjectCheckpointGroupRef = {
  id: string
  title: string
  checkpoints: ProjectCheckpointRef[]
}

export type Project = {
  type: ProjectType
  id: string
  ownerId: string
  partner: ProjectPartner
  status: ProjectStatus
  meta: {
    title: string
    description: string
  }
  checkpointGroup: ProjectCheckpointGroupRef
  customCheckpoints?: ProjectCheckpointRef[]
  roles?: {
    roleId: string
    roleType: ProjectRoleTypeRef
    placesCount: number
    minPlacesCount: number
    studentIds: string[]
    skills: {
      skillId: string
      skillName: string
    }[]
    applicationsCount?: number
  }[]
  primaryTag: ProjectTagRef
  tags?: ProjectTagRef[]
  prdMeta: StudyProjectPrdDto | CaseProjectPrdDto | RealProjectPrdDto
  isPromoted: boolean
  isLikedByMe?: boolean
}

export type ProjectDto = {
  id: string
  ownerId: number
  partner?: {
    projectPartnerId: string
    name: string
    profilePicture?: string
  } | null
  status: string
  meta: {
    title: string
    description: string
  }
  checkpoints?: {
    id: string
    name?: string
    checkpoints?: {
      title: string
      deadline: string
    }[]
  } | null
  customCheckpoints?: {
    title: string
    deadline: string
  }[]
  roles?: {
    roleId: string
    roleType: {
      id: string
      name: string
    }
    placesCount: number
    minPlacesCount: number
    places?: number[]
    skills?: {
      skillId: string
      skillName: string
      roleTypeId?: string
    }[]
    applicationsCount?: number
    meta?: {
      description?: string
    }
  }[]
  primaryTag?: {
    tagId: string
    tagName: string
    groupId: string
  } | null
  tags?: {
    tagId: string
    tagName: string
    groupId: string
  }[]
  prdMeta: StudyProjectPrdDto | CaseProjectPrdDto | RealProjectPrdDto
  isPromoted: boolean
  isLikedByMe?: boolean
  repository?: { platformId: string; name: string; url: string }[]
  taskTracker?: { platformId: string; name: string; url: string }[]
  otherPlatforms?: { platformId: string; name: string; url: string }[]
}

type StudyProjectPrdDto = {
  prerequisites: string
  projectGoal: string
  keyFunctionality?: string[]
}

type CaseProjectPrdDto = {
  prerequisites: string
  audience?: {
    title: string
    minAge?: number
    maxAge?: number
    description: string
  }[]
  projectGoal: string
  functional?: string[]
  problemStatement: string
}

type RealProjectPrdDto = {
  businessGoal: string
  productVision: string
  projectGoal: string
  audience?: {
    title: string
    minAge?: number
    maxAge?: number
    description: string
  }[]
  businessMetrics?: string[]
  functional?: string[]
  nonFunctional?: string[]
  projectPlan?: string[]
}

export type { StudyProjectPrdDto, CaseProjectPrdDto, RealProjectPrdDto }
