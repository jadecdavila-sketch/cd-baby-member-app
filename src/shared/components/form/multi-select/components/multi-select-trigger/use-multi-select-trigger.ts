'use client';

import * as React from 'react';

import { useMultiSelectContext } from '../../context';

export const useMultiSelectTrigger = () => {
  const { disabled, isOpen, setIsOpen, instanceId } = useMultiSelectContext();

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;

      switch (e.key) {
        case 'Enter':
        case ' ':
          e.preventDefault();
          setIsOpen(!isOpen);
          break;
        case 'Escape':
          setIsOpen(false);
          break;
      }
    },
    [disabled, isOpen, setIsOpen]
  );

  return {
    disabled,
    isOpen,
    handleKeyDown,
    instanceId,
  };
};
