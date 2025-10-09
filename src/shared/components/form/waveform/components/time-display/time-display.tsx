'use client';

import * as React from 'react';

import { useWaveformContext } from '../../context/waveform-context';
import { formatTime } from '../../utils/time-utils';

interface TimeDisplayProps {
  className?: string;
}

export const TimeDisplay = React.memo<TimeDisplayProps>(({ className }) => {
  const { duration } = useWaveformContext();

  return (
    <span
      className={className}
      aria-live="polite"
      aria-label={`Duration: ${formatTime(duration)}`}
    >
      {formatTime(duration)}
    </span>
  );
});

TimeDisplay.displayName = 'TimeDisplay';
