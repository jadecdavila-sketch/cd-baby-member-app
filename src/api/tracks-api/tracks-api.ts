import { api } from '../api';

export interface TrackUploadResponse {
  trackMediaId: string;
  status: number;
  errorReasonType?: number;
}

export interface TrackUploadChunk {
  fileId: string;
  chunkIndex: number;
  totalChunks: number;
  fileName: string;
  chunk: Blob;
  mimeType: string;
}

export const tracksApi = {
  async uploadChunk(
    userId: number,
    formData: FormData
  ): Promise<TrackUploadResponse> {
    const response = await api.post<TrackUploadResponse, FormData>(
      `tracks/upload/${userId}`,
      formData
    );

    return response.data;
  },

  async deleteUploadedTrack(trackMediaId: string): Promise<void> {
    await api.delete(`tracks/upload/delete/${trackMediaId}`);
  },
};
