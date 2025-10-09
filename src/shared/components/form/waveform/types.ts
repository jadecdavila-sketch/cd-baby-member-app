/**
 * Props for the base Waveform component
 */
export interface WaveformProps {
  /** The audio file to visualize */
  audioFile: File;
  /** Current time offset in seconds (controlled value) */
  value?: number;
  /** Callback when time offset changes */
  onChange?: (value: number) => void;
  /** Unique identifier for the component */
  id: string;
  /** Label for the waveform selector */
  label: string;
  /** Whether the field is required */
  required?: boolean;
  /** Error message to display */
  error?: string;
  /** Helper text to display below the component */
  helperText?: string;
  /** Whether the component is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * State for audio player
 */
export interface AudioPlayerState {
  /** Whether audio is currently playing */
  isPlaying: boolean;
  /** Current playback time in seconds */
  currentTime: number;
  /** Total duration of audio in seconds */
  duration: number;
  /** Whether audio is loading */
  isLoading: boolean;
  /** Error message if audio fails to load */
  error: string | null;
}

/**
 * Waveform data point
 */
export interface WaveformData {
  /** Array of amplitude values (normalized 0-1) */
  data: number[];
  /** Sample rate used for visualization */
  sampleRate: number;
  /** Whether data is still loading */
  isLoading: boolean;
  /** Error message if waveform generation fails */
  error: string | null;
}

/**
 * Time selector state
 */
export interface TimeSelectorState {
  /** Position of selector in pixels */
  position: number;
  /** Width of selector in pixels (represents 30 seconds) */
  width: number;
  /** Whether user is currently dragging the selector */
  isDragging: boolean;
}

/**
 * Canvas rendering options
 */
export interface WaveformCanvasOptions {
  /** Canvas width in pixels */
  // width: number;
  /** Canvas height in pixels */
  height: number;
  /** Color of waveform bars */
  waveformColor: string;
  /** Color of progress/playback indicator */
  // progressColor: string;
  /** Color of selector overlay */
  // selectorColor: string;
  /** Number of bars to render */
  // barCount: number;
  /** Gap between bars in pixels */
  barGap: number;
  /** Bar width in pixels */
  barWidth: number;
}
