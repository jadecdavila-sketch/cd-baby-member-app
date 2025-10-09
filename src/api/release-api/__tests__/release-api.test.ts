import {
  releaseApi,
  CreateReleaseInput,
  InsertReleaseStatusInput,
  UploadReleaseImageParams,
} from '../release-api';
import { api } from '../../api';

// Mock the API
vi.mock('../../api');

describe('releaseApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('uploadReleaseImage', () => {
    it('uploads release image successfully', async () => {
      const uploadParams: UploadReleaseImageParams = {
        releaseId: 123,
        filename: 'album-cover.jpg',
        modifiedBy: 'user456',
        formData: new FormData(),
      };

      const mockResponse = { success: true, imageId: 'img_789' };
      vi.mocked(api.post).mockResolvedValue({ data: mockResponse });

      const result = await releaseApi.uploadReleaseImage(uploadParams);

      expect(api.post).toHaveBeenCalledWith(
        `release/art/upload?releaseId=${uploadParams.releaseId}&filename=${uploadParams.filename}&modifiedBy=${uploadParams.modifiedBy}`,
        uploadParams.formData
      );
      expect(result).toEqual(mockResponse);
    });

    it('handles special characters in filename', async () => {
      const uploadParams: UploadReleaseImageParams = {
        releaseId: 456,
        filename: 'álbum cover (2024) #1.png',
        modifiedBy: 'user789',
        formData: new FormData(),
      };

      const mockResponse = { success: true };
      vi.mocked(api.post).mockResolvedValue({ data: mockResponse });

      await releaseApi.uploadReleaseImage(uploadParams);

      expect(api.post).toHaveBeenCalledWith(
        `release/art/upload?releaseId=${uploadParams.releaseId}&filename=${encodeURIComponent(uploadParams.filename)}&modifiedBy=${uploadParams.modifiedBy}`,
        uploadParams.formData
      );
    });

    it('handles FormData with actual file', async () => {
      const formData = new FormData();
      const file = new File(['fake file content'], 'test.jpg', {
        type: 'image/jpeg',
      });
      formData.append('file', file);

      const uploadParams: UploadReleaseImageParams = {
        releaseId: 123,
        filename: 'test.jpg',
        modifiedBy: 'user123',
        formData,
      };

      const mockResponse = { success: true };
      vi.mocked(api.post).mockResolvedValue({ data: mockResponse });

      await releaseApi.uploadReleaseImage(uploadParams);

      expect(api.post).toHaveBeenCalledWith(
        `release/art/upload?releaseId=123&filename=test.jpg&modifiedBy=user123`,
        formData
      );
    });

    it('propagates upload errors', async () => {
      const uploadParams: UploadReleaseImageParams = {
        releaseId: 123,
        filename: 'test.jpg',
        modifiedBy: 'user123',
        formData: new FormData(),
      };

      const apiError = new Error('File too large');
      vi.mocked(api.post).mockRejectedValue(apiError);

      await expect(releaseApi.uploadReleaseImage(uploadParams)).rejects.toThrow(
        'File too large'
      );
    });
  });

  describe('createRelease', () => {
    it('creates release successfully', async () => {
      const releaseInput: CreateReleaseInput = {
        ReleaseTitle: 'My New Album',
        ReleaseTypeId: 1,
        MetadataLanguageId: 2,
        ModifiedBy: 'user123',
      };

      const mockResponse = {
        id: 789,
        releaseTitle: 'My New Album',
        releaseTypeId: 1,
        metadataLanguageId: 2,
        modifiedBy: 'user123',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      vi.mocked(api.post).mockResolvedValue({ data: mockResponse });

      const result = await releaseApi.createRelease(releaseInput);

      expect(api.post).toHaveBeenCalledWith('release', releaseInput);
      expect(result).toEqual(mockResponse);
    });

    it('handles release with special characters in title', async () => {
      const releaseInput: CreateReleaseInput = {
        ReleaseTitle: 'Ñoño\'s "Greatest Hits" & More!',
        ReleaseTypeId: 2,
        MetadataLanguageId: 1,
        ModifiedBy: 'user456',
      };

      const mockResponse = {
        id: 123,
        releaseTitle: 'Ñoño\'s "Greatest Hits" & More!',
        releaseTypeId: 2,
        metadataLanguageId: 1,
        modifiedBy: 'user456',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      vi.mocked(api.post).mockResolvedValue({ data: mockResponse });

      const result = await releaseApi.createRelease(releaseInput);

      expect(result.releaseTitle).toBe('Ñoño\'s "Greatest Hits" & More!');
    });

    it('propagates create errors', async () => {
      const releaseInput: CreateReleaseInput = {
        ReleaseTitle: '',
        ReleaseTypeId: 1,
        MetadataLanguageId: 1,
        ModifiedBy: 'user123',
      };

      const apiError = new Error('Release title is required');
      vi.mocked(api.post).mockRejectedValue(apiError);

      await expect(releaseApi.createRelease(releaseInput)).rejects.toThrow(
        'Release title is required'
      );
    });
  });

  describe('insertReleaseStatus', () => {
    it('inserts release status successfully', async () => {
      const statusInput: InsertReleaseStatusInput = {
        ReleaseId: 123,
        ModifiedBy: 'user789',
        ReleaseStatusTypeId: 2,
      };

      const mockResponse = {
        id: 456,
        releaseId: 123,
        releaseStatusTypeId: 2,
        modifiedBy: 'user789',
        createdAt: '2024-01-01T00:00:00Z',
      };

      vi.mocked(api.post).mockResolvedValue({ data: mockResponse });

      const result = await releaseApi.insertReleaseStatus(statusInput);

      expect(api.post).toHaveBeenCalledWith('release/status', statusInput);
      expect(result).toEqual(mockResponse);
    });

    it('handles different status types', async () => {
      const statusInput: InsertReleaseStatusInput = {
        ReleaseId: 456,
        ModifiedBy: 'user123',
        ReleaseStatusTypeId: 5, // Different status type
      };

      const mockResponse = {
        id: 789,
        releaseId: 456,
        releaseStatusTypeId: 5,
        modifiedBy: 'user123',
        createdAt: '2024-01-01T00:00:00Z',
      };

      vi.mocked(api.post).mockResolvedValue({ data: mockResponse });

      const result = await releaseApi.insertReleaseStatus(statusInput);

      expect(result.releaseStatusTypeId).toBe(5);
    });

    it('propagates status insertion errors', async () => {
      const statusInput: InsertReleaseStatusInput = {
        ReleaseId: 999, // Non-existent release
        ModifiedBy: 'user123',
        ReleaseStatusTypeId: 1,
      };

      const apiError = new Error('Release not found');
      vi.mocked(api.post).mockRejectedValue(apiError);

      await expect(releaseApi.insertReleaseStatus(statusInput)).rejects.toThrow(
        'Release not found'
      );
    });
  });

  describe('fetchReleaseImage', () => {
    it('fetches release image successfully', async () => {
      const releaseId = 123;
      const mockBlob = new Blob(['fake image data'], { type: 'image/jpeg' });
      vi.mocked(api.get).mockResolvedValue({ data: mockBlob });

      const result = await releaseApi.fetchReleaseImage(releaseId);

      expect(api.get).toHaveBeenCalledWith(`release/art/${releaseId}`, {
        responseType: 'blob',
      });
      expect(result).toEqual(mockBlob);
      expect(result.type).toBe('image/jpeg');
    });

    it('handles different image types', async () => {
      const releaseId = 456;
      const mockBlob = new Blob(['fake png data'], { type: 'image/png' });
      vi.mocked(api.get).mockResolvedValue({ data: mockBlob });

      const result = await releaseApi.fetchReleaseImage(releaseId);

      expect(result.type).toBe('image/png');
    });

    it('handles large release IDs', async () => {
      const releaseId = 999999999;
      const mockBlob = new Blob(['image data'], { type: 'image/webp' });
      vi.mocked(api.get).mockResolvedValue({ data: mockBlob });

      await releaseApi.fetchReleaseImage(releaseId);

      expect(api.get).toHaveBeenCalledWith(`release/art/${releaseId}`, {
        responseType: 'blob',
      });
    });

    it('propagates fetch errors', async () => {
      const releaseId = 123;
      const apiError = new Error('Image not found');
      vi.mocked(api.get).mockRejectedValue(apiError);

      await expect(releaseApi.fetchReleaseImage(releaseId)).rejects.toThrow(
        'Image not found'
      );
    });

    it('handles empty blob response', async () => {
      const releaseId = 123;
      const emptyBlob = new Blob([], { type: 'image/jpeg' });
      vi.mocked(api.get).mockResolvedValue({ data: emptyBlob });

      const result = await releaseApi.fetchReleaseImage(releaseId);

      expect(result).toEqual(emptyBlob);
      expect(result.size).toBe(0);
    });

    it('ensures blob response type is configured', async () => {
      const releaseId = 123;
      const mockBlob = new Blob(['data'], { type: 'image/jpeg' });
      vi.mocked(api.get).mockResolvedValue({ data: mockBlob });

      await releaseApi.fetchReleaseImage(releaseId);

      expect(api.get).toHaveBeenCalledWith(
        `release/art/${releaseId}`,
        expect.objectContaining({
          responseType: 'blob',
        })
      );
    });
  });
});
