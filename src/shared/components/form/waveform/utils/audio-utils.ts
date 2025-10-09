/**
 * Audio processing utilities using Web Audio API
 */

import { getAudioContext } from './get-audio-context';

export interface AudioMetadata {
  duration: number;
  sampleRate: number;
  numberOfChannels: number;
}

export interface ProcessedAudioData extends AudioMetadata {
  buffer: AudioBuffer;
}

/**
 * Decode an audio file to AudioBuffer using Web Audio API with timeout
 * @param audioFile - The audio file to decode
 * @param timeoutMs - Maximum time to wait for decoding (default: 30 seconds)
 * @returns ProcessedAudioData containing the decoded buffer and metadata
 * @throws Error if decoding fails or times out
 */
export const decodeAudioFile = async (
  audioFile: File,
  timeoutMs: number = 30000
): Promise<ProcessedAudioData> => {
  try {
    // Create timeout promise
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(
          new Error(
            'Audio processing timed out. The file may be too large or corrupted. Please try a smaller file or different format.'
          )
        );
      }, timeoutMs);
    });

    // Race between decoding and timeout
    const decodePromise = (async () => {
      const arrayBuffer = await audioFile.arrayBuffer();

      // Use shared AudioContext to avoid creating multiple instances
      // which can cause "AudioContext encountered an error" issues
      const audioContext = getAudioContext();

      const buffer = await audioContext.decodeAudioData(arrayBuffer);
      console.log(buffer);
      // Validate decoded buffer
      if (buffer.duration === 0) {
        throw new Error(
          'Audio file has zero duration. The file may be corrupted or in an unsupported format.'
        );
      }

      if (buffer.numberOfChannels === 0) {
        throw new Error(
          'Audio file has no audio channels. The file may be corrupted.'
        );
      }

      return {
        buffer,
        duration: buffer.duration,
        sampleRate: buffer.sampleRate,
        numberOfChannels: buffer.numberOfChannels,
      };
    })();

    return await Promise.race([decodePromise, timeoutPromise]);
  } catch (error) {
    if (error instanceof Error) {
      // Provide specific error messages for common issues
      if (error.message.includes('timeout')) {
        throw error; // Already has a good message
      }
      if (
        error.message.includes('unable to decode') ||
        error.message.includes('EncodingError')
      ) {
        throw new Error(
          `Unable to decode audio file. The file may be corrupted or in an unsupported codec. Please try converting to MP3 or WAV format.`
        );
      }
      if (error.message.includes('NotSupportedError')) {
        throw new Error(
          `Audio codec not supported by your browser. Please try converting to MP3 or WAV format.`
        );
      }

      console.log(error);
      throw new Error(`Failed to process audio file: ${error.message}`);
    }
    throw new Error(
      'Failed to process audio file due to an unknown error. Please try a different file.'
    );
  }
};

/**
 * Extract channel data from AudioBuffer
 * Returns mono data by mixing stereo channels or using the first channel
 */
export const extractChannelData = (buffer: AudioBuffer): Float32Array => {
  const numberOfChannels = buffer.numberOfChannels;

  if (numberOfChannels === 1) {
    // Mono audio - return directly
    return buffer.getChannelData(0);
  }

  // Stereo or multi-channel - mix down to mono
  const length = buffer.length;
  const monoData = new Float32Array(length);
  const leftChannel = buffer.getChannelData(0);
  const rightChannel = buffer.getChannelData(1);

  for (let i = 0; i < length; i++) {
    // Average left and right channels
    monoData[i] = (leftChannel[i]! + rightChannel[i]!) / 2;
  }

  return monoData;
};

/**
 * Validate audio file type, size, and basic integrity
 * @param file - The audio file to validate
 * @returns Validation result with specific error messages
 */
export const validateAudioFile = (
  file: File
): { valid: boolean; error?: string } => {
  // Check if file exists
  if (!file) {
    return {
      valid: false,
      error: 'No audio file provided. Please select a file.',
    };
  }

  // Check file type with detailed feedback
  const validTypes = [
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'audio/wave',
    'audio/x-wav',
    'audio/flac',
    'audio/x-flac',
    'audio/aac',
    'audio/aacp',
    'audio/ogg',
    'audio/webm',
  ];

  const validExtensions = /\.(mp3|wav|flac|aac|ogg|webm)$/i;
  const isValidType = validTypes.includes(file.type);
  const hasValidExtension = validExtensions.test(file.name);

  if (!isValidType || !hasValidExtension) {
    const fileExtension =
      file.name.split('.').pop()?.toLowerCase() ?? 'unknown';

    return {
      valid: false,
      error: `Unsupported file format (.${fileExtension}). Please use MP3, WAV, FLAC, AAC, OGG, or WebM formats.`,
    };
  }

  // Check minimum size (at least 1KB) - detect empty or corrupted files
  if (file.size < 1024) {
    console.log(
      'Audio file appears to be empty or corrupted. Please select a valid audio file.'
    );
    return {
      valid: false,
      error:
        'Audio file appears to be empty or corrupted. Please select a valid audio file.',
    };
  }

  // Check file size (max 100MB)
  const maxSize = 100 * 1024 * 1024; // 100MB
  if (file.size > maxSize) {
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
    console.log(
      `Audio file is too large (${fileSizeMB} MB). Maximum allowed size is 100 MB. Please compress or select a smaller file.`
    );
    return {
      valid: false,
      error: `Audio file is too large (${fileSizeMB} MB). Maximum allowed size is 100 MB. Please compress or select a smaller file.`,
    };
  }

  // Check for extremely large files that might cause performance issues
  const warningSize = 50 * 1024 * 1024; // 50MB
  if (file.size > warningSize) {
    // Still valid, but could add a warning in the future
    console.warn(
      `Large audio file detected (${(file.size / (1024 * 1024)).toFixed(1)} MB). Processing may take longer.`
    );
  }

  return { valid: true };
};

/**
 * Check Web Audio API support
 */
export const checkWebAudioSupport = (): {
  supported: boolean;
  error?: string;
} => {
  if (typeof window === 'undefined') {
    return { supported: false, error: 'Not running in browser environment' };
  }

  if (!window.AudioContext && !(window as any).webkitAudioContext) {
    return {
      supported: false,
      error: 'Web Audio API is not supported in this browser',
    };
  }

  return { supported: true };
};
