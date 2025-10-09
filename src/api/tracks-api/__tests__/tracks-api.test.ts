import { tracksApi, TrackUploadChunk } from '../tracks-api';
import { api } from '../../api';

// Mock the API
vi.mock('../../api');

describe('tracksApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('uploadChunk', () => {
    it('uploads track chunk successfully', async () => {
      // Arrange
      const userId = 123;
      const formData = new FormData();
      const mockFile = new File(['audio data'], 'track.mp3', {
        type: 'audio/mpeg',
      });
      formData.append('file', mockFile);
      formData.append('chunkIndex', '0');
      formData.append('totalChunks', '3');

      const mockResponse = {
        trackMediaId: 'track_789',
        status: 200,
      };

      vi.mocked(api.post).mockResolvedValue({ data: mockResponse });

      // Act
      const result = await tracksApi.uploadChunk(userId, formData);

      // Assert
      expect(api.post).toHaveBeenCalledWith(
        `tracks/upload/${userId}`,
        formData
      );
      expect(result).toEqual(mockResponse);
    });

    it('handles chunk upload with error status', async () => {
      // Arrange
      const userId = 456;
      const formData = new FormData();
      const mockResponse = {
        trackMediaId: 'track_failed',
        status: 400,
        errorReasonType: 1,
      };

      vi.mocked(api.post).mockResolvedValue({ data: mockResponse });

      // Act
      const result = await tracksApi.uploadChunk(userId, formData);

      // Assert
      expect(result.status).toBe(400);
      expect(result.errorReasonType).toBe(1);
    });

    it('handles multiple chunk upload scenario', async () => {
      // Arrange
      const userId = 789;
      const formData = new FormData();

      // Simulate chunk 2 of 5
      const chunk = new Blob(['chunk data'], { type: 'audio/mpeg' });
      formData.append('chunk', chunk);
      formData.append('chunkIndex', '1'); // 0-based index
      formData.append('totalChunks', '5');
      formData.append('fileId', 'unique_file_id_123');
      formData.append('fileName', 'my-song.mp3');

      const mockResponse = {
        trackMediaId: 'track_123_chunk_1',
        status: 202, // Accepted, more chunks expected
      };

      vi.mocked(api.post).mockResolvedValue({ data: mockResponse });

      // Act
      const result = await tracksApi.uploadChunk(userId, formData);

      // Assert
      expect(result.status).toBe(202);
      expect(result.trackMediaId).toBe('track_123_chunk_1');
    });

    it('handles final chunk upload', async () => {
      // Arrange
      const userId = 123;
      const formData = new FormData();
      formData.append('chunkIndex', '4'); // Last chunk (5th of 5)
      formData.append('totalChunks', '5');
      formData.append('fileName', 'complete-track.wav');

      const mockResponse = {
        trackMediaId: 'track_complete_456',
        status: 201, // Created - upload complete
      };

      vi.mocked(api.post).mockResolvedValue({ data: mockResponse });

      // Act
      const result = await tracksApi.uploadChunk(userId, formData);

      // Assert
      expect(result.status).toBe(201);
      expect(result.trackMediaId).toBe('track_complete_456');
    });

    it('handles various audio file types', async () => {
      // Arrange
      const userId = 123;
      const testCases = [
        { filename: 'track.mp3', mimetype: 'audio/mpeg' },
        { filename: 'track.wav', mimetype: 'audio/wav' },
        { filename: 'track.flac', mimetype: 'audio/flac' },
        { filename: 'track.aac', mimetype: 'audio/aac' },
      ];

      for (const testCase of testCases) {
        const formData = new FormData();
        const mockFile = new File(['audio data'], testCase.filename, {
          type: testCase.mimetype,
        });
        formData.append('file', mockFile);

        const mockResponse = {
          trackMediaId: `track_${testCase.filename}`,
          status: 200,
        };

        vi.mocked(api.post).mockResolvedValue({ data: mockResponse });

        // Act
        const result = await tracksApi.uploadChunk(userId, formData);

        // Assert
        expect(result.trackMediaId).toBe(`track_${testCase.filename}`);
      }
    });

    it('handles large user IDs', async () => {
      // Arrange
      const userId = 999999999;
      const formData = new FormData();

      const mockResponse = {
        trackMediaId: 'track_large_user',
        status: 200,
      };

      vi.mocked(api.post).mockResolvedValue({ data: mockResponse });

      // Act
      await tracksApi.uploadChunk(userId, formData);

      // Assert
      expect(api.post).toHaveBeenCalledWith(
        `tracks/upload/${userId}`,
        formData
      );
    });

    it('propagates upload errors', async () => {
      // Arrange
      const userId = 123;
      const formData = new FormData();
      const apiError = new Error('File size exceeds limit');
      vi.mocked(api.post).mockRejectedValue(apiError);

      // Act & Assert
      await expect(tracksApi.uploadChunk(userId, formData)).rejects.toThrow(
        'File size exceeds limit'
      );
    });

    it('handles network timeout errors', async () => {
      // Arrange
      const userId = 123;
      const formData = new FormData();
      const timeoutError = new Error('Request timeout');
      vi.mocked(api.post).mockRejectedValue(timeoutError);

      // Act & Assert
      await expect(tracksApi.uploadChunk(userId, formData)).rejects.toThrow(
        'Request timeout'
      );
    });
  });

  describe('deleteUploadedTrack', () => {
    it('deletes uploaded track successfully', async () => {
      // Arrange
      const trackMediaId = 'track_789';
      vi.mocked(api.delete).mockResolvedValue({ data: undefined });

      // Act
      await tracksApi.deleteUploadedTrack(trackMediaId);

      // Assert
      expect(api.delete).toHaveBeenCalledWith(
        `tracks/upload/delete/${trackMediaId}`
      );
    });

    it('handles deletion of track with special characters in ID', async () => {
      // Arrange
      const trackMediaId = 'track_user-123_file-name.mp3_chunk-0';
      vi.mocked(api.delete).mockResolvedValue({ data: undefined });

      // Act
      await tracksApi.deleteUploadedTrack(trackMediaId);

      // Assert
      expect(api.delete).toHaveBeenCalledWith(
        `tracks/upload/delete/${trackMediaId}`
      );
    });

    it('handles deletion of very long track media ID', async () => {
      // Arrange
      const trackMediaId = 'track_' + 'a'.repeat(200); // Very long ID
      vi.mocked(api.delete).mockResolvedValue({ data: undefined });

      // Act
      await tracksApi.deleteUploadedTrack(trackMediaId);

      // Assert
      expect(api.delete).toHaveBeenCalledWith(
        `tracks/upload/delete/${trackMediaId}`
      );
    });

    it('propagates deletion errors', async () => {
      // Arrange
      const trackMediaId = 'track_nonexistent';
      const apiError = new Error('Track not found');
      vi.mocked(api.delete).mockRejectedValue(apiError);

      // Act & Assert
      await expect(tracksApi.deleteUploadedTrack(trackMediaId)).rejects.toThrow(
        'Track not found'
      );
    });

    it('handles already deleted track', async () => {
      // Arrange
      const trackMediaId = 'track_already_deleted';
      const notFoundError = { response: { status: 404 } };
      vi.mocked(api.delete).mockRejectedValue(notFoundError);

      // Act & Assert
      await expect(tracksApi.deleteUploadedTrack(trackMediaId)).rejects.toEqual(
        notFoundError
      );
    });

    it('handles server errors during deletion', async () => {
      // Arrange
      const trackMediaId = 'track_server_error';
      const serverError = {
        response: { status: 500, data: 'Internal server error' },
      };
      vi.mocked(api.delete).mockRejectedValue(serverError);

      // Act & Assert
      await expect(tracksApi.deleteUploadedTrack(trackMediaId)).rejects.toEqual(
        serverError
      );
    });

    it('handles empty track media ID', async () => {
      // Arrange
      const trackMediaId = '';
      vi.mocked(api.delete).mockResolvedValue({ data: undefined });

      // Act
      await tracksApi.deleteUploadedTrack(trackMediaId);

      // Assert
      expect(api.delete).toHaveBeenCalledWith('tracks/upload/delete/');
    });

    it('handles numeric track media ID (converted to string)', async () => {
      // Arrange
      const trackMediaId = '12345';
      vi.mocked(api.delete).mockResolvedValue({ data: undefined });

      // Act
      await tracksApi.deleteUploadedTrack(trackMediaId);

      // Assert
      expect(api.delete).toHaveBeenCalledWith('tracks/upload/delete/12345');
    });
  });

  describe('TrackUploadChunk interface validation', () => {
    it('should handle complete chunk data structure', () => {
      // This test validates that the interface structure is correct
      const chunkData: TrackUploadChunk = {
        fileId: 'unique_file_123',
        chunkIndex: 0,
        totalChunks: 5,
        fileName: 'my-awesome-song.mp3',
        chunk: new Blob(['audio chunk data'], { type: 'audio/mpeg' }),
        mimeType: 'audio/mpeg',
      };

      // Assert
      expect(chunkData.fileId).toBe('unique_file_123');
      expect(chunkData.chunkIndex).toBe(0);
      expect(chunkData.totalChunks).toBe(5);
      expect(chunkData.fileName).toBe('my-awesome-song.mp3');
      expect(chunkData.chunk).toBeInstanceOf(Blob);
      expect(chunkData.mimeType).toBe('audio/mpeg');
    });
  });
});
