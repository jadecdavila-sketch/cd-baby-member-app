import { renderHook, act, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useExampleForm } from '../use-example-form';

// Mock the sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('useExampleForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with correct default values', () => {
    const { result } = renderHook(() => useExampleForm());
    
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.submitCount).toBe(0);
    expect(result.current.newsletter).toBe(false);
  });

  it('updates newsletter state when watched field changes', () => {
    const { result } = renderHook(() => useExampleForm());
    
    act(() => {
      result.current.form.setValue('newsletter', true);
    });
    
    expect(result.current.newsletter).toBe(true);
  });

  it('calls onSuccess callback when form submission succeeds', async () => {
    const mockOnSuccess = vi.fn();
    const { result } = renderHook(() => useExampleForm({ onSuccess: mockOnSuccess }));
    
    // Set valid form data
    act(() => {
      result.current.form.setValue('name', 'John Doe');
      result.current.form.setValue('email', 'john@example.com');
      result.current.form.setValue('phone', '+1234567890');
      result.current.form.setValue('age', 25);
      result.current.form.setValue('country', 'us');
    });
    
    await act(async () => {
      await result.current.onSubmit();
    });
    
    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
      expect(result.current.submitCount).toBe(1);
    }, { timeout: 2000 });
  });

  it('resets form when resetForm is called', () => {
    const { result } = renderHook(() => useExampleForm());
    
    // Set some values
    act(() => {
      result.current.form.setValue('name', 'John Doe');
      result.current.form.setValue('email', 'john@example.com');
    });
    
    // Reset the form
    act(() => {
      result.current.resetForm();
    });
    
    expect(result.current.form.getValues().name).toBe('');
    expect(result.current.form.getValues().email).toBe('');
    expect(result.current.submitCount).toBe(0);
  });

  it('handles form submission errors', async () => {
    const mockOnError = vi.fn();
    const { result } = renderHook(() => useExampleForm({ onError: mockOnError }));
    
    // Mock console.error to avoid test output
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Set invalid data to trigger validation error
    act(() => {
      result.current.form.setValue('name', '');
      result.current.form.setValue('email', 'invalid-email');
    });
    
    await act(async () => {
      await result.current.onSubmit();
    });
    
    // Since validation will prevent submission, onError shouldn't be called
    expect(mockOnError).not.toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });
});
