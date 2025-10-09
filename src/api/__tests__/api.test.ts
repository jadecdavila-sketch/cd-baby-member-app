import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  afterAll,
} from 'vitest';

import axios from 'axios';

import {
  requestInterceptor,
  responseSuccessInterceptor,
  responseErrorInterceptor,
} from '../interceptors';

import { api } from '../api';

// Mock axios and interceptors before importing
vi.mock('axios', () => ({
  default: {
    interceptors: {
      request: {
        use: vi.fn(),
      },
      response: {
        use: vi.fn(),
      },
    },
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    create: vi.fn().mockReturnThis(),
  },
}));

vi.mock('../interceptors');

const mockedAxios = vi.mocked(axios);

describe('API Class', () => {
  afterAll(() => {
    vi.clearAllMocks();
  });

  describe('api instance', () => {
    it('creates axios instance with correct configuration', async () => {
      expect(mockedAxios.create).toHaveBeenCalledWith({
        withCredentials: true,
        baseURL: '/api',
      });
    });

    it('applies request interceptor', async () => {
      expect(mockedAxios.interceptors.request.use).toHaveBeenCalledWith(
        requestInterceptor
      );
    });

    it('applies response interceptors', async () => {
      expect(mockedAxios.interceptors.response.use).toHaveBeenCalledWith(
        responseSuccessInterceptor,
        responseErrorInterceptor
      );
    });
  });

  describe('HTTP methods', () => {
    beforeEach(() => {
      // Reset call count for clean testing of method calls
      vi.clearAllMocks();
    });

    describe('get method', () => {
      it('calls axios get with correct parameters', async () => {
        // Arrange
        const url = '/test-endpoint';
        const config = { headers: { 'Custom-Header': 'test' } };
        const mockResponse = { data: { id: 1, name: 'test' } };

        vi.mocked(mockedAxios.get).mockResolvedValue(mockResponse);

        // Act
        const result = await api.get(url, config);

        // Assert
        expect(mockedAxios.get).toHaveBeenCalledWith(url, config);
        expect(result).toBe(mockResponse);
      });

      it('calls axios get with default empty config when not provided', async () => {
        // Arrange
        const url = '/test-endpoint';
        const mockResponse = { data: { id: 1 } };

        vi.mocked(mockedAxios.get).mockResolvedValue(mockResponse);

        // Act
        await api.get(url);

        // Assert
        expect(mockedAxios.get).toHaveBeenCalledWith(url, {});
      });

      it('handles TypeScript generics correctly', async () => {
        // Arrange
        interface TestResponse {
          id: number;
          name: string;
        }

        const mockResponse = { data: { id: 1, name: 'test' } };
        vi.mocked(mockedAxios.get).mockResolvedValue(mockResponse);

        // Act
        const result = await api.get<TestResponse>('/test');

        // Assert - TypeScript should infer correct types
        expect(result.data.id).toBe(1);
        expect(result.data.name).toBe('test');
      });
    });

    describe('post method', () => {
      it('calls axios post with correct parameters', async () => {
        // Arrange
        const url = '/test-endpoint';
        const body = { name: 'test', value: 123 };
        const config = { headers: { 'Content-Type': 'application/json' } };
        const mockResponse = { data: { id: 1, ...body } };

        vi.mocked(mockedAxios.post).mockResolvedValue(mockResponse);

        // Act
        const result = await api.post(url, body, config);

        // Assert
        expect(mockedAxios.post).toHaveBeenCalledWith(url, body, config);
        expect(result).toBe(mockResponse);
      });

      it('calls axios post with default empty config when not provided', async () => {
        // Arrange
        const url = '/test-endpoint';
        const body = { name: 'test' };
        const mockResponse = { data: { id: 1 } };

        vi.mocked(mockedAxios.post).mockResolvedValue(mockResponse);

        // Act
        await api.post(url, body);

        // Assert
        expect(mockedAxios.post).toHaveBeenCalledWith(url, body, {});
      });

      it('handles different body types correctly', async () => {
        // Arrange
        const formData = new FormData();
        formData.append('file', 'test-file');
        const mockResponse = { data: { success: true } };

        vi.mocked(mockedAxios.post).mockResolvedValue(mockResponse);

        // Act
        await api.post('/upload', formData);

        // Assert
        expect(mockedAxios.post).toHaveBeenCalledWith('/upload', formData, {});
      });
    });

    describe('put method', () => {
      it('calls axios put with correct parameters', async () => {
        // Arrange
        const url = '/test-endpoint/1';
        const body = { name: 'updated', value: 456 };
        const config = { timeout: 5000 };
        const mockResponse = { data: { id: 1, ...body } };

        vi.mocked(mockedAxios.put).mockResolvedValue(mockResponse);

        // Act
        const result = await api.put(url, body, config);

        // Assert
        expect(mockedAxios.put).toHaveBeenCalledWith(url, body, config);
        expect(result).toBe(mockResponse);
      });

      it('calls axios put with default empty config when not provided', async () => {
        // Arrange
        const url = '/test-endpoint/1';
        const body = { name: 'updated' };

        vi.mocked(mockedAxios.put).mockResolvedValue({ data: { id: 1 } });

        // Act
        await api.put(url, body);

        // Assert
        expect(mockedAxios.put).toHaveBeenCalledWith(url, body, {});
      });
    });

    describe('patch method', () => {
      it('calls axios patch with correct parameters', async () => {
        // Arrange
        const url = '/test-endpoint/1';
        const body = { name: 'patched' };
        const config = { validateStatus: () => true };
        const mockResponse = { data: { id: 1, name: 'patched' } };

        vi.mocked(mockedAxios.patch).mockResolvedValue(mockResponse);

        // Act
        const result = await api.patch(url, body, config);

        // Assert
        expect(mockedAxios.patch).toHaveBeenCalledWith(url, body, config);
        expect(result).toBe(mockResponse);
      });

      it('calls axios patch with default empty config when not provided', async () => {
        // Arrange
        const url = '/test-endpoint/1';
        const body = { status: 'active' };

        vi.mocked(mockedAxios.patch).mockResolvedValue({ data: { id: 1 } });

        // Act
        await api.patch(url, body);

        // Assert
        expect(mockedAxios.patch).toHaveBeenCalledWith(url, body, {});
      });
    });

    describe('delete method', () => {
      it('calls axios delete with correct parameters', async () => {
        // Arrange
        const url = '/test-endpoint/1';
        const config = { data: { reason: 'cleanup' } };
        const mockResponse = { data: { success: true } };

        vi.mocked(mockedAxios.delete).mockResolvedValue(mockResponse);

        // Act
        const result = await api.delete(url, config);

        // Assert
        expect(mockedAxios.delete).toHaveBeenCalledWith(url, config);
        expect(result).toBe(mockResponse);
      });

      it('calls axios delete with default empty config when not provided', async () => {
        // Arrange
        const url = '/test-endpoint/1';

        vi.mocked(mockedAxios.delete).mockResolvedValue({
          data: { success: true },
        });

        // Act
        await api.delete(url);

        // Assert
        expect(mockedAxios.delete).toHaveBeenCalledWith(url, {});
      });
    });
  });

  describe('error handling', () => {
    it('propagates axios errors correctly', async () => {
      // Arrange
      const axiosError = new Error('Network Error');
      vi.mocked(mockedAxios.get).mockRejectedValue(axiosError);

      // Act & Assert
      await expect(api.get('/error-endpoint')).rejects.toThrow('Network Error');
    });

    it('handles different error types for all HTTP methods', async () => {
      // Arrange
      const networkError = new Error('Network Error');

      vi.mocked(mockedAxios.post).mockRejectedValue(networkError);
      vi.mocked(mockedAxios.put).mockRejectedValue(networkError);
      vi.mocked(mockedAxios.patch).mockRejectedValue(networkError);
      vi.mocked(mockedAxios.delete).mockRejectedValue(networkError);

      // Act & Assert
      await expect(api.post('/error', {})).rejects.toThrow('Network Error');
      await expect(api.put('/error', {})).rejects.toThrow('Network Error');
      await expect(api.patch('/error', {})).rejects.toThrow('Network Error');
      await expect(api.delete('/error')).rejects.toThrow('Network Error');
    });
  });

  describe('TypeScript type safety', () => {
    it('maintains correct types for response generics', async () => {
      // Arrange
      interface User {
        id: number;
        name: string;
        email: string;
      }

      const mockUser: User = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
      };

      vi.mocked(mockedAxios.get).mockResolvedValue({ data: mockUser });

      // Act
      const response = await api.get<User>('/user/1');

      // Assert - TypeScript should enforce correct types
      expect(response.data.id).toBe(1);
      expect(response.data.name).toBe('John Doe');
      expect(response.data.email).toBe('john@example.com');
    });

    it('maintains correct types for request body generics', async () => {
      // Arrange
      interface CreateUserRequest {
        name: string;
        email: string;
      }

      interface User extends CreateUserRequest {
        id: number;
      }

      const createRequest: CreateUserRequest = {
        name: 'Jane Doe',
        email: 'jane@example.com',
      };

      const mockResponse: User = {
        id: 2,
        ...createRequest,
      };

      vi.mocked(mockedAxios.post).mockResolvedValue({ data: mockResponse });

      // Act
      const response = await api.post<User, CreateUserRequest>(
        '/users',
        createRequest
      );

      // Assert
      expect(response.data.id).toBe(2);
      expect(response.data.name).toBe('Jane Doe');
      expect(response.data.email).toBe('jane@example.com');
    });
  });
});
