import type { Complaint, ComplaintSearchDto, ComplaintStatus } from '../model/types'
import { mapComplaintDto } from '../lib/mappers'
import { api, ENDPOINTS } from '@/shared'

export const getComplaints = async (params: {
  offset: number
  limit: number
}): Promise<{ items: Complaint[]; total: number }> => {
  const { data } = await api.get<ComplaintSearchDto>(ENDPOINTS.MODERATION_COMPLAINTS, { params })
  return {
    items: (data.items ?? []).map(mapComplaintDto),
    total: data.total
  }
}

export const resolveComplaint = async (id: string, status: ComplaintStatus): Promise<void> => {
  await api.put(ENDPOINTS.MODERATION_COMPLAINT_BY_ID(id), { status })
}
