import { api } from '../api';

export interface WorkingTrackMedia {
  trackId: string;
  trackMediaId: string;
  trackOrder: number;
}

export interface CreateWorkspaceRequest {
  userId: number;
  sessionTypeId: number;
  workingTrackMedias: WorkingTrackMedia[];
  isActive: boolean;
  payload: string;
}

export interface CreateWorkspaceResponse {
  id: string;
  userId: number;
  sessionTypeId: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const sessionApi = {
  async createWorkspace(
    userId: number,
    sessionTypeId: number,
    workingTrackMedias: WorkingTrackMedia[]
  ): Promise<CreateWorkspaceResponse> {
    const payload: CreateWorkspaceRequest = {
      userId,
      sessionTypeId,
      workingTrackMedias,
      isActive: true,
      payload: JSON.stringify({ workingTrackMedias }),
    };

    const response = await api.post<
      CreateWorkspaceResponse,
      CreateWorkspaceRequest
    >('session/workspace', payload);

    return response.data;
  },
};
