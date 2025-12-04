// Mock data for earnings dashboard
export type EarningType = 'streaming' | 'social-video' | 'other';
export type PayoutStatus = 'pending' | 'processing' | 'completed' | 'failed';

export type DSP =
  | 'spotify'
  | 'apple-music'
  | 'tiktok'
  | 'youtube-music'
  | 'youtube-content-id'
  | 'youtube-shorts'
  | 'instagram'
  | 'facebook'
  | 'amazon';

export interface EarningsBalance {
  currentBalance: number;
  payoutThreshold: number;
  totalAllTimeEarnings: number;
  earningsThisMonth: number;
  lastPayoutAmount: number;
  lastPayoutDate: string | null;
  nextPayoutDate: string | null;
}

export interface EarningTypeBreakdown {
  type: EarningType;
  amount: number;
  percentage: number;
}

export interface EarningsByPlatform {
  platform: DSP;
  amount: number;
  streams?: number;
  views?: number;
}

export interface TrackEarning {
  trackId: string;
  trackName: string;
  artistName: string;
  amount: number;
  streams: number;
}

export interface ReleaseEarning {
  releaseId: string;
  releaseName: string;
  artistName: string;
  amount: number;
  tracks: TrackEarning[];
}

export interface ArtistEarning {
  artistId: string;
  artistName: string;
  amount: number;
  percentage: number;
}

export interface EarningsTransaction {
  id: string;
  date: string;
  platform: DSP;
  earningType: EarningType;
  amount: number;
  trackName?: string;
  artistName?: string;
  releaseId?: string;
  streams?: number;
  views?: number;
}

export interface Payout {
  id: string;
  payoutDate: string;
  status: PayoutStatus;
  grossAmount: number;
  fees: number;
  taxWithholding: number;
  netAmount: number;
  earningTypeBreakdown: EarningTypeBreakdown[];
  platformBreakdown: EarningsByPlatform[];
  artistBreakdown: ArtistEarning[];
  releaseBreakdown: ReleaseEarning[];
  periodStart: string;
  periodEnd: string;
}

// Interfaces for filtering
export interface Release {
  id: string;
  name: string;
  artistName: string;
  type: 'album' | 'single';
  trackIds?: string[];
}

export interface Track {
  id: string;
  name: string;
  releaseId: string;
  artistName: string;
}

// Mock current balance (under threshold, eligible on 11/30)
export const mockEarningsBalance: EarningsBalance = {
  currentBalance: 8.47,
  payoutThreshold: 10.0,
  totalAllTimeEarnings: 12456.89,
  earningsThisMonth: 284.56,
  lastPayoutAmount: 1245.67,
  lastPayoutDate: '2025-10-01',
  nextPayoutDate: '2025-11-30',
};

// Mock earning type breakdown
export const mockEarningTypeBreakdown: EarningTypeBreakdown[] = [
  {
    type: 'streaming',
    amount: 678.45,
    percentage: 75.2,
  },
  {
    type: 'social-video',
    amount: 168.78,
    percentage: 18.7,
  },
  {
    type: 'other',
    amount: 55.12,
    percentage: 6.1,
  },
];

// Mock recent transactions (last 30 days)
export const mockRecentTransactions: EarningsTransaction[] = [
  {
    id: '1',
    date: '2025-11-03',
    platform: 'spotify',
    earningType: 'streaming',
    amount: 45.23,
    trackName: 'Midnight Drive',
    artistName: 'Jade Davis',
    releaseId: '1',
    streams: 15234,
  },
  {
    id: '2',
    date: '2025-11-02',
    platform: 'tiktok',
    earningType: 'social-video',
    amount: 32.45,
    trackName: 'Ocean Waves',
    artistName: 'Luna Wave',
    releaseId: '2',
    views: 289456,
  },
  {
    id: '3',
    date: '2025-11-02',
    platform: 'apple-music',
    earningType: 'streaming',
    amount: 38.67,
    trackName: 'City Lights',
    artistName: 'Jade Davis',
    releaseId: '1',
    streams: 12456,
  },
  {
    id: '4',
    date: '2025-11-01',
    platform: 'youtube-content-id',
    earningType: 'social-video',
    amount: 28.9,
    trackName: 'Neon Dreams',
    artistName: 'The Midnight Owls',
    releaseId: '3',
    views: 145678,
  },
  {
    id: '5',
    date: '2025-10-31',
    platform: 'spotify',
    earningType: 'streaming',
    amount: 41.56,
    trackName: 'Golden Hour',
    artistName: 'Jade Davis',
    releaseId: '1',
    streams: 13892,
  },
  {
    id: '6',
    date: '2025-10-30',
    platform: 'instagram',
    earningType: 'social-video',
    amount: 19.34,
    trackName: 'Midnight Drive',
    artistName: 'Jade Davis',
    releaseId: '1',
    views: 98765,
  },
  {
    id: '7',
    date: '2025-10-29',
    platform: 'amazon',
    earningType: 'streaming',
    amount: 15.78,
    trackName: 'Ocean Waves',
    artistName: 'Luna Wave',
    releaseId: '2',
    streams: 5234,
  },
  {
    id: '8',
    date: '2025-10-28',
    platform: 'youtube-shorts',
    earningType: 'social-video',
    amount: 22.67,
    trackName: 'City Lights',
    artistName: 'Jade Davis',
    releaseId: '2',
    views: 112345,
  },
];

// Mock payout history
export const mockPayoutHistory: Payout[] = [
  {
    id: 'payout-001',
    payoutDate: '2025-10-01',
    status: 'completed',
    grossAmount: 1289.45,
    fees: 38.68,
    taxWithholding: 5.1,
    netAmount: 1245.67,
    periodStart: '2025-07-01',
    periodEnd: '2025-09-30',
    earningTypeBreakdown: [
      { type: 'streaming', amount: 1031.56, percentage: 75.5 },
      { type: 'social-video', amount: 257.89, percentage: 18.9 },
      { type: 'other', amount: 76.45, percentage: 5.6 },
    ],
    platformBreakdown: [
      { platform: 'spotify', amount: 534.23, streams: 178945 },
      { platform: 'apple-music', amount: 312.45, streams: 104567 },
      { platform: 'tiktok', amount: 156.78, views: 1245678 },
      { platform: 'youtube-content-id', amount: 89.34, views: 567890 },
      { platform: 'amazon', amount: 98.67, streams: 32456 },
      { platform: 'youtube-music', amount: 67.89, streams: 22789 },
      { platform: 'instagram', amount: 30.09, views: 234567 },
    ],
    artistBreakdown: [
      { artistId: 'artist-1', artistName: 'Jade Davis', amount: 801.57, percentage: 62.2 },
      { artistId: 'artist-2', artistName: 'Luna Wave', amount: 389.56, percentage: 30.2 },
      { artistId: 'artist-3', artistName: 'The Midnight Owls', amount: 98.32, percentage: 7.6 },
    ],
    releaseBreakdown: [
      {
        releaseId: '1',
        releaseName: 'Summer Nights',
        artistName: 'Jade Davis',
        amount: 645.23,
        tracks: [
          {
            trackId: '1',
            trackName: 'Midnight Drive',
            artistName: 'Jade Davis',
            amount: 423.45,
            streams: 142345,
          },
          {
            trackId: '5',
            trackName: 'Golden Hour',
            artistName: 'Jade Davis',
            amount: 221.78,
            streams: 74567,
          },
        ],
      },
      {
        releaseId: '4',
        releaseName: 'Horizons',
        artistName: 'Luna Wave',
        amount: 389.56,
        tracks: [
          {
            trackId: '2',
            trackName: 'Ocean Waves',
            artistName: 'Luna Wave',
            amount: 389.56,
            streams: 130789,
          },
        ],
      },
      {
        releaseId: '2',
        releaseName: 'City Lights',
        artistName: 'Jade Davis',
        amount: 156.34,
        tracks: [
          {
            trackId: '3',
            trackName: 'City Lights',
            artistName: 'Jade Davis',
            amount: 156.34,
            streams: 52456,
          },
        ],
      },
      {
        releaseId: '3',
        releaseName: 'Echoes',
        artistName: 'The Midnight Owls',
        amount: 98.32,
        tracks: [
          {
            trackId: '4',
            trackName: 'Neon Dreams',
            artistName: 'The Midnight Owls',
            amount: 98.32,
            streams: 33012,
          },
        ],
      },
    ],
  },
  {
    id: 'payout-002',
    payoutDate: '2025-07-01',
    status: 'completed',
    grossAmount: 956.78,
    fees: 28.7,
    taxWithholding: 3.82,
    netAmount: 924.26,
    periodStart: '2025-04-01',
    periodEnd: '2025-06-30',
    earningTypeBreakdown: [
      { type: 'streaming', amount: 765.42, percentage: 76.2 },
      { type: 'social-video', amount: 191.36, percentage: 19.1 },
      { type: 'other', amount: 47.18, percentage: 4.7 },
    ],
    platformBreakdown: [
      { platform: 'spotify', amount: 401.34, streams: 134567 },
      { platform: 'apple-music', amount: 234.56, streams: 78456 },
      { platform: 'tiktok', amount: 123.45, views: 987654 },
      { platform: 'youtube-content-id', amount: 89.12, views: 456789 },
      { platform: 'amazon', amount: 67.89, streams: 22345 },
      { platform: 'youtube-music', amount: 40.42, streams: 13567 },
    ],
    artistBreakdown: [
      { artistId: 'artist-1', artistName: 'Jade Davis', amount: 600, percentage: 65 },
      { artistId: 'artist-2', artistName: 'Luna Wave', amount: 324.26, percentage: 35 },
    ],
    releaseBreakdown: [],
  },
];

// Helper function to format currency
export function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Helper function to get earning type label
export function getEarningTypeLabel(type: EarningType): string {
  const labels: Record<EarningType, string> = {
    streaming: 'Streaming & Downloads',
    'social-video': 'Social Video',
    other: 'Other',
  };
  return labels[type];
}

// Helper function to get platform display name
export function getPlatformName(platform: DSP): string {
  const names: Record<DSP, string> = {
    spotify: 'Spotify',
    'apple-music': 'Apple Music',
    tiktok: 'TikTok',
    'youtube-music': 'YouTube Music',
    'youtube-content-id': 'YouTube Content ID',
    'youtube-shorts': 'YouTube Shorts',
    instagram: 'Instagram',
    facebook: 'Facebook',
    amazon: 'Amazon Music',
  };
  return names[platform];
}

// Helper function to get payout status label
export function getPayoutStatusLabel(status: PayoutStatus): string {
  const labels: Record<PayoutStatus, string> = {
    pending: 'Pending',
    processing: 'Processing',
    completed: 'Completed',
    failed: 'Failed',
  };
  return labels[status];
}

// Helper function to calculate progress to payout
export function calculatePayoutProgress(
  currentBalance: number,
  threshold: number
): number {
  return Math.min((currentBalance / threshold) * 100, 100);
}

// Time series data for earnings chart
export interface EarningsTimeSeriesData {
  date: string;
  streaming: number;
  socialVideo: number;
  other?: number;
}

// Earnings data by timeframe for KPI filtering
export interface TimeframeEarnings {
  totalEarnings: number;
  streaming: { amount: number; percentage: number };
  socialVideo: { amount: number; percentage: number };
  other: { amount: number; percentage: number };
  currentBalance: number;
}

export type TimeFrame = 'monthly' | 'quarterly' | 'yearly' | 'lifetime';

export const mockEarningsByTimeframe: Record<TimeFrame, TimeframeEarnings> = {
  monthly: {
    totalEarnings: 902.35,
    streaming: { amount: 678.45, percentage: 75.2 },
    socialVideo: { amount: 168.78, percentage: 18.7 },
    other: { amount: 55.12, percentage: 6.1 },
    currentBalance: 8.47,
  },
  quarterly: {
    totalEarnings: 2847.92,
    streaming: { amount: 2135.94, percentage: 75.0 },
    socialVideo: { amount: 540.71, percentage: 19.0 },
    other: { amount: 171.27, percentage: 6.0 },
    currentBalance: 8.47,
  },
  yearly: {
    totalEarnings: 9234.56,
    streaming: { amount: 6925.92, percentage: 75.0 },
    socialVideo: { amount: 1754.57, percentage: 19.0 },
    other: { amount: 554.07, percentage: 6.0 },
    currentBalance: 8.47,
  },
  lifetime: {
    totalEarnings: 12456.89,
    streaming: { amount: 9342.67, percentage: 75.0 },
    socialVideo: { amount: 2366.81, percentage: 19.0 },
    other: { amount: 747.41, percentage: 6.0 },
    currentBalance: 8.47,
  },
};

// Mock time series data (last 7 days) - smoother progression
// Using relative dates to ensure data is always recent
const getRecentDates = () => {
  const dates: EarningsTimeSeriesData[] = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    dates.push({
      date: dateStr,
      streaming: 22.15 + (6 - i) * 1.0,
      socialVideo: 5.5 + (6 - i) * 0.27,
      other: 1.5 + (6 - i) * 0.15,
    });
  }
  return dates;
};

export const mockEarningsTimeSeries: EarningsTimeSeriesData[] = getRecentDates();

// Mock releases for filtering
export const mockEarningsReleases: Release[] = [
  {
    id: '1',
    name: 'Night Sessions',
    artistName: 'Jade Davis',
    type: 'album',
    trackIds: ['1', '2', '3'],
  },
  {
    id: '2',
    name: 'Ocean Waves',
    artistName: 'Luna Wave',
    type: 'single',
    trackIds: ['4'],
  },
  {
    id: '3',
    name: 'Summer Vibes',
    artistName: 'Solar Sounds',
    type: 'album',
    trackIds: ['5', '6'],
  },
];

// Mock tracks for filtering
export const mockEarningsTracks: Track[] = [
  { id: '1', name: 'Midnight Drive', releaseId: '1', artistName: 'Jade Davis' },
  { id: '2', name: 'City Lights', releaseId: '1', artistName: 'Jade Davis' },
  { id: '3', name: 'Late Night Jazz', releaseId: '1', artistName: 'Jade Davis' },
  { id: '4', name: 'Ocean Waves', releaseId: '2', artistName: 'Luna Wave' },
  { id: '5', name: 'Sunset Beach', releaseId: '3', artistName: 'Solar Sounds' },
  { id: '6', name: 'Tropical Breeze', releaseId: '3', artistName: 'Solar Sounds' },
];
