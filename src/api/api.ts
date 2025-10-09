import axios, { AxiosRequestConfig, isAxiosError } from 'axios';

import {
  requestInterceptor,
  responseSuccessInterceptor,
  responseErrorInterceptor,
} from './interceptors';

class API {
  private readonly axiosInstance;

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      withCredentials: true,
      baseURL,
    });

    // Apply request interceptor for authentication
    this.axiosInstance.interceptors.request.use(requestInterceptor);

    // Apply response interceptors for error handling
    this.axiosInstance.interceptors.response.use(
      responseSuccessInterceptor,
      responseErrorInterceptor
    );
  }

  get<Response = unknown>(url: string, config: AxiosRequestConfig<void> = {}) {
    return this.axiosInstance.get<Response>(url, config);
  }

  post<Response = unknown, Body = unknown>(
    url: string,
    body: Body,
    config: AxiosRequestConfig<Body> = {}
  ) {
    return this.axiosInstance.post<Response>(url, body, config);
  }

  put<Response = unknown, Body = unknown>(
    url: string,
    body: Body,
    config: AxiosRequestConfig<Body> = {}
  ) {
    return this.axiosInstance.put<Response>(url, body, config);
  }

  patch<Response = unknown, Body = unknown>(
    url: string,
    body: Body,
    config: AxiosRequestConfig<Body> = {}
  ) {
    return this.axiosInstance.patch<Response>(url, body, config);
  }

  delete<Response = unknown, Body = unknown>(
    url: string,
    config: AxiosRequestConfig<Body> = {}
  ) {
    return this.axiosInstance.delete<Response>(url, config);
  }

  isAxiosError(e: unknown) {
    return isAxiosError(e);
  }
}

// Create a second API instance for external service
const externalServiceBaseURL = process.env.NEXT_PUBLIC_API_SERVICE_URL ?? '';
export const api = new API(`${externalServiceBaseURL}/api`);
