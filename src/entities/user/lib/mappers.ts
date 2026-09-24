import {
  type StudentScore,
  type StudentScoreDto,
  type User,
  type UserBase,
  type UserBaseDto,
  type UserDto,
  type UserRole
} from '../model/types'
import defaultAvatar from '../assets/user-avatar.svg'
import { ROLE_WEIGHTS } from '../config/constants'

const mapRoles = (dto: UserDto['roles']): UserRole[] => {
  return Object.entries(dto).map(([key, value]) => {
    const type = key as keyof UserDto['roles']
    return {
      type: type,
      weight: ROLE_WEIGHTS[type],
      ...value
    } as UserRole
  })
}

export const mapUserDto = (dto: UserDto): User => {
  const fullName = [dto.meta.lastName, dto.meta.firstName, dto.meta.patronym]
    .filter(Boolean)
    .join(' ')

  return {
    id: String(dto.userId),
    email: dto.email,
    profilePicture: dto.profilePicture || defaultAvatar,
    meta: {
      name: fullName,
      bio: dto.meta.bio ?? '',
      competencies:
        dto.meta.skills?.map(c => ({
          id: c.roleTypeId,
          name: c.roleTypeName,
          skills:
            c.skills?.map(s => ({
              id: s.skillId,
              name: s.skillName
            })) || []
        })) || [],
      messengers: {
        telegram: dto.meta.messengers?.telegram,
        vk: dto.meta.messengers?.vk,
        element: dto.meta.messengers?.element
      },
      portfolioLink: dto.meta.portfolioLink,
      interests: dto.meta.interests,
      experience: dto.meta.experience
    },
    roles: mapRoles(dto.roles),
    capabilities: dto.capabilities || []
  }
}

export const mapUserBaseDto = (dto: UserBaseDto): UserBase => {
  return {
    id: String(dto.userId),
    email: dto.email,
    profilePicture: dto.profilePicture || defaultAvatar,
    roles:
      dto.roles?.map(roleName => {
        const type = roleName as keyof UserDto['roles']
        return {
          type: type,
          weight: ROLE_WEIGHTS[type]
        } as UserRole
      }) || [],
    meta: {
      name: `${dto.meta.lastName} ${dto.meta.firstName}`
    }
  }
}

export const mapStudentScoreDto = (dto: StudentScoreDto): StudentScore => ({
  userId: String(dto.userId),
  totalScore: dto.totalScore
})
