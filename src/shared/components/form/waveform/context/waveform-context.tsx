'use client';

import * as React from 'react';

import { useWaveform } from '../use-waveform';

/**
 * Context value for Waveform component
 */
export type WaveformContextValue = ReturnType<typeof useWaveform>;

export const WaveformContext = React.createContext<WaveformContextValue | null>(
  null
);

export const useWaveformContext = () => {
  const context = React.useContext(WaveformContext);
  if (!context) {
    throw new Error(
      'Waveform components must be used within a WaveformProvider'
    );
  }
  return context;
};
