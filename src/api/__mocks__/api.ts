import { isAxiosError } from 'axios';

export const api = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
  isAxiosError: vi.fn().mockImplementation((e: unknown) => isAxiosError(e)),
};
