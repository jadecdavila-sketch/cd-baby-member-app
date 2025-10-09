import { cn } from '../cn';

describe('cn utility function', () => {
  it('merges class names correctly', () => {
    const result = cn('px-4 py-2', 'bg-blue-500', 'text-white');
    expect(result).toBe('px-4 py-2 bg-blue-500 text-white');
  });

  it('handles conditional classes', () => {
    const result = cn(
      'base-class',
      true && 'conditional-class',
      false && 'hidden-class'
    );
    expect(result).toBe('base-class conditional-class');
  });

  it('merges conflicting tailwind classes correctly', () => {
    const result = cn('px-2 px-4', 'py-1 py-2');
    expect(result).toBe('px-4 py-2');
  });

  it('handles empty and undefined values', () => {
    const result = cn('valid-class', '', undefined, null, 'another-class');
    expect(result).toBe('valid-class another-class');
  });

  it('handles arrays of classes', () => {
    const result = cn(['class1', 'class2'], 'class3');
    expect(result).toBe('class1 class2 class3');
  });

  it('handles objects with boolean values', () => {
    const result = cn({
      active: true,
      disabled: false,
      primary: true,
    });
    expect(result).toBe('active primary');
  });

  it('combines all input types', () => {
    const result = cn(
      'base',
      ['array1', 'array2'],
      { active: true, disabled: false },
      true && 'conditional',
      'final'
    );
    expect(result).toBe('base array1 array2 active conditional final');
  });
});
