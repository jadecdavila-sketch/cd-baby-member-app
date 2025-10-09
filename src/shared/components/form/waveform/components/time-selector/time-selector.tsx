'use client';

import * as React from 'react';

import { cn } from '@/shared/utils';

import { SELECTOR_DURATION } from '../../constants';
import { useWaveformContext } from '../../context/waveform-context';
import { clamp, formatTime } from '../../utils/time-utils';

interface TimeSelectorProps {
  /** Additional CSS classes */
  className?: string;
}

export const TimeSelector = React.memo<TimeSelectorProps>(({ className }) => {
  const {
    duration,
    selectedTime: value,
    setTimeOffset: onChange,
    containerWidth,
    disabled,
  } = useWaveformContext();
  const [isDragging, setIsDragging] = React.useState(false);
  const [announcement, setAnnouncement] = React.useState('');
  const selectorRef = React.useRef<HTMLDivElement>(null);

  // Calculate selector width (represents 30 seconds)
  const selectorWidth = React.useMemo(() => {
    if (duration === 0) return 0;
    return (SELECTOR_DURATION / duration) * containerWidth;
  }, [duration, containerWidth]);

  // Calculate selector position based on value
  const selectorPosition = React.useMemo(() => {
    if (duration === 0) return 0;
    return (value / duration) * containerWidth;
  }, [value, duration, containerWidth]);

  const initialX = React.useRef(0);
  const offsetX = React.useRef(0);
  const deltaX = React.useRef(0);
  const [position, setPosition] = React.useState(selectorPosition);

  // Sync position with controlled value when not dragging
  React.useEffect(() => {
    if (!isDragging) {
      setPosition(selectorPosition);
    }
  }, [isDragging, selectorPosition]);

  // Calculate display time based on current position
  const displayTime = React.useMemo(() => {
    if (isDragging) {
      // During drag, calculate time from position
      return (position / containerWidth) * duration;
    }
    // When not dragging, use the controlled value
    return value;
  }, [isDragging, position, containerWidth, duration, value]);

  // Handle mouse/touch interaction
  const handleInteractionStart = React.useCallback(
    (clientX: number) => {
      if (disabled) return;
      setIsDragging(true);

      const rect = selectorRef.current?.parentElement?.getBoundingClientRect();
      if (!rect) return;

      initialX.current = clientX;
      offsetX.current = position; // Initialize offset with current position
    },
    [disabled, position]
  );

  const handleInteractionMove = React.useCallback(
    (clientX: number) => {
      if (!isDragging || disabled) return;

      const rect = selectorRef.current?.parentElement?.getBoundingClientRect();
      if (!rect) return;

      deltaX.current = clientX - initialX.current;
      initialX.current = clientX;
      offsetX.current += deltaX.current;

      const newPosition = clamp(
        offsetX.current,
        0,
        containerWidth - selectorWidth
      );

      setPosition(newPosition);
    },
    [isDragging, disabled, selectorWidth, containerWidth]
  );

  const handleInteractionEnd = React.useCallback(() => {
    // Calculate final time from position and update immediately
    const finalTime = (position / containerWidth) * duration;
    onChange(finalTime);
    setIsDragging(false);

    // Announce selection change for screen readers
    setAnnouncement(
      `Selected start time: ${formatTime(finalTime)}. Preview window: 30 seconds.`
    );
  }, [onChange, position, containerWidth, duration]);

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleInteractionStart(e.clientX);
  };

  React.useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      handleInteractionMove(e.clientX);
    };

    const handleMouseUp = () => {
      handleInteractionEnd();
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleInteractionMove, handleInteractionEnd]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    let newValue = value;
    const step = e.shiftKey ? 1 : 5; // Shift + arrow = 1 sec, arrow = 5 sec

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        newValue = Math.max(0, value - step);
        break;
      case 'ArrowRight':
        e.preventDefault();
        newValue = Math.min(duration - SELECTOR_DURATION, value + step);
        break;
      case 'Home':
        e.preventDefault();
        newValue = 0;
        break;
      case 'End':
        e.preventDefault();
        newValue = Math.max(0, duration - SELECTOR_DURATION);
        break;
      default:
        return;
    }

    onChange(newValue);

    // Announce keyboard navigation for screen readers
    setAnnouncement(
      `Start time: ${formatTime(newValue)}. Preview duration: 30 seconds.`
    );
  };

  if (containerWidth === 0 || duration === 0) {
    return null;
  }

  return (
    <>
      <div
        ref={selectorRef}
        role="slider"
        aria-label="Time selector for 30-second preview"
        aria-valuemin={0}
        aria-valuemax={Math.max(0, duration - SELECTOR_DURATION)}
        aria-valuenow={value}
        aria-valuetext={`Start time ${formatTime(value)}, preview duration 30 seconds`}
        aria-describedby="time-selector-instructions"
        tabIndex={disabled ? -1 : 0}
        className={cn(
          'focus-visible:ring-primary absolute top-0 bottom-0 w-full cursor-grab',
          isDragging && 'cursor-grabbing',
          disabled && 'cursor-not-allowed opacity-50',
          className
        )}
        style={{
          left: `${position}px`,
          width: `${selectorWidth}px`,
        }}
        onMouseDown={handleMouseDown}
        onKeyDown={handleKeyDown}
      >
        {/* Drag handle */}
        <div className="border-primary absolute inset-0 flex w-full items-center justify-center border-r-2 border-l-2">
          <div
            className="bg-primary h-full w-full opacity-30"
            aria-hidden="true"
          />
        </div>
        <div className="text-muted-foreground absolute top-[100%] text-base font-light">
          {formatTime(displayTime)}
        </div>

        {/* Screen reader instructions (visually hidden) */}
        <span id="time-selector-instructions" className="sr-only">
          Use arrow keys to adjust start time. Left and right arrows move by 5
          seconds. Hold Shift for 1-second increments. Home key moves to start.
          End key moves to end.
        </span>
      </div>

      {/* ARIA live region for screen reader announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>
    </>
  );
});

TimeSelector.displayName = 'TimeSelector';
