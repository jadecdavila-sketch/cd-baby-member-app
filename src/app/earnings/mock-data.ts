// Mock data for earnings dashboard
export type EarningType = 'streaming' | 'social-video' | 'other';
export type PayoutStatus = 'pending' | 'processing' | 'completed' | 'failed';

export type DSP =
  | '7digital'
  | 'amazon'
  | 'ami'
  | 'anghami'
  | 'apple-music'
  | 'audible-magic'
  | 'awa'
  | 'bmat'
  | 'boomplay'
  | 'deezer'
  | 'facebook'
  | 'fuga'
  | 'hungama'
  | 'iheartradio'
  | 'imusica'
  | 'inprodicon'
  | 'instagram'
  | 'jaxsta'
  | 'kdigital'
  | 'kkbox'
  | 'kuack'
  | 'lissen'
  | 'netease'
  | 'nuuday'
  | 'pandora'
  | 'peloton'
  | 'qobuz'
  | 'saavn'
  | 'slacker-radio'
  | 'soundexchange'
  | 'spotify'
  | 'synchtank'
  | 'tencent'
  | 'the-mlc'
  | 'tidal'
  | 'tiktok'
  | 'trebel'
  | 'tuned-global'
  | 'youtube-content-id'
  | 'youtube-music'
  | 'youtube-shorts';

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
  {
    id: 'payout-003',
    payoutDate: '2025-04-01',
    status: 'completed',
    grossAmount: 1123.45,
    fees: 33.7,
    taxWithholding: 4.49,
    netAmount: 1085.26,
    periodStart: '2025-01-01',
    periodEnd: '2025-03-31',
    earningTypeBreakdown: [
      { type: 'streaming', amount: 898.76, percentage: 78.1 },
      { type: 'social-video', amount: 202.34, percentage: 17.6 },
      { type: 'other', amount: 49.45, percentage: 4.3 },
    ],
    platformBreakdown: [
      { platform: 'spotify', amount: 478.56, streams: 159876 },
      { platform: 'apple-music', amount: 289.34, streams: 96789 },
      { platform: 'tiktok', amount: 145.67, views: 1156789 },
      { platform: 'youtube-content-id', amount: 98.23, views: 623456 },
      { platform: 'amazon', amount: 78.45, streams: 25890 },
      { platform: 'deezer', amount: 33.2, streams: 11234 },
    ],
    artistBreakdown: [
      { artistId: 'artist-1', artistName: 'Jade Davis', amount: 695.47, percentage: 64.1 },
      { artistId: 'artist-2', artistName: 'Luna Wave', amount: 325.67, percentage: 30 },
      { artistId: 'artist-3', artistName: 'The Midnight Owls', amount: 64.12, percentage: 5.9 },
    ],
    releaseBreakdown: [],
  },
  {
    id: 'payout-004',
    payoutDate: '2025-01-02',
    status: 'completed',
    grossAmount: 876.32,
    fees: 26.29,
    taxWithholding: 3.51,
    netAmount: 846.52,
    periodStart: '2024-10-01',
    periodEnd: '2024-12-31',
    earningTypeBreakdown: [
      { type: 'streaming', amount: 701.06, percentage: 80.0 },
      { type: 'social-video', amount: 157.54, percentage: 18.0 },
      { type: 'other', amount: 17.52, percentage: 2.0 },
    ],
    platformBreakdown: [
      { platform: 'spotify', amount: 367.45, streams: 122567 },
      { platform: 'apple-music', amount: 223.12, streams: 74567 },
      { platform: 'tiktok', amount: 112.34, views: 892345 },
      { platform: 'youtube-content-id', amount: 78.9, views: 498765 },
      { platform: 'amazon', amount: 56.78, streams: 18923 },
      { platform: 'pandora', amount: 37.73, streams: 12567 },
    ],
    artistBreakdown: [
      { artistId: 'artist-1', artistName: 'Jade Davis', amount: 542.86, percentage: 64.1 },
      { artistId: 'artist-2', artistName: 'Luna Wave', amount: 253.95, percentage: 30 },
      { artistId: 'artist-3', artistName: 'The Midnight Owls', amount: 49.71, percentage: 5.9 },
    ],
    releaseBreakdown: [],
  },
  {
    id: 'payout-005',
    payoutDate: '2024-10-01',
    status: 'completed',
    grossAmount: 734.89,
    fees: 22.05,
    taxWithholding: 2.94,
    netAmount: 709.9,
    periodStart: '2024-07-01',
    periodEnd: '2024-09-30',
    earningTypeBreakdown: [
      { type: 'streaming', amount: 587.91, percentage: 80.0 },
      { type: 'social-video', amount: 132.28, percentage: 18.0 },
      { type: 'other', amount: 14.7, percentage: 2.0 },
    ],
    platformBreakdown: [
      { platform: 'spotify', amount: 312.56, streams: 104234 },
      { platform: 'apple-music', amount: 178.45, streams: 59567 },
      { platform: 'tiktok', amount: 98.67, views: 783456 },
      { platform: 'youtube-content-id', amount: 67.34, views: 423456 },
      { platform: 'amazon', amount: 45.67, streams: 15234 },
      { platform: 'tidal', amount: 32.2, streams: 10789 },
    ],
    artistBreakdown: [
      { artistId: 'artist-1', artistName: 'Jade Davis', amount: 454.94, percentage: 64.1 },
      { artistId: 'artist-2', artistName: 'Luna Wave', amount: 212.97, percentage: 30 },
      { artistId: 'artist-3', artistName: 'The Midnight Owls', amount: 41.99, percentage: 5.9 },
    ],
    releaseBreakdown: [],
  },
  {
    id: 'payout-006',
    payoutDate: '2024-07-01',
    status: 'completed',
    grossAmount: 612.34,
    fees: 18.37,
    taxWithholding: 2.45,
    netAmount: 591.52,
    periodStart: '2024-04-01',
    periodEnd: '2024-06-30',
    earningTypeBreakdown: [
      { type: 'streaming', amount: 489.87, percentage: 80.0 },
      { type: 'social-video', amount: 110.22, percentage: 18.0 },
      { type: 'other', amount: 12.25, percentage: 2.0 },
    ],
    platformBreakdown: [
      { platform: 'spotify', amount: 256.78, streams: 85678 },
      { platform: 'apple-music', amount: 145.67, streams: 48678 },
      { platform: 'tiktok', amount: 89.45, views: 712345 },
      { platform: 'youtube-content-id', amount: 56.78, views: 356789 },
      { platform: 'amazon', amount: 38.45, streams: 12834 },
      { platform: 'youtube-music', amount: 25.21, streams: 8456 },
    ],
    artistBreakdown: [
      { artistId: 'artist-1', artistName: 'Jade Davis', amount: 379.18, percentage: 64.1 },
      { artistId: 'artist-2', artistName: 'Luna Wave', amount: 177.46, percentage: 30 },
      { artistId: 'artist-3', artistName: 'The Midnight Owls', amount: 34.88, percentage: 5.9 },
    ],
    releaseBreakdown: [],
  },
  {
    id: 'payout-007',
    payoutDate: '2024-04-01',
    status: 'completed',
    grossAmount: 523.67,
    fees: 15.71,
    taxWithholding: 2.09,
    netAmount: 505.87,
    periodStart: '2024-01-01',
    periodEnd: '2024-03-31',
    earningTypeBreakdown: [
      { type: 'streaming', amount: 418.94, percentage: 80.0 },
      { type: 'social-video', amount: 94.26, percentage: 18.0 },
      { type: 'other', amount: 10.47, percentage: 2.0 },
    ],
    platformBreakdown: [
      { platform: 'spotify', amount: 218.45, streams: 72890 },
      { platform: 'apple-music', amount: 123.56, streams: 41234 },
      { platform: 'tiktok', amount: 78.34, views: 623456 },
      { platform: 'youtube-content-id', amount: 48.9, views: 312345 },
      { platform: 'amazon', amount: 32.12, streams: 10723 },
      { platform: 'soundexchange', amount: 22.3, streams: 7456 },
    ],
    artistBreakdown: [
      { artistId: 'artist-1', artistName: 'Jade Davis', amount: 324.26, percentage: 64.1 },
      { artistId: 'artist-2', artistName: 'Luna Wave', amount: 151.76, percentage: 30 },
      { artistId: 'artist-3', artistName: 'The Midnight Owls', amount: 29.85, percentage: 5.9 },
    ],
    releaseBreakdown: [],
  },
  {
    id: 'payout-008',
    payoutDate: '2024-01-02',
    status: 'completed',
    grossAmount: 445.23,
    fees: 13.36,
    taxWithholding: 1.78,
    netAmount: 430.09,
    periodStart: '2023-10-01',
    periodEnd: '2023-12-31',
    earningTypeBreakdown: [
      { type: 'streaming', amount: 356.18, percentage: 80.0 },
      { type: 'social-video', amount: 80.14, percentage: 18.0 },
      { type: 'other', amount: 8.91, percentage: 2.0 },
    ],
    platformBreakdown: [
      { platform: 'spotify', amount: 189.34, streams: 63178 },
      { platform: 'apple-music', amount: 107.45, streams: 35890 },
      { platform: 'tiktok', amount: 67.89, views: 542345 },
      { platform: 'youtube-content-id', amount: 42.34, views: 267890 },
      { platform: 'amazon', amount: 27.56, streams: 9189 },
      { platform: 'deezer', amount: 10.65, streams: 3567 },
    ],
    artistBreakdown: [
      { artistId: 'artist-1', artistName: 'Jade Davis', amount: 275.68, percentage: 64.1 },
      { artistId: 'artist-2', artistName: 'Luna Wave', amount: 129.03, percentage: 30 },
      { artistId: 'artist-3', artistName: 'The Midnight Owls', amount: 25.38, percentage: 5.9 },
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
    '7digital': '7digital',
    amazon: 'Amazon Music',
    ami: 'AMI',
    anghami: 'Anghami',
    'apple-music': 'Apple iTunes',
    'audible-magic': 'Audible Magic',
    awa: 'AWA',
    bmat: 'BMAT',
    boomplay: 'Boomplay',
    deezer: 'Deezer',
    facebook: 'Facebook',
    fuga: 'FUGA',
    hungama: 'Hungama',
    iheartradio: 'iHeartRadio',
    imusica: 'iMusica',
    inprodicon: 'InProdicon',
    instagram: 'Instagram',
    jaxsta: 'Jaxsta',
    kdigital: 'KDigital',
    kkbox: 'KKBox',
    kuack: 'Kuack',
    lissen: 'Lissen',
    netease: 'NetEase Cloud Music',
    nuuday: 'Nuuday',
    pandora: 'Pandora',
    peloton: 'Peloton',
    qobuz: 'Qobuz',
    saavn: 'Saavn',
    'slacker-radio': 'Slacker Radio',
    soundexchange: 'SoundExchange',
    spotify: 'Spotify',
    synchtank: 'Synchtank',
    tencent: 'Tencent Music Entertainment (TME)',
    'the-mlc': 'The MLC',
    tidal: 'Tidal',
    tiktok: 'TikTok',
    trebel: 'Trebel',
    'tuned-global': 'Tuned Global',
    'youtube-content-id': 'Youtube Content ID',
    'youtube-music': 'YouTube Music',
    'youtube-shorts': 'YouTube Shorts',
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
const getRecentDates = (): EarningsTimeSeriesData[] => {
  const dates: EarningsTimeSeriesData[] = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split('T')[0] ?? '';
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
