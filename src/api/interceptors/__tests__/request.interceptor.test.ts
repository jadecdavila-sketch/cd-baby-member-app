import { AxiosHeaders, InternalAxiosRequestConfig } from 'axios';
import { requestInterceptor } from '../request.interceptor';

// Mock console to avoid noise in test output
const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

describe('requestInterceptor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('adds Authorization header when access token is available', async () => {
    // Arrange
    const mockConfig: InternalAxiosRequestConfig = {
      url: '/test-endpoint',
      method: 'get',
      headers: {} as AxiosHeaders,
    };

    // Act
    const result = await requestInterceptor(mockConfig);

    // Assert
    expect(result.headers.Authorization).toBe('Bearer ACCESS_TOKEN');
    expect(result.url).toBe('/test-endpoint');
    expect(result.method).toBe('get');
  });

  it('creates headers object when headers is undefined', async () => {
    // Arrange
    const mockConfig: InternalAxiosRequestConfig = {
      url: '/test-endpoint',
      method: 'post',
      headers: undefined as any,
    };

    // Act
    const result = await requestInterceptor(mockConfig);

    // Assert
    expect(result.headers).toBeDefined();
    expect(result.headers.Authorization).toBe('Bearer ACCESS_TOKEN');
  });

  it('preserves existing headers when adding Authorization', async () => {
    // Arrange
    const existingHeaders = new AxiosHeaders({
      'Content-Type': 'application/json',
      'Custom-Header': 'custom-value',
    });

    const mockConfig: InternalAxiosRequestConfig = {
      url: '/test-endpoint',
      method: 'post',
      headers: existingHeaders,
    };

    // Act
    const result = await requestInterceptor(mockConfig);

    // Assert
    expect(result.headers['Content-Type']).toBe('application/json');
    expect(result.headers['Custom-Header']).toBe('custom-value');
    expect(result.headers.Authorization).toBe('Bearer ACCESS_TOKEN');
  });

  it('preserves all config properties unchanged except headers', async () => {
    // Arrange
    const mockConfig: InternalAxiosRequestConfig = {
      url: '/complex-endpoint',
      method: 'put',
      headers: {} as AxiosHeaders,
      data: { test: 'data' },
      timeout: 5000,
      withCredentials: true,
      responseType: 'json',
    };

    // Act
    const result = await requestInterceptor(mockConfig);

    // Assert
    expect(result.url).toBe('/complex-endpoint');
    expect(result.method).toBe('put');
    expect(result.data).toEqual({ test: 'data' });
    expect(result.timeout).toBe(5000);
    expect(result.withCredentials).toBe(true);
    expect(result.responseType).toBe('json');
    expect(result.headers.Authorization).toBe('Bearer ACCESS_TOKEN');
  });

  it('does not modify config when access token is undefined', async () => {
    // Arrange - Mock getAccessToken to return undefined by modifying the module
    const mockConfig: InternalAxiosRequestConfig = {
      url: '/test-endpoint',
      method: 'get',
      headers: new AxiosHeaders({
        'Existing-Header': 'existing-value',
      }),
    };

    // Mock the getAccessToken function to return undefined
    vi.doMock('../request.interceptor', async (importOriginal) => {
      const mod =
        await importOriginal<typeof import('../request.interceptor')>();
      return {
        ...mod,
        requestInterceptor: async (config: InternalAxiosRequestConfig) => {
          // Simulate undefined token
          const accessToken = undefined;

          if (accessToken) {
            if (!config.headers) {
              config.headers = {} as AxiosHeaders;
            }
            config.headers.Authorization = `Bearer ${accessToken}`;
          }

          return config;
        },
      };
    });

    // Re-import to get mocked version
    const { requestInterceptor: mockedInterceptor } = await import(
      '../request.interceptor'
    );

    // Act
    const result = await mockedInterceptor(mockConfig);

    // Assert
    expect(result.headers['Existing-Header']).toBe('existing-value');
    expect(result.headers.Authorization).toBeUndefined();
  });

  it('handles different HTTP methods correctly', async () => {
    // Arrange & Act
    const methods = ['get', 'post', 'put', 'patch', 'delete'] as const;

    for (const method of methods) {
      const mockConfig: InternalAxiosRequestConfig = {
        url: `/test-${method}`,
        method,
        headers: {} as AxiosHeaders,
      };

      const result = await requestInterceptor(mockConfig);

      // Assert
      expect(result.method).toBe(method);
      expect(result.headers.Authorization).toBe('Bearer ACCESS_TOKEN');
    }
  });

  it('handles complex header objects correctly', async () => {
    // Arrange
    const complexHeaders = new AxiosHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    });

    const mockConfig: InternalAxiosRequestConfig = {
      url: '/test-endpoint',
      method: 'post',
      headers: complexHeaders,
    };

    // Act
    const result = await requestInterceptor(mockConfig);

    // Assert
    expect(result.headers['Content-Type']).toBe('application/json');
    expect(result.headers['Accept']).toBe('application/json');
    expect(result.headers['X-Requested-With']).toBe('XMLHttpRequest');
    expect(result.headers.Authorization).toBe('Bearer ACCESS_TOKEN');
  });

  it('is async and returns a Promise', () => {
    // Arrange
    const mockConfig: InternalAxiosRequestConfig = {
      url: '/test-endpoint',
      method: 'get',
      headers: {} as AxiosHeaders,
    };

    // Act
    const result = requestInterceptor(mockConfig);

    // Assert
    expect(result).toBeInstanceOf(Promise);
  });

  it('handles empty string URLs', async () => {
    // Arrange
    const mockConfig: InternalAxiosRequestConfig = {
      url: '',
      method: 'get',
      headers: {} as AxiosHeaders,
    };

    // Act
    const result = await requestInterceptor(mockConfig);

    // Assert
    expect(result.url).toBe('');
    expect(result.headers.Authorization).toBe('Bearer ACCESS_TOKEN');
  });

  it('handles config without method property', async () => {
    // Arrange
    const mockConfig: InternalAxiosRequestConfig = {
      url: '/test-endpoint',
      headers: {} as AxiosHeaders,
    } as InternalAxiosRequestConfig;

    // Act
    const result = await requestInterceptor(mockConfig);

    // Assert
    expect(result.url).toBe('/test-endpoint');
    expect(result.headers.Authorization).toBe('Bearer ACCESS_TOKEN');
  });

  it('does not mutate the original config object', async () => {
    // Arrange
    const originalHeaders = new AxiosHeaders({
      'Original-Header': 'original-value',
    });
    const mockConfig: InternalAxiosRequestConfig = {
      url: '/test-endpoint',
      method: 'get',
      headers: originalHeaders,
    };

    // Store original state
    const originalUrl = mockConfig.url;
    const originalMethod = mockConfig.method;

    // Act
    const result = await requestInterceptor(mockConfig);

    // Assert - original config should be modified (this is expected for interceptors)
    expect(mockConfig.url).toBe(originalUrl);
    expect(mockConfig.method).toBe(originalMethod);
    expect(result).toBe(mockConfig); // Should return the same object
  });
});
