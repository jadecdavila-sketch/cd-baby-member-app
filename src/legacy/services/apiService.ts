// base api service for all requests

export interface ApiServiceOptions {
  params?: Record<string, string | number | boolean>;
  body?: any;
  headers?: Record<string, string>;
  // Allow other fetch options
  [key: string]: any;
}

export interface ApiError {
  status: number;
  data: any;
}

export enum FetchMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}

export async function apiService<T = unknown>(
  token: string,
  endpoint: string,
  method: FetchMethod = FetchMethod.GET, // default to GET
  options: ApiServiceOptions = {}
): Promise<T> {
  let url = `/api/${endpoint}`;

  // Handle query params if provided
  if (options.params && typeof options.params === 'object') {
    const query = new URLSearchParams(
      Object.entries(options.params).reduce<Record<string, string>>(
        (acc, [k, v]) => {
          acc[k] = String(v);
          return acc;
        },
        {}
      )
    ).toString();
    url += `?${query}`;
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  let body = options.body;
  if (body && typeof body === 'object' && method !== 'GET') {
    body = JSON.stringify(body);
  }

  const config = {
    method,
    headers,
    ...options,
    body: method !== 'GET' ? body : undefined,
  };

  try {
    const response = await fetch(url, config);
    const contentType = response.headers.get('content-type');
    let data: T | string;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    if (!response.ok) {
      throw { status: response.status, data } as ApiError;
    }
    return data as T;
  } catch (error) {
    throw error;
  }
}
