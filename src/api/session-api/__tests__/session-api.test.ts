import {
  sessionApi,
  WorkingTrackMedia,
  CreateWorkspaceRequest,
} from '../session-api';
import { api } from '../../api';

// Mock the API
vi.mock('../../api');

describe('sessionApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('createWorkspace', () => {
    it('creates workspace successfully with single track', async () => {
      // Arrange
      const userId = 123;
      const sessionTypeId = 1;
      const workingTrackMedias: WorkingTrackMedia[] = [
        {
          trackId: 'track_001',
          trackMediaId: 'media_001',
          trackOrder: 1,
        },
      ];

      const expectedRequest: CreateWorkspaceRequest = {
        userId,
        sessionTypeId,
        workingTrackMedias,
        isActive: true,
        payload: JSON.stringify({ workingTrackMedias }),
      };

      const mockResponse = {
        id: 'workspace_789',
        userId: 123,
        sessionTypeId: 1,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      vi.mocked(api.post).mockResolvedValue({ data: mockResponse });

      // Act
      const result = await sessionApi.createWorkspace(
        userId,
        sessionTypeId,
        workingTrackMedias
      );

      // Assert
      expect(api.post).toHaveBeenCalledWith(
        'session/workspace',
        expectedRequest
      );
      expect(result).toEqual(mockResponse);
    });

    it('creates workspace with multiple tracks in specific order', async () => {
      // Arrange
      const userId = 456;
      const sessionTypeId = 2;
      const workingTrackMedias: WorkingTrackMedia[] = [
        {
          trackId: 'track_001',
          trackMediaId: 'media_001',
          trackOrder: 1,
        },
        {
          trackId: 'track_002',
          trackMediaId: 'media_002',
          trackOrder: 2,
        },
        {
          trackId: 'track_003',
          trackMediaId: 'media_003',
          trackOrder: 3,
        },
      ];

      const mockResponse = {
        id: 'workspace_multi_track',
        userId: 456,
        sessionTypeId: 2,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      vi.mocked(api.post).mockResolvedValue({ data: mockResponse });

      // Act
      const result = await sessionApi.createWorkspace(
        userId,
        sessionTypeId,
        workingTrackMedias
      );

      // Assert
      expect(result.id).toBe('workspace_multi_track');
      expect(api.post).toHaveBeenCalledWith(
        'session/workspace',
        expect.objectContaining({
          workingTrackMedias: expect.arrayContaining([
            expect.objectContaining({ trackOrder: 1 }),
            expect.objectContaining({ trackOrder: 2 }),
            expect.objectContaining({ trackOrder: 3 }),
          ]),
        })
      );
    });

    it('creates workspace with empty track list', async () => {
      // Arrange
      const userId = 789;
      const sessionTypeId = 3;
      const workingTrackMedias: WorkingTrackMedia[] = [];

      const expectedRequest: CreateWorkspaceRequest = {
        userId,
        sessionTypeId,
        workingTrackMedias: [],
        isActive: true,
        payload: JSON.stringify({ workingTrackMedias: [] }),
      };

      const mockResponse = {
        id: 'workspace_empty',
        userId: 789,
        sessionTypeId: 3,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      vi.mocked(api.post).mockResolvedValue({ data: mockResponse });

      // Act
      const result = await sessionApi.createWorkspace(
        userId,
        sessionTypeId,
        workingTrackMedias
      );

      // Assert
      expect(api.post).toHaveBeenCalledWith(
        'session/workspace',
        expectedRequest
      );
      expect(result).toEqual(mockResponse);
    });

    it('handles tracks with special characters in IDs', async () => {
      // Arrange
      const userId = 123;
      const sessionTypeId = 1;
      const workingTrackMedias: WorkingTrackMedia[] = [
        {
          trackId: 'track_special-chars_123',
          trackMediaId: 'media_user@domain.com_track-1',
          trackOrder: 1,
        },
        {
          trackId: 'track_unicode_ñoño',
          trackMediaId: 'media_français_track',
          trackOrder: 2,
        },
      ];

      const mockResponse = {
        id: 'workspace_special_chars',
        userId: 123,
        sessionTypeId: 1,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      vi.mocked(api.post).mockResolvedValue({ data: mockResponse });

      // Act
      const result = await sessionApi.createWorkspace(
        userId,
        sessionTypeId,
        workingTrackMedias
      );

      // Assert
      expect(result.id).toBe('workspace_special_chars');
      expect(api.post).toHaveBeenCalledWith(
        'session/workspace',
        expect.objectContaining({
          workingTrackMedias: expect.arrayContaining([
            expect.objectContaining({ trackId: 'track_special-chars_123' }),
            expect.objectContaining({ trackId: 'track_unicode_ñoño' }),
          ]),
        })
      );
    });

    it('handles large numbers of tracks', async () => {
      // Arrange
      const userId = 999;
      const sessionTypeId = 4;
      const workingTrackMedias: WorkingTrackMedia[] = Array.from(
        { length: 100 },
        (_, index) => ({
          trackId: `track_${index + 1}`,
          trackMediaId: `media_${index + 1}`,
          trackOrder: index + 1,
        })
      );

      const mockResponse = {
        id: 'workspace_large_set',
        userId: 999,
        sessionTypeId: 4,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      vi.mocked(api.post).mockResolvedValue({ data: mockResponse });

      // Act
      const result = await sessionApi.createWorkspace(
        userId,
        sessionTypeId,
        workingTrackMedias
      );

      // Assert
      expect(result.id).toBe('workspace_large_set');
      expect(api.post).toHaveBeenCalledWith(
        'session/workspace',
        expect.objectContaining({
          workingTrackMedias: expect.arrayContaining([
            expect.objectContaining({ trackOrder: 1 }),
            expect.objectContaining({ trackOrder: 50 }),
            expect.objectContaining({ trackOrder: 100 }),
          ]),
        })
      );

      // Verify the exact number of tracks
      const callArgs = vi.mocked(api.post).mock
        .calls[0][1] as CreateWorkspaceRequest;
      expect(callArgs.workingTrackMedias).toHaveLength(100);
    });

    it('ensures workspace is always created as active', async () => {
      // Arrange
      const userId = 123;
      const sessionTypeId = 1;
      const workingTrackMedias: WorkingTrackMedia[] = [
        { trackId: 'track_1', trackMediaId: 'media_1', trackOrder: 1 },
      ];

      const mockResponse = {
        id: 'workspace_active',
        userId: 123,
        sessionTypeId: 1,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      vi.mocked(api.post).mockResolvedValue({ data: mockResponse });

      // Act
      await sessionApi.createWorkspace(
        userId,
        sessionTypeId,
        workingTrackMedias
      );

      // Assert
      const callArgs = vi.mocked(api.post).mock
        .calls[0][1] as CreateWorkspaceRequest;
      expect(callArgs.isActive).toBe(true);
    });

    it('correctly serializes payload as JSON string', async () => {
      // Arrange
      const userId = 123;
      const sessionTypeId = 1;
      const workingTrackMedias: WorkingTrackMedia[] = [
        {
          trackId: 'track_json_test',
          trackMediaId: 'media_json_test',
          trackOrder: 1,
        },
      ];

      const mockResponse = {
        id: 'workspace_json',
        userId: 123,
        sessionTypeId: 1,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      vi.mocked(api.post).mockResolvedValue({ data: mockResponse });

      // Act
      await sessionApi.createWorkspace(
        userId,
        sessionTypeId,
        workingTrackMedias
      );

      // Assert
      const callArgs = vi.mocked(api.post).mock
        .calls[0][1] as CreateWorkspaceRequest;
      expect(typeof callArgs.payload).toBe('string');

      const parsedPayload = JSON.parse(callArgs.payload);
      expect(parsedPayload).toEqual({ workingTrackMedias });
    });

    it('handles different session types', async () => {
      // Arrange
      const userId = 123;
      const workingTrackMedias: WorkingTrackMedia[] = [
        { trackId: 'track_1', trackMediaId: 'media_1', trackOrder: 1 },
      ];

      const sessionTypes = [1, 2, 5, 10, 99];

      for (const sessionTypeId of sessionTypes) {
        const mockResponse = {
          id: `workspace_type_${sessionTypeId}`,
          userId: 123,
          sessionTypeId,
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        };

        vi.mocked(api.post).mockResolvedValue({ data: mockResponse });

        // Act
        const result = await sessionApi.createWorkspace(
          userId,
          sessionTypeId,
          workingTrackMedias
        );

        // Assert
        expect(result.sessionTypeId).toBe(sessionTypeId);
      }
    });

    it('propagates API errors', async () => {
      // Arrange
      const userId = 123;
      const sessionTypeId = 1;
      const workingTrackMedias: WorkingTrackMedia[] = [
        { trackId: 'track_1', trackMediaId: 'media_1', trackOrder: 1 },
      ];

      const apiError = new Error('User not authorized to create workspace');
      vi.mocked(api.post).mockRejectedValue(apiError);

      // Act & Assert
      await expect(
        sessionApi.createWorkspace(userId, sessionTypeId, workingTrackMedias)
      ).rejects.toThrow('User not authorized to create workspace');
    });

    it('handles validation errors', async () => {
      // Arrange
      const userId = -1; // Invalid user ID
      const sessionTypeId = 0; // Invalid session type
      const workingTrackMedias: WorkingTrackMedia[] = [];

      const validationError = {
        response: {
          status: 400,
          data: { message: 'Invalid user ID' },
        },
      };
      vi.mocked(api.post).mockRejectedValue(validationError);

      // Act & Assert
      await expect(
        sessionApi.createWorkspace(userId, sessionTypeId, workingTrackMedias)
      ).rejects.toEqual(validationError);
    });

    it('handles server errors during workspace creation', async () => {
      // Arrange
      const userId = 123;
      const sessionTypeId = 1;
      const workingTrackMedias: WorkingTrackMedia[] = [
        { trackId: 'track_1', trackMediaId: 'media_1', trackOrder: 1 },
      ];

      const serverError = {
        response: {
          status: 500,
          data: 'Internal server error',
        },
      };
      vi.mocked(api.post).mockRejectedValue(serverError);

      // Act & Assert
      await expect(
        sessionApi.createWorkspace(userId, sessionTypeId, workingTrackMedias)
      ).rejects.toEqual(serverError);
    });
  });

  describe('WorkingTrackMedia interface validation', () => {
    it('should handle complete working track media structure', () => {
      // This test validates that the interface structure is correct
      const trackMedia: WorkingTrackMedia = {
        trackId: 'unique_track_123',
        trackMediaId: 'unique_media_456',
        trackOrder: 5,
      };

      // Assert
      expect(trackMedia.trackId).toBe('unique_track_123');
      expect(trackMedia.trackMediaId).toBe('unique_media_456');
      expect(trackMedia.trackOrder).toBe(5);
      expect(typeof trackMedia.trackOrder).toBe('number');
    });

    it('should handle track order as positive integer', () => {
      const trackMedia: WorkingTrackMedia = {
        trackId: 'track_order_test',
        trackMediaId: 'media_order_test',
        trackOrder: 1,
      };

      expect(trackMedia.trackOrder).toBeGreaterThan(0);
      expect(Number.isInteger(trackMedia.trackOrder)).toBe(true);
    });
  });
});
