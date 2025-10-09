import { AxiosResponse, AxiosError } from 'axios';
import {
  responseSuccessInterceptor,
  responseErrorInterceptor,
} from '../response.interceptor';

// Mock console methods to avoid noise in test output
const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

describe('Response Interceptors', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('responseSuccessInterceptor', () => {
    it('returns the response unchanged', () => {
      // Arrange
      const mockResponse: AxiosResponse = {
        data: { id: 1, name: 'test' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      // Act
      const result = responseSuccessInterceptor(mockResponse);

      // Assert
      expect(result).toBe(mockResponse);
      expect(result.data).toEqual({ id: 1, name: 'test' });
      expect(result.status).toBe(200);
    });

    it('handles different response types correctly', () => {
      // Test different response scenarios
      const responses = [
        {
          data: { users: [{ id: 1 }, { id: 2 }] },
          status: 200,
          statusText: 'OK',
        },
        {
          data: 'plain text response',
          status: 201,
          statusText: 'Created',
        },
        {
          data: null,
          status: 204,
          statusText: 'No Content',
        },
        {
          data: { success: true },
          status: 202,
          statusText: 'Accepted',
        },
      ];

      responses.forEach((responseData) => {
        const mockResponse: AxiosResponse = {
          ...responseData,
          headers: {},
          config: {} as any,
        };

        const result = responseSuccessInterceptor(mockResponse);
        expect(result).toBe(mockResponse);
      });
    });

    it('preserves all response properties', () => {
      // Arrange
      const mockResponse: AxiosResponse = {
        data: { test: 'data' },
        status: 200,
        statusText: 'OK',
        headers: {
          'content-type': 'application/json',
          'x-custom-header': 'custom-value',
        },
        config: {
          url: '/test-endpoint',
          method: 'get',
        } as any,
      };

      // Act
      const result = responseSuccessInterceptor(mockResponse);

      // Assert
      expect(result.data).toEqual({ test: 'data' });
      expect(result.status).toBe(200);
      expect(result.statusText).toBe('OK');
      expect(result.headers).toEqual({
        'content-type': 'application/json',
        'x-custom-header': 'custom-value',
      });
      expect(result.config).toEqual({
        url: '/test-endpoint',
        method: 'get',
      });
    });
  });

  describe('responseErrorInterceptor', () => {
    it('logs warning and handles auth failure for 401 status', async () => {
      // Arrange
      const mockError: AxiosError = {
        name: 'AxiosError',
        message: 'Request failed with status code 401',
        response: {
          status: 401,
          statusText: 'Unauthorized',
          data: { error: 'Unauthorized' },
          headers: {},
          config: {} as any,
        },
        isAxiosError: true,
        toJSON: () => ({}),
        config: {} as any,
      };

      // Act & Assert
      await expect(responseErrorInterceptor(mockError)).rejects.toBe(mockError);

      // Assert logging
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Authentication failure detected (401), logging out user'
      );
    });

    it('logs warning and handles auth failure for 403 status', async () => {
      // Arrange
      const mockError: AxiosError = {
        name: 'AxiosError',
        message: 'Request failed with status code 403',
        response: {
          status: 403,
          statusText: 'Forbidden',
          data: { error: 'Forbidden' },
          headers: {},
          config: {} as any,
        },
        isAxiosError: true,
        toJSON: () => ({}),
        config: {} as any,
      };

      // Act & Assert
      await expect(responseErrorInterceptor(mockError)).rejects.toBe(mockError);

      // Assert logging
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Authentication failure detected (403), logging out user'
      );
    });

    it('does not handle auth failure for other status codes', async () => {
      // Test different non-auth error status codes
      const statusCodes = [400, 404, 422, 500, 502, 503];

      for (const status of statusCodes) {
        const mockError: AxiosError = {
          name: 'AxiosError',
          message: `Request failed with status code ${status}`,
          response: {
            status,
            statusText: 'Error',
            data: { error: 'Some error' },
            headers: {},
            config: {} as any,
          },
          isAxiosError: true,
          toJSON: () => ({}),
          config: {} as any,
        };

        // Act & Assert
        await expect(responseErrorInterceptor(mockError)).rejects.toBe(
          mockError
        );
      }

      // Assert no auth failure logging occurred
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('handles error without response object', async () => {
      // Arrange
      const mockError: AxiosError = {
        name: 'AxiosError',
        message: 'Network Error',
        response: undefined,
        isAxiosError: true,
        toJSON: () => ({}),
        config: {} as any,
      };

      // Act & Assert
      await expect(responseErrorInterceptor(mockError)).rejects.toBe(mockError);

      // Assert no auth failure logging occurred
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('handles error with response but no status', async () => {
      // Arrange
      const mockError: AxiosError = {
        name: 'AxiosError',
        message: 'Request failed',
        response: {
          status: undefined as any,
          statusText: '',
          data: null,
          headers: {},
          config: {} as any,
        },
        isAxiosError: true,
        toJSON: () => ({}),
        config: {} as any,
      };

      // Act & Assert
      await expect(responseErrorInterceptor(mockError)).rejects.toBe(mockError);

      // Assert no auth failure logging occurred
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('always rejects with the original error', async () => {
      // Test that errors are always rejected regardless of status
      const testCases = [
        { status: 401, shouldTriggerAuth: true },
        { status: 403, shouldTriggerAuth: true },
        { status: 400, shouldTriggerAuth: false },
        { status: 500, shouldTriggerAuth: false },
      ];

      for (const { status } of testCases) {
        const mockError: AxiosError = {
          name: 'AxiosError',
          message: `Request failed with status code ${status}`,
          response: {
            status,
            statusText: 'Error',
            data: { error: 'Error' },
            headers: {},
            config: {} as any,
          },
          isAxiosError: true,
          toJSON: () => ({}),
          config: {} as any,
        };

        // Act & Assert
        await expect(responseErrorInterceptor(mockError)).rejects.toBe(
          mockError
        );
      }
    });

    it('returns a Promise that rejects', () => {
      // Arrange
      const mockError: AxiosError = {
        name: 'AxiosError',
        message: 'Test error',
        response: {
          status: 500,
          statusText: 'Internal Server Error',
          data: null,
          headers: {},
          config: {} as any,
        },
        isAxiosError: true,
        toJSON: () => ({}),
        config: {} as any,
      };

      // Act
      const result = responseErrorInterceptor(mockError);

      // Assert
      expect(result).toBeInstanceOf(Promise);
      expect(result).rejects.toBe(mockError);
    });

    it('handles multiple simultaneous auth failures correctly', async () => {
      // Arrange - Create multiple 401 errors
      const createAuthError = (id: number): AxiosError => ({
        name: 'AxiosError',
        message: `Request ${id} failed with status code 401`,
        response: {
          status: 401,
          statusText: 'Unauthorized',
          data: { error: 'Unauthorized' },
          headers: {},
          config: {} as any,
        },
        isAxiosError: true,
        toJSON: () => ({}),
        config: {} as any,
      });

      const errors = [1, 2, 3].map(createAuthError);

      // Act - Process multiple auth failures simultaneously
      const promises = errors.map((error) =>
        expect(responseErrorInterceptor(error)).rejects.toBe(error)
      );

      await Promise.all(promises);

      // Assert - Should log warning for each failure
      expect(consoleWarnSpy).toHaveBeenCalledTimes(3);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Authentication failure detected (401), logging out user'
      );
    });

    it('preserves error properties and context', async () => {
      // Arrange
      const originalError: AxiosError = {
        name: 'AxiosError',
        message: 'Custom error message',
        response: {
          status: 422,
          statusText: 'Unprocessable Entity',
          data: {
            errors: [
              { field: 'email', message: 'Invalid email format' },
              { field: 'password', message: 'Password too short' },
            ],
          },
          headers: { 'content-type': 'application/json' },
          config: { url: '/api/users', method: 'post' } as any,
        },
        isAxiosError: true,
        toJSON: () => ({}),
        config: { url: '/api/users', method: 'post' } as any,
      };

      // Act & Assert
      try {
        await responseErrorInterceptor(originalError);
      } catch (error) {
        expect(error).toBe(originalError);
        expect(error.message).toBe('Custom error message');
        expect(error.response?.status).toBe(422);
        expect(error.response?.data.errors).toHaveLength(2);
      }
    });
  });
});
