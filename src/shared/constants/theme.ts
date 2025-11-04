/**
 * Centralized theme constants for consistent styling across the application
 * These values should be used instead of hardcoding colors and other design tokens
 */

export const COLORS = {
  // Primary brand colors
  primary: '#52bcd6', // Cyan - primary brand color for buttons, links, highlights
  primaryDark: '#3a9ab8', // Darker cyan for hover states
  primaryLight: '#6dd4ea', // Lighter cyan for backgrounds

  // Secondary colors
  secondary: '#f59e0b', // Amber/Orange - for social video, warnings
  secondaryDark: '#d97706', // Darker amber for hover states

  // Background colors
  bgDark: '#1C1C1C', // Main dark background
  bgCard: '#262626', // Card background
  bgCardHover: '#2d2d2d', // Card hover state
  bgInput: '#1a1a1a', // Input field background

  // Border colors
  borderGray: '#374151', // Standard border gray (gray-700)
  borderLight: 'rgba(255, 255, 255, 0.2)', // Light border with transparency

  // Text colors (using Tailwind muted-foreground pattern)
  textMuted: 'rgba(156, 163, 175, 1)', // Muted text color
  textWhite: 'rgba(255, 255, 255, 1)', // Primary white text
  textGray: 'rgba(255, 255, 255, 0.7)', // Secondary gray text

  // Status colors
  success: '#10b981', // Green - for success states
  error: '#ef4444', // Red - for error states
  warning: '#f59e0b', // Amber - for warning states
  info: '#3b82f6', // Blue - for info states

  // Platform-specific colors (for badges, icons)
  platform: {
    spotify: '#1DB954',
    appleMusic: '#FA243C',
    tiktok: '#000000',
    youtubeMusic: '#FF0000',
    youtubeContentId: '#FF0000',
    youtubeShorts: '#FF0000',
    instagram: '#E4405F',
    facebook: '#1877F2',
    amazon: '#FF9900',
  },

  // Chart colors
  chart: {
    streaming: '#52bcd6', // Cyan
    socialVideo: '#f59e0b', // Amber
    gridLine: 'rgba(75, 85, 99, 0.3)', // Subtle grid lines
  },
} as const;

export const SPACING = {
  // Common spacing values
  cardPadding: '1rem', // p-4
  sectionGap: '1.5rem', // gap-6
  contentMaxWidth: '80rem', // max-w-7xl (1280px)
} as const;

export const BORDER_RADIUS = {
  card: '3px', // rounded-[3px] - square-ish cards
  button: '0.5rem', // rounded-lg
  input: '0.5rem', // rounded-lg
} as const;

export const TRANSITIONS = {
  default: 'all 0.2s ease',
  fast: 'all 0.15s ease',
  slow: 'all 0.3s ease',
} as const;

// Helper function to create inline style objects
export const createStyleObject = {
  primaryButton: {
    backgroundColor: COLORS.primary,
    color: COLORS.textWhite,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderColor: COLORS.borderLight,
    color: COLORS.textGray,
  },
  card: {
    backgroundColor: COLORS.bgCard,
    borderColor: COLORS.borderGray,
  },
  darkBg: {
    backgroundColor: COLORS.bgDark,
  },
} as const;
