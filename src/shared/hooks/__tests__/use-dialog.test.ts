import { renderHook, act } from '@testing-library/react';
import { useDialog } from '../use-dialog';
import { useBoolean } from '../use-boolean';

// Mock the useBoolean hook
vi.mock('../use-boolean');

describe('useDialog hook', () => {
  let mockUseBoolean: ReturnType<typeof useBoolean>;

  beforeEach(() => {
    mockUseBoolean = [
      false, // value
      vi.fn(), // setTrue
      vi.fn(), // setFalse
      vi.fn(), // setToggle
      vi.fn(), // setValue
    ];

    vi.mocked(useBoolean).mockReturnValue(mockUseBoolean);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with default closed state when no initial value provided', () => {
    const { result } = renderHook(() => useDialog());

    expect(useBoolean).toHaveBeenCalledWith(false);
    expect(result.current.isOpen).toBe(false);
  });

  it('initializes with provided initial value (true)', () => {
    renderHook(() => useDialog(true));

    expect(useBoolean).toHaveBeenCalledWith(true);
  });

  it('initializes with provided initial value (false)', () => {
    renderHook(() => useDialog(false));

    expect(useBoolean).toHaveBeenCalledWith(false);
  });

  it('returns correct interface structure', () => {
    const { result } = renderHook(() => useDialog());

    expect(result.current).toHaveProperty('isOpen');
    expect(result.current).toHaveProperty('open');
    expect(result.current).toHaveProperty('close');
    expect(result.current).toHaveProperty('toggle');
    expect(result.current).toHaveProperty('setIsOpen');
    expect(result.current).toHaveProperty('onOpenChange');

    expect(typeof result.current.isOpen).toBe('boolean');
    expect(typeof result.current.open).toBe('function');
    expect(typeof result.current.close).toBe('function');
    expect(typeof result.current.toggle).toBe('function');
    expect(typeof result.current.setIsOpen).toBe('function');
    expect(typeof result.current.onOpenChange).toBe('function');
  });

  it('open function calls setTrue from useBoolean', () => {
    const { result } = renderHook(() => useDialog());

    act(() => {
      result.current.open();
    });

    expect(mockUseBoolean[1]).toHaveBeenCalledTimes(1); // setTrue
  });

  it('close function calls setFalse from useBoolean', () => {
    const { result } = renderHook(() => useDialog());

    act(() => {
      result.current.close();
    });

    expect(mockUseBoolean[2]).toHaveBeenCalledTimes(1); // setFalse
  });

  it('toggle function calls setToggle from useBoolean', () => {
    const { result } = renderHook(() => useDialog());

    act(() => {
      result.current.toggle();
    });

    expect(mockUseBoolean[3]).toHaveBeenCalledTimes(1); // setToggle
  });

  it('setIsOpen function calls setValue from useBoolean', () => {
    const { result } = renderHook(() => useDialog());

    act(() => {
      result.current.setIsOpen(true);
    });

    expect(mockUseBoolean[4]).toHaveBeenCalledWith(true); // setValue
  });

  it('onOpenChange function calls setValue from useBoolean', () => {
    const { result } = renderHook(() => useDialog());

    act(() => {
      result.current.onOpenChange(false);
    });

    expect(mockUseBoolean[4]).toHaveBeenCalledWith(false); // setValue
  });

  it('setIsOpen and onOpenChange are the same function reference', () => {
    const { result } = renderHook(() => useDialog());

    expect(result.current.setIsOpen).toBe(result.current.onOpenChange);
  });

  it('reflects the current isOpen state from useBoolean', () => {
    vi.mocked(useBoolean).mockReturnValue([
      true, // value (isOpen)
      vi.fn(), // setTrue
      vi.fn(), // setFalse
      vi.fn(), // setToggle
      vi.fn(), // setValue
    ]);

    const { result } = renderHook(() => useDialog());

    expect(result.current.isOpen).toBe(true);
  });

  it('handles multiple operations correctly', () => {
    const { result } = renderHook(() => useDialog());

    act(() => {
      result.current.open();
      result.current.toggle();
      result.current.setIsOpen(true);
      result.current.close();
      result.current.onOpenChange(false);
    });

    expect(mockUseBoolean[1]).toHaveBeenCalledTimes(1); // setTrue (open)
    expect(mockUseBoolean[2]).toHaveBeenCalledTimes(1); // setFalse (close)
    expect(mockUseBoolean[3]).toHaveBeenCalledTimes(1); // setToggle (toggle)
    expect(mockUseBoolean[4]).toHaveBeenCalledTimes(2); // setValue (setIsOpen + onOpenChange)
    expect(mockUseBoolean[4]).toHaveBeenNthCalledWith(1, true);
    expect(mockUseBoolean[4]).toHaveBeenNthCalledWith(2, false);
  });

  it('returns stable function references on re-renders', () => {
    const { result, rerender } = renderHook(() => useDialog());
    const initialFunctions = {
      open: result.current.open,
      close: result.current.close,
      toggle: result.current.toggle,
      setIsOpen: result.current.setIsOpen,
      onOpenChange: result.current.onOpenChange,
    };

    rerender();

    expect(result.current.open).toBe(initialFunctions.open);
    expect(result.current.close).toBe(initialFunctions.close);
    expect(result.current.toggle).toBe(initialFunctions.toggle);
    expect(result.current.setIsOpen).toBe(initialFunctions.setIsOpen);
    expect(result.current.onOpenChange).toBe(initialFunctions.onOpenChange);
  });
});
