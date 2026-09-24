export type ComplaintStatus = 'Dismissed' | 'Pending' | 'Resolved';

export interface Complaint {
  id: string;
  reporterId: number;
  targetUserId: number;
  reason: string;
  status: ComplaintStatus;
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: number;
}

export interface ComplaintSearchResponse {
  items?: Complaint[];
  total: number;
  offset: number;
  limit: number;
}

export interface ResolveComplaintRequest {
  status: ComplaintStatus;
}
