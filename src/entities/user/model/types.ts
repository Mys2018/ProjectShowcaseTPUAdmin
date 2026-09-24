/* eslint-disable @typescript-eslint/no-empty-object-type */
export type UserMessengers = {
  telegram?: string
  vk?: string
  element?: string
}

export type UserCompetency = {
  id: string
  name: string
  skills: {
    id: string
    name: string
  }[]
}

export type User = UserBase & {
  meta: {
    name: string
    bio: string
    competencies: UserCompetency[]
    messengers: UserMessengers
    portfolioLink?: string
    interests?: string
    /** @deprecated API UserMeta не содержит experience — оставлено для совместимости */
    experience?: string
  }
  capabilities: string[]
}

export type UserBase = {
  id: string
  email: string
  roles: UserRole[]
  profilePicture: string
  meta: {
    name: string
  }
}

export type UserBaseDto = {
  userId: number
  email: string
  meta: {
    firstName: string
    lastName: string
  }
  roles?: string[]
  profilePicture?: string
}

export type UserDto = {
  userId: number
  email: string
  profilePicture?: string
  capabilities?: string[]
  meta: {
    firstName: string
    lastName: string
    patronym?: string
    bio?: string
    skills?: {
      roleTypeId: string
      roleTypeName: string
      skills?: {
        skillId: string
        skillName: string
      }[]
    }[]
    messengers?: UserMessengers
    portfolioLink?: string
    interests?: string
    experience?: string
  }
  roles: {
    Default?: {}
    Student?: {
      course: string
      school: string
      meta: {
        group: string
      }
    }
    Admin?: {}
    Curator?: {}
    Mentor?: {}
    Moderator?: {}
    Roop?: {}
    Teacher?: {}
  }
}

export type StudentScore = {
  userId: string
  totalScore: number
}

export type StudentScoreDto = {
  userId: number
  totalScore: number
}

type Role<T> = {
  [K in keyof Required<T>]: { type: K; weight: number } & T[K]
}[keyof Required<T>]

export type UserRole = Role<UserDto['roles']>
