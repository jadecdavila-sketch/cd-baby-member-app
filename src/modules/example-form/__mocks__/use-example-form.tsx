import { vi } from 'vitest';

export const useExampleForm = vi.fn(() => ({
  form: {
    control: {},
    handleSubmit: vi.fn((fn) => fn),
    reset: vi.fn(),
    getValues: vi.fn(() => ({})),
    setValue: vi.fn(),
    watch: vi.fn(() => false),
  },
  onSubmit: vi.fn(),
  isSubmitting: false,
  submitCount: 0,
  resetForm: vi.fn(),
  newsletter: false,
}));
