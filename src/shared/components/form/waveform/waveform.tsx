'use client';

import { HelpCircle, Pause, Play } from 'lucide-react';
import * as React from 'react';

import { Label } from '@/shared/components/shadcn/label';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/components/shadcn/tooltip';
import { cn } from '@/shared/utils/index';

import { TimeDisplay } from './components/time-display';
import { useWaveformContext } from './context/waveform-context';
import { WaveformProvider } from './context/waveform-provider';
import { validateAudioFile } from './utils/audio-utils';
import { WaveformCanvas } from './components/waveform-canvas';
import { TimeSelector } from './components/time-selector';

interface WaveformPropsBase {
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

interface WaveformPropsWithTooltip extends WaveformPropsBase {
  tooltip: string;
  tooltipId: string;
}

interface WaveformPropsWithoutTooltip extends WaveformPropsBase {
  tooltip?: undefined;
  tooltipId?: undefined;
}

export type WaveformProps =
  | WaveformPropsWithTooltip
  | WaveformPropsWithoutTooltip;

// Inner component that uses the context
const WaveformContent: React.FC<{
  id: string;
  error?: string | undefined;
  helperText?: string | undefined;
}> = ({ id, error, helperText }) => {
  const { isPlaying, togglePlay, disabled, isLoading, loadError, audioRef } =
    useWaveformContext();

  return (
    <>
      {/* Hidden HTML5 audio element for playback */}
      <audio ref={audioRef} className="hidden" />

      {/* Main waveform controls */}
      <div className="flex items-center gap-4">
        {/* Play/Pause button - minimum 44x44px touch target for accessibility */}
        <div>
          <button
            id="waveform-play-pause"
            type="button"
            onClick={togglePlay}
            disabled={disabled || isLoading || !!loadError}
            className="bg-primary focus-visible:ring-primary hover:bg-primary/90 disabled:hover:bg-primary flex h-11 w-11 items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:opacity-50"
            aria-label={
              isPlaying ? 'Pause audio preview' : 'Play audio preview'
            }
            aria-pressed={isPlaying}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Play className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Waveform visualization with selector */}
        <div className="relative flex-1">
          <WaveformCanvas />
          {!isLoading && !loadError && <TimeSelector />}
        </div>

        {/* Time display */}
        <TimeDisplay className="text-muted-foreground text-right text-sm" />
      </div>

      {/* Loading state */}
      {isLoading && (
        <p className="text-muted-foreground text-sm">Loading audio file...</p>
      )}

      {/* Error state */}
      {(error ?? loadError) && (
        <p
          id={`${id}-error`}
          className="text-destructive text-sm"
          role="alert"
          aria-live="polite"
        >
          {error ?? loadError}
        </p>
      )}

      {/* Helper text */}
      {helperText && !error && !loadError && (
        <p id={`${id}-help`} className="text-muted-foreground text-sm">
          {helperText}
        </p>
      )}
    </>
  );
};

const Waveform = React.forwardRef<HTMLDivElement, WaveformProps>(
  (
    {
      audioFile,
      value = 0,
      onChange,
      id,
      label,
      tooltip,
      tooltipId,
      required,
      error,
      helperText,
      disabled,
      className,
    },
    ref
  ) => {
    // Early validation check for immediate feedback
    const [validationError, setValidationError] = React.useState<
      string | undefined
    >();

    React.useEffect(() => {
      const validation = validateAudioFile(audioFile);
      setValidationError(validation.valid ? undefined : validation.error);
    }, [audioFile]);

    // Show validation error immediately before attempting to process
    const displayError = error ?? validationError;

    return (
      <WaveformProvider
        audioFile={audioFile}
        value={value}
        onChange={onChange ?? (() => {})}
        disabled={disabled ?? !!validationError}
      >
        <div ref={ref} className={cn('flex flex-col space-y-4', className)}>
          {/* Label with optional tooltip */}
          <div className="flex items-center gap-2">
            <Label
              htmlFor={id}
              className={cn(
                'text-right',
                required &&
                  "after:text-destructive after:ml-1 after:content-['*']"
              )}
            >
              {label}
            </Label>
            {tooltip && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    id={tooltipId}
                    type="button"
                    className="inline-flex h-[14px] w-[14px] items-center justify-center"
                    aria-label={`More information about ${label}`}
                  >
                    <HelpCircle className="text-muted-foreground hover:text-foreground h-[14px] w-[14px]" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>

          <WaveformContent
            id={id}
            error={displayError}
            helperText={helperText}
          />
        </div>
      </WaveformProvider>
    );
  }
);

Waveform.displayName = 'Waveform';

export { Waveform };
