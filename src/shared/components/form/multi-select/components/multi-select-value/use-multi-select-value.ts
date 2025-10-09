'use client';

import React from 'react';

import { useMultiSelectContext } from '../../context';

export const useMultiSelectValue = () => {
  const { selectedOptions, placeholder, removeValue } = useMultiSelectContext();
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const element = contentRef.current;
    if (!element) return;

    const handleWheel = (e: WheelEvent) => {
      // Convert vertical scroll to horizontal scroll
      if (e.deltaY !== 0) {
        e.preventDefault();
        element.scrollLeft += e.deltaY;
      }
    };

    // Add wheel event listener
    element.addEventListener('wheel', handleWheel, { passive: false });

    // Cleanup function to remove event listener
    return () => {
      element.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return {
    selectedOptions,
    placeholder,
    removeValue,
    contentRef,
  };
};
