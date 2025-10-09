import { api } from '../api';

export interface UploadReleaseImageParams {
  releaseId: number;
  filename: string;
  modifiedBy: string;
  formData: FormData;
}

export interface CreateReleaseInput {
  ReleaseTitle: string;
  ReleaseTypeId: number;
  MetadataLanguageId: number;
  ModifiedBy: string;
}

export interface InsertReleaseStatusInput {
  ReleaseId: number;
  ModifiedBy: string;
  ReleaseStatusTypeId: number;
}

export interface ReleaseResponse {
  id: number;
  releaseTitle: string;
  releaseTypeId: number;
  metadataLanguageId: number;
  modifiedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReleaseStatusResponse {
  id: number;
  releaseId: number;
  releaseStatusTypeId: number;
  modifiedBy: string;
  createdAt: string;
}

export const releaseApi = {
  async uploadReleaseImage({
    releaseId,
    filename,
    modifiedBy,
    formData,
  }: UploadReleaseImageParams): Promise<any> {
    const response = await api.post<any, FormData>(
      `release/art/upload?releaseId=${releaseId}&filename=${encodeURIComponent(filename)}&modifiedBy=${modifiedBy}`,
      formData
    );

    return response.data;
  },

  async createRelease(data: CreateReleaseInput): Promise<ReleaseResponse> {
    const response = await api.post<ReleaseResponse, CreateReleaseInput>(
      'release',
      data
    );

    return response.data;
  },

  async insertReleaseStatus(
    data: InsertReleaseStatusInput
  ): Promise<ReleaseStatusResponse> {
    const response = await api.post<
      ReleaseStatusResponse,
      InsertReleaseStatusInput
    >('release/status', data);

    return response.data;
  },

  async fetchReleaseImage(releaseId: number): Promise<Blob> {
    const response = await api.get<Blob>(`release/art/${releaseId}`, {
      responseType: 'blob',
    });

    return response.data;
  },
};
