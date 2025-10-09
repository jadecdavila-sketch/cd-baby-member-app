import { apiService, FetchMethod } from './apiService';

export interface uploadReleaseImage {
  releaseId: number;
  modifiedBy: string;
  file: File;
  fileName: string;
  artworkLocation?: string;
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

//TODO Not using apiService here since requires to post as a formData, not sure if this cases should be add to the apiservice or not
export async function uploadReleaseImage(
  token: string,
  formData: FormData,
  name: string,
  releaseId: number = 1,
  modifiedBy: string = '1'
): Promise<any> {
  const url = `/api/release/art/upload?releaseId=${releaseId}&filename=${name}&modifiedBy=${modifiedBy}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Upload failed: ${error}`);
  }

  return await response.json();
}

export async function createRelease(
  token: string,
  data: CreateReleaseInput
): Promise<any> {
  return await apiService(token, 'release', FetchMethod.POST, {
    body: data,
  });
}

export async function insertReleaseStatus(
  token: string,
  data: InsertReleaseStatusInput
): Promise<any> {
  return await apiService(token, 'release/status', FetchMethod.POST, {
    body: data,
  });
}

export async function fetchReleaseImage(
  token: string,
  releaseId: number
): Promise<Blob> {
  const response = await fetch(`/api/release/art/${releaseId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch image for release ${releaseId}`);
  }

  return await response.blob();
}
