/**
 * Format seconds to MM:SS or HH:MM:SS format
 * @param seconds - Time in seconds
 * @returns Formatted time string (e.g., "3:45" or "1:23:45")
 */
export const formatTime = (seconds: number): string => {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return '0:00';
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const padZero = (num: number): string => num.toString().padStart(2, '0');

  if (hours > 0) {
    // Format as HH:MM:SS for audio longer than 1 hour
    return `${hours}:${padZero(minutes)}:${padZero(secs)}`;
  }

  // Format as M:SS for audio less than 1 hour
  return `${minutes}:${padZero(secs)}`;
};

/**
 * Parse time string to seconds
 * Supports formats: "MM:SS", "HH:MM:SS", "M:SS", etc.
 * @param timeString - Time string to parse
 * @returns Time in seconds, or 0 if invalid
 */
export const parseTimeString = (timeString: string): number => {
  const parts = timeString.split(':').map((part) => parseInt(part, 10));

  if (parts.some(Number.isNaN)) {
    return 0;
  }

  if (parts.length === 2) {
    // MM:SS format
    const [minutes, seconds] = parts;
    return (minutes ?? 0) * 60 + (seconds ?? 0);
  }

  if (parts.length === 3) {
    // HH:MM:SS format
    const [hours, minutes, seconds] = parts;
    return (hours ?? 0) * 3600 + (minutes ?? 0) * 60 + (seconds ?? 0);
  }

  return 0;
};

/**
 * Clamp value between min and max
 * @param value - Value to clamp
 * @param min - Minimum allowed value
 * @param max - Maximum allowed value
 * @returns Clamped value
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Calculate percentage of time elapsed
 * @param currentTime - Current time in seconds
 * @param duration - Total duration in seconds
 * @returns Percentage (0-100)
 */
export const calculateTimePercentage = (
  currentTime: number,
  duration: number
): number => {
  if (!Number.isFinite(duration) || duration <= 0) {
    return 0;
  }

  return Math.min(100, Math.max(0, (currentTime / duration) * 100));
};

/**
 * Convert percentage to time
 * @param percentage - Percentage (0-100)
 * @param duration - Total duration in seconds
 * @returns Time in seconds
 */
export const percentageToTime = (
  percentage: number,
  duration: number
): number => {
  if (!Number.isFinite(duration) || duration <= 0) {
    return 0;
  }

  const clampedPercentage = Math.min(100, Math.max(0, percentage));
  return (clampedPercentage / 100) * duration;
};

/**
 * Format duration as a human-readable string
 * @param seconds - Duration in seconds
 * @returns Human-readable duration (e.g., "3 min 45 sec", "1 hour 23 min")
 */
export const formatDuration = (seconds: number): string => {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return '0 sec';
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts: string[] = [];

  if (hours > 0) {
    parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
  }

  if (minutes > 0) {
    parts.push(`${minutes} min`);
  }

  if (secs > 0 || parts.length === 0) {
    parts.push(`${secs} sec`);
  }

  return parts.join(' ');
};
