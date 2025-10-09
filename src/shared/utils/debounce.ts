export const debounce = <T>(func: (value: T) => void, wait = 500) => {
  let timeout: number | null;

  return function executedFunction(value: T) {
    const later = () => {
      timeout = null;
      func(value);
    };

    window.clearTimeout(timeout as number);
    timeout = window.setTimeout(later, wait);
  };
};
