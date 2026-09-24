import { axiosInstance } from '@/api/instance';
import { ENDPOINTS } from '@/config/endpoints';
import type {
  CreateTagGroupRequest,
  CreateTagGroupResponse,
  CreateTagRequest,
  CreateTagResponse,
  TagGroup,
  TagGroupWithTagsResponse,
  UpdateTagGroupRequest,
  UpdateTagRequest,
} from '@/types';

class TagsRequests {
  async listGrouped(): Promise<TagGroupWithTagsResponse[]> {
    const { data } = await axiosInstance.get<TagGroupWithTagsResponse[]>(ENDPOINTS.TAGS);
    return data;
  }

  async createTag(body: CreateTagRequest): Promise<CreateTagResponse> {
    const { data } = await axiosInstance.post<CreateTagResponse>(ENDPOINTS.TAGS, body);
    return data;
  }

  async updateTag(id: string, body: UpdateTagRequest): Promise<void> {
    await axiosInstance.put(ENDPOINTS.tagById(id), body);
  }

  async deleteTag(id: string): Promise<void> {
    await axiosInstance.delete(ENDPOINTS.tagById(id));
  }

  async listGroups(): Promise<TagGroup[]> {
    const { data } = await axiosInstance.get<TagGroup[]>(ENDPOINTS.TAG_GROUPS);
    return data;
  }

  async createGroup(body: CreateTagGroupRequest): Promise<CreateTagGroupResponse> {
    const { data } = await axiosInstance.post<CreateTagGroupResponse>(
      ENDPOINTS.TAG_GROUPS,
      body,
    );
    return data;
  }

  async updateGroup(id: string, body: UpdateTagGroupRequest): Promise<void> {
    await axiosInstance.put(ENDPOINTS.tagGroupById(id), body);
  }

  async deleteGroup(id: string): Promise<void> {
    await axiosInstance.delete(ENDPOINTS.tagGroupById(id));
  }
}

export const tagsRequests = new TagsRequests();
