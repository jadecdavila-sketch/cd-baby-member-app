import axios from 'axios';

import type {
  ExampleCharacter,
  ExampleCharactersList,
} from '@/shared/types/example';

const FUTURAMA_API_BASE_URL = 'https://api.sampleapis.com/futurama';

// Create a dedicated axios instance for external Futurama API
const exampleApiClient = axios.create({
  baseURL: FUTURAMA_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// TanStack Query keys for consistent caching
export const exampleQueryKeys = {
  all: ['example-characters'] as const,
  lists: () => [...exampleQueryKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown> = {}) =>
    [...exampleQueryKeys.lists(), { filters }] as const,
  details: () => [...exampleQueryKeys.all, 'detail'] as const,
  detail: (id: number) => [...exampleQueryKeys.details(), id] as const,
};

export const exampleApi = {
  getCharacters: async (): Promise<ExampleCharactersList> => {
    try {
      const response =
        await exampleApiClient.get<ExampleCharactersList>('/characters');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `Failed to fetch characters: ${error.response?.status} ${error.response?.statusText ?? error.message}`
        );
      }
      throw new Error('Failed to fetch characters: Unknown error');
    }
  },

  getCharacter: async (id: number): Promise<ExampleCharacter> => {
    try {
      const response = await exampleApiClient.get<ExampleCharacter>(
        `/characters/${id}`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `Failed to fetch character ${id}: ${error.response?.status} ${error.response?.statusText ?? error.message}`
        );
      }
      throw new Error(`Failed to fetch character ${id}: Unknown error`);
    }
  },
};
