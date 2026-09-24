import type { Complaint, ComplaintDto } from '../model/types'

export const mapComplaintDto = (dto: ComplaintDto): Complaint => ({
  id: dto.id,
  reporterId: String(dto.reporterId),
  targetUserId: String(dto.targetUserId),
  reason: dto.reason,
  status: dto.status,
  createdAt: dto.createdAt,
  resolvedAt: dto.resolvedAt,
  resolvedBy: dto.resolvedBy !== undefined ? String(dto.resolvedBy) : undefined
})
