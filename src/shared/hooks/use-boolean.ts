import { useCallback, useState } from 'react';

export const useBoolean = (
  initial: boolean
): Readonly<
  [
    value: boolean,
    setTrue: () => void,
    setFalse: () => void,
    setToggle: () => void,
    setValue: (value: boolean) => void,
  ]
> => {
  const [value, setValue] = useState(initial);

  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  const setToggle = useCallback(
    () => setValue((currentValue) => !currentValue),
    []
  );

  return [value, setTrue, setFalse, setToggle, setValue] as const;
};
