import type { Skill, SkillDto } from '../model/types'
import { mapSkillDto } from '../lib/mappers'
import { api, ENDPOINTS } from '@/shared'

type SkillsResponse = SkillDto[] | { skills?: SkillDto[] }

export const getSkills = async (params: {
  offset?: number
  limit?: number
  query?: string
  roleType?: string
}): Promise<Skill[]> => {
  const { data } = await api.get<SkillsResponse>(ENDPOINTS.SKILLS, { params })
  const list = Array.isArray(data) ? data : (data.skills ?? [])
  return list.map(mapSkillDto)
}

export const createSkill = async (payload: Omit<Skill, 'id'>): Promise<string> => {
  const { data } = await api.post<{ skillId: string }>(ENDPOINTS.SKILLS, {
    skillName: payload.name,
    roleTypeId: payload.roleTypeId
  })
  return data.skillId
}

export const editSkill = async (id: string, payload: Skill): Promise<void> => {
  const dto: SkillDto = {
    skillId: payload.id,
    skillName: payload.name,
    roleTypeId: payload.roleTypeId
  }
  await api.put(ENDPOINTS.SKILL_BY_ID(id), dto)
}

export const removeSkill = async (id: string): Promise<void> => {
  await api.delete(ENDPOINTS.SKILL_BY_ID(id))
}
