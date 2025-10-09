import { apiService, FetchMethod } from './apiService';

type WorkingTrackMedia = {
  trackId: string;
  trackMediaId: string;
  trackOrder: number;
};

export async function uploadFileInChunks({
  file,
  userId,
  accessToken,
  onProgress,
  chunkSize = 5 * 1024 * 1024,
}: {
  file: File;
  userId: number;
  accessToken: string;
  onProgress?: (percent: number) => void;
  chunkSize?: number;
}): Promise<{ trackMediaId: string }> {
  const totalChunks = Math.ceil(file.size / chunkSize);
  const fileId = crypto.randomUUID();

  let finalTrackMediaId: string | null = null;
  console.log('file size:', file.size);
  console.log('Uploading', totalChunks, 'chunks');

  for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
    const start = chunkIndex * chunkSize;
    const end = Math.min(start + chunkSize, file.size);
    const chunk = file.slice(start, end);
    console.log(
      `Sending chunk ${chunkIndex + 1}/${totalChunks} (${chunk.size} bytes)`
    );

    const formData = new FormData();
    formData.append('fileId', fileId);
    formData.append('chunkIndex', chunkIndex.toString());
    formData.append('totalChunks', totalChunks.toString());
    formData.append('fileName', file.name);
    formData.append('chunk', chunk);
    formData.append('mimeType', file.type);
    const res = await fetch(`/api/tracks/upload/${userId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });
    console.log(res);

    if (!res.ok) throw new Error(`Chunk ${chunkIndex + 1} failed to upload`);

    const data = await res.json();
    console.log(`Response for chunk ${chunkIndex + 1}:`, data);
    onProgress?.(Math.round(((chunkIndex + 1) / totalChunks) * 100));

    // When upload is complete, check status:
    if (data?.trackMediaId) {
      finalTrackMediaId = data.trackMediaId;
    }

    // If this chunk is marked as success — return immediately
    if (data?.status === 3) {
      return { trackMediaId: data.trackMediaId };
    }

    if (data?.status === 4 && data?.errorReasonType === 615) {
      throw new Error('Duplicate track detected');
    }
  }

  // If no chunk explicitly returned status 3, but we have a media ID — return that.
  if (finalTrackMediaId) {
    return { trackMediaId: finalTrackMediaId };
  }

  throw new Error('Upload did not complete successfully');
}

export async function deleteUploadedTrack(
  trackMediaId: string,
  accessToken: string
) {
  const res = await fetch(`/api/tracks/upload/delete/${trackMediaId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!res.ok) throw new Error('Failed to delete uploaded track');
}

export async function createWorkspace(
  userId: number,
  sessionTypeId: number,
  workingTrackMedias: WorkingTrackMedia[],
  accessToken: string
) {
  const payload = {
    userId,
    sessionTypeId,
    workingTrackMedias,
    isActive: true,
    payload: JSON.stringify({ workingTrackMedias }),
  };

  const response = await apiService(
    accessToken,
    'session/workspace',
    FetchMethod.POST,
    { body: payload }
  );
  return response;

  // const res = await fetch(`/api/session/workspace`, {
  //   method: "POST",
  //   headers: {
  //     Authorization: `Bearer ${accessToken}`,
  //     "Content-Type": "application/json"
  //   },
  //   body: JSON.stringify(payload)
  // })

  // if (!res.ok) throw new Error("Failed to create workspace")
  // return res.json()
}
