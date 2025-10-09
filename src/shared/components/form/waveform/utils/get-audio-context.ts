// Singleton AudioContext to avoid creating multiple instances
let sharedAudioContext: AudioContext | null = null;

/**
 * Get or create a shared AudioContext instance
 * Reusing a single AudioContext prevents resource exhaustion and errors
 */
export const getAudioContext = (): AudioContext => {
  // Clean up closed context
  if (sharedAudioContext?.state === 'closed') {
    sharedAudioContext = null;
  }

  // Create new context if needed
  sharedAudioContext ??= new AudioContext();

  // Resume context if suspended (can happen due to browser autoplay policies)
  if (sharedAudioContext.state === 'suspended') {
    sharedAudioContext.resume().catch((err) => {
      console.warn('Failed to resume AudioContext:', err);
    });
  }

  return sharedAudioContext;
};
