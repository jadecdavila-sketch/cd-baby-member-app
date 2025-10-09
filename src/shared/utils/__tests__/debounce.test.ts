import { debounce } from '../debounce';

describe('debounce utility', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it('calls function after specified delay', () => {
    // Arrange
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 500);

    // Act
    debouncedFn('test');

    // Assert - function not called immediately
    expect(mockFn).not.toHaveBeenCalled();

    // Fast-forward time
    vi.advanceTimersByTime(500);

    // Assert - function called after delay
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('test');
  });

  it('uses default delay of 500ms when not specified', () => {
    // Arrange
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn);

    // Act
    debouncedFn('test');

    // Assert - not called before default delay
    vi.advanceTimersByTime(499);
    expect(mockFn).not.toHaveBeenCalled();

    // Assert - called after default delay
    vi.advanceTimersByTime(1);
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('test');
  });

  it('cancels previous timeout when called multiple times', () => {
    // Arrange
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 500);

    // Act - call multiple times rapidly
    debouncedFn('first');
    vi.advanceTimersByTime(100);
    debouncedFn('second');
    vi.advanceTimersByTime(100);
    debouncedFn('third');

    // Assert - no calls yet
    expect(mockFn).not.toHaveBeenCalled();

    // Fast-forward full delay from last call
    vi.advanceTimersByTime(500);

    // Assert - only last call executed
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('third');
  });

  it('handles rapid successive calls correctly', () => {
    // Arrange
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 100);

    // Act - 10 rapid calls
    for (let i = 0; i < 10; i++) {
      debouncedFn(`call-${i}`);
      vi.advanceTimersByTime(10);
    }

    // Assert - no calls yet
    expect(mockFn).not.toHaveBeenCalled();

    // Fast-forward remaining delay
    vi.advanceTimersByTime(100);

    // Assert - only last call executed
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('call-9');
  });

  it('works with different value types', () => {
    // Arrange
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 100);

    // Act & Assert - string
    debouncedFn('string-value');
    vi.advanceTimersByTime(100);
    expect(mockFn).toHaveBeenCalledWith('string-value');

    // Reset and test number
    mockFn.mockClear();
    debouncedFn(42);
    vi.advanceTimersByTime(100);
    expect(mockFn).toHaveBeenCalledWith(42);

    // Reset and test object
    mockFn.mockClear();
    const testObj = { id: 1, name: 'test' };
    debouncedFn(testObj);
    vi.advanceTimersByTime(100);
    expect(mockFn).toHaveBeenCalledWith(testObj);

    // Reset and test array
    mockFn.mockClear();
    const testArray = [1, 2, 3];
    debouncedFn(testArray);
    vi.advanceTimersByTime(100);
    expect(mockFn).toHaveBeenCalledWith(testArray);
  });

  it('handles zero delay', () => {
    // Arrange
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 0);

    // Act
    debouncedFn('immediate');

    // Assert - still uses timeout even with 0 delay
    expect(mockFn).not.toHaveBeenCalled();

    // Fast-forward minimal time
    vi.advanceTimersByTime(0);

    // Assert - function called
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('immediate');
  });

  it('handles very long delays', () => {
    // Arrange
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 10000); // 10 seconds

    // Act
    debouncedFn('long-delay');

    // Assert - not called before delay
    vi.advanceTimersByTime(9999);
    expect(mockFn).not.toHaveBeenCalled();

    // Assert - called after full delay
    vi.advanceTimersByTime(1);
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('long-delay');
  });

  it('creates separate timeouts for different debounced functions', () => {
    // Arrange
    const mockFn1 = vi.fn();
    const mockFn2 = vi.fn();
    const debouncedFn1 = debounce(mockFn1, 100);
    const debouncedFn2 = debounce(mockFn2, 200);

    // Act
    debouncedFn1('first');
    debouncedFn2('second');

    // Assert - neither called initially
    expect(mockFn1).not.toHaveBeenCalled();
    expect(mockFn2).not.toHaveBeenCalled();

    // Fast-forward to first timeout
    vi.advanceTimersByTime(100);
    expect(mockFn1).toHaveBeenCalledWith('first');
    expect(mockFn2).not.toHaveBeenCalled();

    // Fast-forward to second timeout
    vi.advanceTimersByTime(100);
    expect(mockFn2).toHaveBeenCalledWith('second');
  });

  it('properly clears timeout when called again', () => {
    // Arrange
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 1000);

    // Act - first call
    debouncedFn('first');

    // Advance partway through delay
    vi.advanceTimersByTime(500);

    // Second call should cancel first
    debouncedFn('second');

    // Advance past original timeout
    vi.advanceTimersByTime(600);
    expect(mockFn).not.toHaveBeenCalled();

    // Advance to complete second timeout
    vi.advanceTimersByTime(400);
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('second');
  });

  it('handles function that throws error', () => {
    // Arrange
    const mockFn = vi.fn().mockImplementation(() => {
      throw new Error('Test error');
    });
    const debouncedFn = debounce(mockFn, 100);

    // Act
    debouncedFn('error-test');

    // Assert - should not prevent execution
    expect(() => {
      vi.advanceTimersByTime(100);
    }).toThrow('Test error');

    expect(mockFn).toHaveBeenCalledWith('error-test');
  });
});
