export type ComplaintStatus = 'Pending' | 'Resolved' | 'Dismissed'

export type Complaint = {
  id: string
  reporterId: string
  targetUserId: string
  reason: string
  status: ComplaintStatus
  createdAt: string
  resolvedAt?: string
  resolvedBy?: string
}

export type ComplaintDto = {
  id: string
  reporterId: number
  targetUserId: number
  reason: string
  status: ComplaintStatus
  createdAt: string
  resolvedAt?: string
  resolvedBy?: number
}

export type ComplaintSearchDto = {
  items?: ComplaintDto[]
  total: number
  offset: number
  limit: number
}
