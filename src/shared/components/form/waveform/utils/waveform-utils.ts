/**
 * Waveform data calculation utilities
 */

/**
 * Calculate RMS (Root Mean Square) amplitude for a slice of audio samples
 * RMS provides a better representation of perceived loudness than peak values
 */

const calculateRMS = (
  samples: Float32Array,
  start: number,
  end: number
): number => {
  let sumOfSquares = 0;
  for (let i = start; i < end; i++) {
    // @ts-expect-error - ts thinks samples[i] may be undefined
    sumOfSquares += samples[i] * samples[i];
  }
  return Math.sqrt(sumOfSquares / (end - start || 1));
};

// export const calculateRMS = (samples: Float32Array): number => {
//   if (samples.length === 0) return 0;

//   let sumSquares = 0;
//   for (let i = 0; i < samples.length; i++) {
//     sumSquares += samples[i]! * samples[i]!;
//   }

//   return Math.sqrt(sumSquares / samples.length);
// };

/**
 * Calculate peak amplitude for a slice of audio samples
 */
// export const calculatePeak = (samples: Float32Array): number => {
//   if (samples.length === 0) return 0;

//   let peak = 0;
//   for (let i = 0; i < samples.length; i++) {
//     const abs = Math.abs(samples[i]!);
//     if (abs > peak) {
//       peak = abs;
//     }
//   }

//   return peak;
// };

const calculatePeak = (
  samples: Float32Array,
  start: number,
  end: number
): number => {
  let max = 0;
  for (let i = start; i < end; i++) {
    // @ts-expect-error - ts thinks samples[i] may be undefined
    max = Math.max(max, Math.abs(samples[i]));
  }
  return max;
};

/**
 * Calculate waveform data from raw audio samples
 * Downsamples the audio to a fixed number of bars for visualization
 */
export interface WaveformOptions {
  /** Number of bars to generate */
  barCount?: number;
  /** Method to calculate amplitude: 'rms' or 'peak' */
  method?: 'rms' | 'peak';
  /** Normalize values to 0-1 range */
  normalize?: boolean;
  /** Minimum amplitude threshold (prevents completely silent bars) */
  minAmplitude?: number;
}

const DEFAULT_OPTIONS: Required<WaveformOptions> = {
  barCount: 100,
  method: 'rms',
  normalize: true,
  minAmplitude: 0.02,
};

/**
 * Calculates waveform data from audio channel data for visualization.
 * @param channelData - Float32Array of audio samples from Web Audio API (expected range: [-1, 1]).
 * @param options - Configuration options for waveform generation.
 * @returns An array of amplitude values (optionally normalized) for each bar.
 */
export const calculateWaveformData = (
  channelData: Float32Array,
  options: WaveformOptions = {}
): number[] => {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const { barCount, method, normalize, minAmplitude } = opts;

  if (channelData.length === 0) {
    return Array(barCount).fill(minAmplitude);
  }

  const samplesPerBar = Math.floor(channelData.length / barCount);
  const waveformData: number[] = [];
  const calculateAmplitude = method === 'rms' ? calculateRMS : calculatePeak;
  let maxAmplitude = 0;

  // Calculate amplitudes and track maximum
  for (let i = 0; i < barCount; i++) {
    const start = i * samplesPerBar;
    const end = Math.min(start + samplesPerBar, channelData.length);
    const amplitude = calculateAmplitude(channelData, start, end);
    waveformData.push(amplitude);
    maxAmplitude = Math.max(maxAmplitude, amplitude);
  }

  // Normalize and apply minimum amplitude in one pass
  if (normalize && maxAmplitude > 0) {
    for (let i = 0; i < waveformData.length; i++) {
      // @ts-expect-error - ts thinks waveformData[i] may be undefined
      waveformData[i] = Math.max(waveformData[i] / maxAmplitude, minAmplitude);
    }
  } else if (normalize && maxAmplitude === 0) {
    for (let i = 0; i < waveformData.length; i++) {
      waveformData[i] = minAmplitude;
    }
  }

  return waveformData;
};
// export const calculateWaveformData = (
//   channelData: Float32Array,
//   options: WaveformOptions = {}
// ): number[] => {
//   const opts = { ...DEFAULT_OPTIONS, ...options };
//   const { barCount, method, normalize, minAmplitude } = opts;

//   if (channelData.length === 0) {
//     return Array(barCount).fill(minAmplitude);
//   }

//   const samplesPerBar = Math.floor(channelData.length / barCount);
//   const waveformData: number[] = [];
//   const calculateAmplitude = method === 'rms' ? calculateRMS : calculatePeak;

//   // Calculate amplitude for each bar
//   for (let i = 0; i < barCount; i++) {
//     const start = i * samplesPerBar;
//     const end = Math.min(start + samplesPerBar, channelData.length);
//     const slice = channelData.slice(start, end);

//     const amplitude = calculateAmplitude(slice);
//     waveformData.push(amplitude);
//   }

//   // Normalize if requested
//   if (normalize) {
//     const maxAmplitude = Math.max(...waveformData);
//     if (maxAmplitude > 0) {
//       for (let i = 0; i < waveformData.length; i++) {
//         // Normalize to 0-1 range and apply minimum threshold
//         waveformData[i] = Math.max(
//           waveformData[i]! / maxAmplitude,
//           minAmplitude
//         );
//       }
//     }
//   }

//   // Apply minimum amplitude to prevent invisible bars
//   for (let i = 0; i < waveformData.length; i++) {
//     waveformData[i] = Math.max(waveformData[i]!, minAmplitude);
//   }

//   return waveformData;
// };

/**
 * Generate placeholder waveform data for testing
 */
export const generatePlaceholderWaveform = (
  barCount: number = 100
): number[] => {
  return Array.from({ length: barCount }, () => Math.random() * 0.8 + 0.2);
};

/**
 * Smooth waveform data using a simple moving average
 * This can help reduce visual noise in the waveform
 */
export const smoothWaveform = (
  data: number[],
  windowSize: number = 3
): number[] => {
  if (windowSize <= 1 || data.length === 0) return data;

  const smoothed: number[] = [];
  const halfWindow = Math.floor(windowSize / 2);

  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - halfWindow);
    const end = Math.min(data.length, i + halfWindow + 1);
    const slice = data.slice(start, end);

    const average = slice.reduce((sum, val) => sum + val, 0) / slice.length;
    smoothed.push(average);
  }

  return smoothed;
};
