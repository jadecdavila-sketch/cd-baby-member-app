// this is for example purposes

import { apiService, FetchMethod } from './apiService';

export async function getSearchResults(
  token: string,
  query: string
): Promise<unknown> {
  const response = await apiService(token, 'search', FetchMethod.GET, {
    params: { query },
  });
  return response;
}
