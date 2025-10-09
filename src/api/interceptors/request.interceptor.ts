import { AxiosHeaders, InternalAxiosRequestConfig } from 'axios';

/**
 * Request interceptor that automatically adds authentication token to requests
 * @param config - Axios request configuration
 * @returns Modified request configuration with Authorization header
 */
export const requestInterceptor = async (
  config: InternalAxiosRequestConfig
): Promise<InternalAxiosRequestConfig> => {
  const accessToken = await getAccessToken();

  if (accessToken) {
    if (!config.headers) {
      config.headers = {} as AxiosHeaders;
    }
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
};

/**
 * Acquires access token
 * @returns Access token string or undefined if acquisition fails
 */
async function getAccessToken(): Promise<string | undefined> {
  try {
    return 'ACCESS_TOKEN';
  } catch (error) {
    console.error('Token acquisition error:', error);
    return undefined;
  }
}
