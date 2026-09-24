import { axiosInstance } from '@/api/instance';
import { ENDPOINTS } from '@/config/endpoints';
import type { UploadResponse } from '@/types';

class FilesRequests {
  async upload(file: File): Promise<UploadResponse> {
    const form = new FormData();
    form.append('file', file);
    const { data } = await axiosInstance.post<UploadResponse>(
      ENDPOINTS.FILES_UPLOAD,
      form,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );
    return data;
  }
}

export const filesRequests = new FilesRequests();
