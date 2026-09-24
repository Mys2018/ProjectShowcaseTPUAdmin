export interface ErrorPayload {
  code: string;
  msg: string;
}

export interface PaginatedParams {
  offset: number;
  limit: number;
  query?: string;
}

export interface UploadResponse {
  url: string;
}
