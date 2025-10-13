// Mock data for analytics dashboard
export type TimeFrame = '7d' | '30d' | 'ytd' | 'custom';

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

export type MetricType = 'streams' | 'creations' | 'views' | 'likes' | 'shares';

export interface KPI {
  type: MetricType;
  current: number;
  previous: number;
  percentChange: number;
}

export interface TimeSeriesDataPoint {
  date: string;
  streams: number;
  creations: number;
  views: number;
  likes: number;
  shares: number;
}

export interface GeographicData {
  country: string;
  countryCode: string;
  streams: number;
  creations: number;
  views: number;
  likes: number;
  shares: number;
}

export interface Track {
  id: string;
  name: string;
  artist: string;
  releaseDate: string;
  artworkUrl: string;
  streams: number;
  creations: number;
  views: number;
  likes: number;
  shares: number;
}

export interface Video {
  id: string;
  trackName: string;
  platform: 'tiktok' | 'youtube-shorts' | 'instagram' | 'facebook';
  thumbnailUrl: string;
  videoUrl: string;
  creations: number;
  views: number;
  likes: number;
  shares: number;
  creator: string;
}

export interface Playlist {
  id: string;
  name: string;
  dsp: 'spotify' | 'apple-music' | 'youtube-music' | 'amazon';
  streams: number;
  curatorName: string;
  followerCount: number;
}

export interface AIInsight {
  id: string;
  category: 'trending' | 'opportunity' | 'achievement' | 'alert';
  title: string;
  description: string;
  actionLabel?: string;
  actionUrl?: string;
}

export interface Artist {
  id: string;
  name: string;
  imageUrl: string;
}

export interface Release {
  id: string;
  name: string;
  artistId: string;
  artworkUrl: string;
  releaseDate: string;
}

// Mock Artists
export const mockArtists: Artist[] = [
  {
    id: '1',
    name: 'Jade Davis',
    imageUrl: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: '2',
    name: 'The Midnight Owls',
    imageUrl: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: '3',
    name: 'Luna Wave',
    imageUrl: 'https://i.pravatar.cc/150?img=3',
  },
];

// Mock Releases
export const mockReleases: Release[] = [
  {
    id: '1',
    name: 'Summer Nights',
    artistId: '1',
    artworkUrl: 'https://picsum.photos/seed/album1/300/300',
    releaseDate: '2024-06-15',
  },
  {
    id: '2',
    name: 'City Lights',
    artistId: '1',
    artworkUrl: 'https://picsum.photos/seed/album2/300/300',
    releaseDate: '2024-08-20',
  },
  {
    id: '3',
    name: 'Echoes',
    artistId: '2',
    artworkUrl: 'https://picsum.photos/seed/album3/300/300',
    releaseDate: '2024-05-10',
  },
  {
    id: '4',
    name: 'Horizons',
    artistId: '3',
    artworkUrl: 'https://picsum.photos/seed/album4/300/300',
    releaseDate: '2024-07-01',
  },
];

// Mock KPIs
export const mockKPIs: KPI[] = [
  {
    type: 'streams',
    current: 125847,
    previous: 102456,
    percentChange: 22.8,
  },
  {
    type: 'creations',
    current: 4823,
    previous: 3891,
    percentChange: 24.0,
  },
  {
    type: 'views',
    current: 892456,
    previous: 734201,
    percentChange: 21.6,
  },
  {
    type: 'likes',
    current: 67234,
    previous: 52108,
    percentChange: 29.0,
  },
  {
    type: 'shares',
    current: 12456,
    previous: 9823,
    percentChange: 26.8,
  },
];

// Mock Time Series Data (7 days)
export const mockTimeSeriesData: TimeSeriesDataPoint[] = [
  {
    date: '2025-10-07',
    streams: 15234,
    creations: 623,
    views: 112345,
    likes: 8456,
    shares: 1567,
  },
  {
    date: '2025-10-08',
    streams: 16789,
    creations: 678,
    views: 123456,
    likes: 9234,
    shares: 1789,
  },
  {
    date: '2025-10-09',
    streams: 18234,
    creations: 712,
    views: 135678,
    likes: 10123,
    shares: 1923,
  },
  {
    date: '2025-10-10',
    streams: 19567,
    creations: 745,
    views: 142345,
    likes: 10789,
    shares: 2034,
  },
  {
    date: '2025-10-11',
    streams: 17923,
    creations: 689,
    views: 128456,
    likes: 9678,
    shares: 1856,
  },
  {
    date: '2025-10-12',
    streams: 19234,
    creations: 734,
    views: 138234,
    likes: 10345,
    shares: 1978,
  },
  {
    date: '2025-10-13',
    streams: 18866,
    creations: 642,
    views: 111942,
    likes: 8609,
    shares: 2309,
  },
];

// Mock Geographic Data
export const mockGeographicData: GeographicData[] = [
  {
    country: 'United States',
    countryCode: 'US',
    streams: 42345,
    creations: 1823,
    views: 356789,
    likes: 26834,
    shares: 4978,
  },
  {
    country: 'Brazil',
    countryCode: 'BR',
    streams: 28456,
    creations: 1245,
    views: 245678,
    likes: 18456,
    shares: 3456,
  },
  {
    country: 'United Kingdom',
    countryCode: 'GB',
    streams: 18234,
    creations: 678,
    views: 134567,
    likes: 10123,
    shares: 1923,
  },
  {
    country: 'Germany',
    countryCode: 'DE',
    streams: 12456,
    creations: 456,
    views: 98765,
    likes: 7456,
    shares: 1456,
  },
  {
    country: 'Mexico',
    countryCode: 'MX',
    streams: 9823,
    creations: 389,
    views: 78234,
    likes: 5923,
    shares: 1123,
  },
  {
    country: 'Canada',
    countryCode: 'CA',
    streams: 8567,
    creations: 312,
    views: 67890,
    likes: 5123,
    shares: 978,
  },
  {
    country: 'France',
    countryCode: 'FR',
    streams: 6789,
    creations: 267,
    views: 56789,
    likes: 4289,
    shares: 823,
  },
  {
    country: 'Japan',
    countryCode: 'JP',
    streams: 5234,
    creations: 201,
    views: 45678,
    likes: 3456,
    shares: 656,
  },
];

// Mock Top Tracks
export const mockTopTracks: Track[] = [
  {
    id: '1',
    name: 'Midnight Drive',
    artist: 'Jade Davis',
    releaseDate: '2024-06-15',
    artworkUrl: 'https://picsum.photos/seed/track1/300/300',
    streams: 45823,
    creations: 1823,
    views: 289456,
    likes: 21834,
    shares: 4123,
  },
  {
    id: '2',
    name: 'Ocean Waves',
    artist: 'Luna Wave',
    releaseDate: '2024-07-01',
    artworkUrl: 'https://picsum.photos/seed/track2/300/300',
    streams: 38456,
    creations: 1534,
    views: 245678,
    likes: 18456,
    shares: 3456,
  },
  {
    id: '3',
    name: 'City Lights',
    artist: 'Jade Davis',
    releaseDate: '2024-08-20',
    artworkUrl: 'https://picsum.photos/seed/track3/300/300',
    streams: 32145,
    creations: 1289,
    views: 198765,
    likes: 14923,
    shares: 2789,
  },
  {
    id: '4',
    name: 'Neon Dreams',
    artist: 'The Midnight Owls',
    releaseDate: '2024-05-10',
    artworkUrl: 'https://picsum.photos/seed/track4/300/300',
    streams: 27834,
    creations: 1045,
    views: 167890,
    likes: 12645,
    shares: 2345,
  },
  {
    id: '5',
    name: 'Golden Hour',
    artist: 'Jade Davis',
    releaseDate: '2024-06-15',
    artworkUrl: 'https://picsum.photos/seed/track5/300/300',
    streams: 23567,
    creations: 923,
    views: 145678,
    likes: 10923,
    shares: 2034,
  },
];

// Mock Top Videos
export const mockTopVideos: Video[] = [
  {
    id: '1',
    trackName: 'Midnight Drive',
    platform: 'tiktok',
    thumbnailUrl: 'https://picsum.photos/seed/video1/400/600',
    videoUrl: 'https://tiktok.com/@creator1/video1',
    creations: 1823,
    views: 289456,
    likes: 21834,
    shares: 4123,
    creator: '@musiclover23',
  },
  {
    id: '2',
    trackName: 'Ocean Waves',
    platform: 'instagram',
    thumbnailUrl: 'https://picsum.photos/seed/video2/400/600',
    videoUrl: 'https://instagram.com/reel/abc123',
    creations: 1534,
    views: 245678,
    likes: 18456,
    shares: 3456,
    creator: '@beachvibes',
  },
  {
    id: '3',
    trackName: 'City Lights',
    platform: 'youtube-shorts',
    thumbnailUrl: 'https://picsum.photos/seed/video3/400/600',
    videoUrl: 'https://youtube.com/shorts/xyz789',
    creations: 1289,
    views: 198765,
    likes: 14923,
    shares: 2789,
    creator: '@urbanexplorer',
  },
  {
    id: '4',
    trackName: 'Neon Dreams',
    platform: 'tiktok',
    thumbnailUrl: 'https://picsum.photos/seed/video4/400/600',
    videoUrl: 'https://tiktok.com/@creator2/video2',
    creations: 1045,
    views: 167890,
    likes: 12645,
    shares: 2345,
    creator: '@nightowl88',
  },
  {
    id: '5',
    trackName: 'Golden Hour',
    platform: 'instagram',
    thumbnailUrl: 'https://picsum.photos/seed/video5/400/600',
    videoUrl: 'https://instagram.com/reel/def456',
    creations: 923,
    views: 145678,
    likes: 10923,
    shares: 2034,
    creator: '@sunsetdreamer',
  },
];

// Mock Top Playlists
export const mockTopPlaylists: Playlist[] = [
  {
    id: '1',
    name: 'Chill Vibes',
    dsp: 'spotify',
    streams: 34567,
    curatorName: 'Spotify Editorial',
    followerCount: 2456789,
  },
  {
    id: '2',
    name: 'Indie Favorites',
    dsp: 'apple-music',
    streams: 28934,
    curatorName: 'Apple Music Editors',
    followerCount: 1823456,
  },
  {
    id: '3',
    name: 'Road Trip Anthems',
    dsp: 'spotify',
    streams: 23456,
    curatorName: 'Discover Weekly',
    followerCount: 3456789,
  },
  {
    id: '4',
    name: 'Summer Hits 2024',
    dsp: 'youtube-music',
    streams: 19823,
    curatorName: 'YouTube Music',
    followerCount: 987654,
  },
  {
    id: '5',
    name: 'Feel Good Music',
    dsp: 'spotify',
    streams: 17234,
    curatorName: 'Daily Mix',
    followerCount: 1234567,
  },
];

// Mock AI Insights
export const mockAIInsights: AIInsight[] = [
  {
    id: '1',
    category: 'trending',
    title: 'Your music is exploding in Brazil 🔥',
    description:
      'Streams up 67% in Brazil this week, driven by Instagram Reels. Your track "Midnight Drive" is gaining massive traction.',
    actionLabel: 'Launch Show.co campaign',
    actionUrl: '#',
  },
  {
    id: '2',
    category: 'opportunity',
    title: 'Playlist momentum on Spotify',
    description:
      'You were added to 3 new editorial playlists with 2.4M combined followers. Capitalize on this momentum.',
    actionLabel: 'Share with HearNow',
    actionUrl: '#',
  },
  {
    id: '3',
    category: 'achievement',
    title: 'Milestone unlocked! 🎉',
    description:
      'You just crossed 100K streams this month! You\'re in the top 15% of artists on the platform.',
    actionLabel: 'View resources',
    actionUrl: '#',
  },
  {
    id: '4',
    category: 'opportunity',
    title: 'TikTok creators love your sound',
    description:
      '4,823 creations this week using "Ocean Waves". Time to engage with creators and ride the wave.',
    actionLabel: 'Find top creators',
    actionUrl: '#',
  },
];

// Persona types for empty states
export type PersonaType = 'new' | 'emerging' | 'established';

export interface UserPersona {
  type: PersonaType;
  totalStreams: number;
  releaseCount: number;
  artistCount: number;
}

// Mock user persona - you can change this to test different states
export const mockUserPersona: UserPersona = {
  type: 'established',
  totalStreams: 125847,
  releaseCount: 4,
  artistCount: 3,
};

// Helper function to get formatted metric label
export function getMetricLabel(type: MetricType): string {
  const labels: Record<MetricType, string> = {
    streams: 'Streams',
    creations: 'Creations',
    views: 'Views',
    likes: 'Likes',
    shares: 'Shares',
  };
  return labels[type];
}

// Helper function to format numbers
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toLocaleString();
}

// Helper function to get platform display name
export function getPlatformName(platform: string): string {
  const names: Record<string, string> = {
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
  return names[platform] || platform;
}
