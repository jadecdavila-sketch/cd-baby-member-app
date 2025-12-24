'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronDown, Search, SlidersHorizontal } from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/shared/components/shadcn/sheet';
import { COLORS } from '@/shared/constants/theme';

import { PlatformIcon } from '../components/platform-icon';
import {
  mockRecentTransactions,
  mockPayoutHistory,
  mockEarningsReleases,
  mockEarningsTracks,
  formatCurrency,
  getPlatformName,
  getEarningTypeLabel,
  type EarningType,
  type DSP,
} from '../mock-data';

export default function EarningsHistoryPage() {
  const [timeRange, setTimeRange] = useState<'30d' | '90d' | 'all'>('30d');
  const [selectedEarningType, setSelectedEarningType] =
    useState<EarningType | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<DSP>>(new Set());
  const [selectedArtists, setSelectedArtists] = useState<Set<string>>(new Set());
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
  const [expandedReleases, setExpandedReleases] = useState<string[]>([]);
  const [platformSearch, setPlatformSearch] = useState('');
  const [filtersDrawerOpen, setFiltersDrawerOpen] = useState(false);
  const [showAllPlatforms, setShowAllPlatforms] = useState(false);

  // Count active filters (excluding time range which is always visible)
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedEarningType !== null) count++;
    if (selectedPlatforms.size > 0) count++;
    if (selectedArtists.size > 0) count++;
    if (selectedTracks.length > 0) count++;
    return count;
  }, [selectedEarningType, selectedPlatforms, selectedArtists, selectedTracks]);

  const clearAllFilters = () => {
    setSelectedEarningType(null);
    setSelectedPlatforms(new Set());
    setSelectedArtists(new Set());
    setSelectedTracks([]);
  };

  // Get unique artists from transactions
  const artists = useMemo(() => {
    const artistSet = new Set<string>();
    for (const t of mockRecentTransactions) {
      if (t.artistName) {
        artistSet.add(t.artistName);
      }
    }
    return Array.from(artistSet).sort((a, b) => a.localeCompare(b));
  }, []);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return mockRecentTransactions.filter((transaction) => {
      if (
        selectedEarningType &&
        transaction.earningType !== selectedEarningType
      ) {
        return false;
      }
      if (selectedPlatforms.size > 0 && !selectedPlatforms.has(transaction.platform)) {
        return false;
      }
      // Filter by selected artists
      if (selectedArtists.size > 0 && transaction.artistName && !selectedArtists.has(transaction.artistName)) {
        return false;
      }
      // Filter by selected tracks
      if (selectedTracks.length > 0) {
        const trackName = transaction.trackName;
        const matchingTrack = mockEarningsTracks.find(t => t.name === trackName);
        if (!matchingTrack || !selectedTracks.includes(matchingTrack.id)) {
          return false;
        }
      }
      return true;
    });
  }, [selectedEarningType, selectedPlatforms, selectedArtists, selectedTracks]);

  // Top platforms first, then alphabetical
  const topPlatforms: DSP[] = [
    'spotify',
    'apple-music',
    'amazon',
    'youtube-music',
    'youtube-content-id',
    'tiktok',
    'instagram',
    'facebook',
    'deezer',
    'tidal',
  ];

  const otherPlatforms: DSP[] = [
    '7digital',
    'ami',
    'anghami',
    'audible-magic',
    'awa',
    'bmat',
    'boomplay',
    'fuga',
    'hungama',
    'iheartradio',
    'imusica',
    'inprodicon',
    'jaxsta',
    'kdigital',
    'kkbox',
    'kuack',
    'lissen',
    'netease',
    'nuuday',
    'pandora',
    'peloton',
    'qobuz',
    'saavn',
    'slacker-radio',
    'soundexchange',
    'synchtank',
    'tencent',
    'the-mlc',
    'trebel',
    'tuned-global',
    'youtube-shorts',
  ];

  const allPlatforms: DSP[] = [...topPlatforms, ...otherPlatforms];

  // Filter platforms based on search and showAllPlatforms state
  const filteredPlatforms = useMemo(() => {
    // If searching, search all platforms
    if (platformSearch.trim()) {
      const searchLower = platformSearch.toLowerCase();
      return allPlatforms.filter((platform) =>
        getPlatformName(platform).toLowerCase().includes(searchLower)
      );
    }
    // Otherwise, show top platforms or all based on toggle
    return showAllPlatforms ? allPlatforms : topPlatforms;
  }, [platformSearch, allPlatforms, showAllPlatforms]);

  // Helper functions for Releases & Tracks filter
  const toggleRelease = (releaseId: string) => {
    setExpandedReleases((prev) =>
      prev.includes(releaseId)
        ? prev.filter((id) => id !== releaseId)
        : [...prev, releaseId]
    );
  };

  const selectAllTracksInRelease = (releaseId: string) => {
    const release = mockEarningsReleases.find((r) => r.id === releaseId);
    if (!release?.trackIds) return;

    const releaseTrackIds = release.trackIds;
    const allSelected = releaseTrackIds.every((trackId) =>
      selectedTracks.includes(trackId)
    );

    if (allSelected) {
      setSelectedTracks(
        selectedTracks.filter((id) => !releaseTrackIds.includes(id))
      );
    } else {
      const newSelection = [
        ...new Set([...selectedTracks, ...releaseTrackIds]),
      ];
      setSelectedTracks(newSelection);
    }
  };

  const toggleTrack = (trackId: string) => {
    const newSelection = selectedTracks.includes(trackId)
      ? selectedTracks.filter((id) => id !== trackId)
      : [...selectedTracks, trackId];
    setSelectedTracks(newSelection);
  };

  const getTracksForRelease = (releaseId: string) => {
    return mockEarningsTracks.filter((track) => track.releaseId === releaseId);
  };

  const isReleaseFullySelected = (releaseId: string) => {
    const release = mockEarningsReleases.find((r) => r.id === releaseId);
    if (!release?.trackIds || release.trackIds.length === 0) return false;
    return release.trackIds.every((trackId) =>
      selectedTracks.includes(trackId)
    );
  };

  const isReleasePartiallySelected = (releaseId: string) => {
    const release = mockEarningsReleases.find((r) => r.id === releaseId);
    if (!release?.trackIds || release.trackIds.length === 0) return false;
    return (
      release.trackIds.some((trackId) => selectedTracks.includes(trackId)) &&
      !isReleaseFullySelected(releaseId)
    );
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1C1C1C' }}>
      {/* Page Header */}
      <div style={{ backgroundColor: '#1C1C1C' }}>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-2">
            <h1 className="text-4xl font-[var(--font-test-national-2-narrow)] font-bold uppercase">
              EARNINGS HISTORY
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              View your earnings activity and past payouts
            </p>
          </div>
        </div>
      </div>

      {/* Main Content - Side by Side Panels */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Recent Activity by Track */}
          <Card className="border-0">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">RECENT ACTIVITY BY TRACK</CardTitle>
                <div className="flex items-center gap-2">
                  {/* Time Range Toggle */}
                  <div className="border-border inline-flex flex-shrink-0 overflow-hidden rounded-lg border">
                    {(['30d', '90d', 'all'] as const).map((range) => (
                      <button
                        key={range}
                        onClick={() => setTimeRange(range)}
                        className="border-border border-r px-2 py-1 text-xs font-medium whitespace-nowrap transition-all duration-200 last:border-r-0"
                        style={{
                          backgroundColor:
                            timeRange === range ? '#52bcd6' : 'transparent',
                          color: timeRange === range ? 'white' : 'rgba(255, 255, 255, 0.7)',
                        }}
                      >
                        {range === '30d' && '30d'}
                        {range === '90d' && '90d'}
                        {range === 'all' && 'All'}
                      </button>
                    ))}
                  </div>
                  {/* More Filters Button */}
                  <button
                    onClick={() => setFiltersDrawerOpen(true)}
                    className="flex items-center gap-1.5 rounded-[3px] border px-2 py-1 text-xs font-medium transition-colors hover:bg-white/5"
                    style={{
                      borderColor: activeFilterCount > 0 ? '#52bcd6' : 'rgba(255, 255, 255, 0.2)',
                      color: activeFilterCount > 0 ? '#52bcd6' : 'rgba(255, 255, 255, 0.7)',
                    }}
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    <span>Filters</span>
                    {activeFilterCount > 0 && (
                      <span
                        className="rounded-full px-1.5 py-0.5 text-[10px] font-bold text-white"
                        style={{ backgroundColor: '#52bcd6' }}
                      >
                        {activeFilterCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between border-b border-gray-700 pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <PlatformIcon platform={transaction.platform} size="sm" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{transaction.trackName}</p>
                        <p className="text-muted-foreground text-xs">
                          {getEarningTypeLabel(transaction.earningType)} •{' '}
                          {getPlatformName(transaction.platform)} •{' '}
                          {new Date(transaction.date).toLocaleDateString(
                            'en-US',
                            {
                              month: 'short',
                              day: 'numeric',
                            }
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="text-right space-y-0.5">
                      <p className="text-sm font-bold">
                        {formatCurrency(transaction.amount)}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {transaction.streams
                          ? `${transaction.streams.toLocaleString()} streams`
                          : `${transaction.views?.toLocaleString()} views`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Right Panel - Payout History */}
          <Card className="border-0">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">PAYOUT HISTORY</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {mockPayoutHistory.map((payout) => (
                  <Link key={payout.id} href={`/earnings/payout/${payout.id}`}>
                    <div className="flex items-center justify-between rounded-[3px] border border-gray-700 p-4 transition-colors hover:border-gray-600">
                      <div>
                        <p className="font-medium">
                          Payout -{' '}
                          {new Date(payout.payoutDate).toLocaleDateString(
                            'en-US',
                            {
                              month: 'long',
                              year: 'numeric',
                            }
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="text-xl font-bold">
                          {formatCurrency(payout.netAmount)}
                        </p>
                        <ChevronRight className="text-muted-foreground h-5 w-5" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filters Drawer */}
      <Sheet open={filtersDrawerOpen} onOpenChange={setFiltersDrawerOpen}>
        <SheetContent
          side="right"
          className="w-full border-0 sm:max-w-lg overflow-y-auto"
          style={{ backgroundColor: COLORS.bgDark }}
        >
          <SheetHeader className="p-6">
            <SheetTitle className="text-2xl font-[var(--font-test-national-2-narrow)] font-bold uppercase">
              FILTER ACTIVITY
            </SheetTitle>
            <p className="text-muted-foreground text-sm mt-2">
              Filter recent activity by type, platform, artist, or release
            </p>
          </SheetHeader>

          <div className="space-y-6 px-6 pb-8">
            {activeFilterCount > 0 && (
              <div className="flex justify-end">
                <button
                  onClick={clearAllFilters}
                  className="text-xs font-medium"
                  style={{ color: COLORS.primary }}
                >
                  Clear all filters
                </button>
              </div>
            )}
            {/* Earning Type Filter */}
            <div>
              <p className="text-sm font-medium mb-3" style={{ color: COLORS.textWhite }}>
                Earning Type
              </p>
              <div className="space-y-2">
                {[
                  { value: null, label: 'All Types' },
                  { value: 'streaming' as EarningType, label: 'Streaming' },
                  { value: 'social-video' as EarningType, label: 'Social Video' },
                ].map((option) => (
                  <button
                    key={option.label}
                    onClick={() => setSelectedEarningType(option.value)}
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition-colors hover:bg-white/5"
                  >
                    <div
                      className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border"
                      style={{
                        backgroundColor: selectedEarningType === option.value ? COLORS.primary : 'transparent',
                        borderColor: selectedEarningType === option.value ? COLORS.primary : COLORS.borderGray,
                      }}
                    >
                      {selectedEarningType === option.value && (
                        <div className="h-2 w-2 rounded-full bg-white" />
                      )}
                    </div>
                    <span style={{ color: COLORS.textWhite }}>{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Platform Filter */}
            <div>
              <p className="text-sm font-medium mb-3" style={{ color: COLORS.textWhite }}>
                Platforms
                {selectedPlatforms.size > 0 && (
                  <span className="ml-2 text-xs" style={{ color: COLORS.primary }}>
                    ({selectedPlatforms.size} selected)
                  </span>
                )}
              </p>
              <div className="relative mb-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: COLORS.textGray }} />
                <input
                  type="text"
                  placeholder="Search platforms..."
                  value={platformSearch}
                  onChange={(e) => setPlatformSearch(e.target.value)}
                  className="w-full rounded-md border pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1"
                  style={{
                    backgroundColor: COLORS.bgInput,
                    borderColor: COLORS.borderGray,
                    color: COLORS.textWhite,
                  }}
                />
              </div>
              <div className="max-h-48 space-y-1 overflow-y-auto">
                {filteredPlatforms.length === 0 ? (
                  <p className="text-center text-sm py-4" style={{ color: COLORS.textGray }}>No platforms found</p>
                ) : (
                  filteredPlatforms.map((platform) => (
                    <button
                      key={platform}
                      onClick={() => {
                        const newSet = new Set(selectedPlatforms);
                        if (newSet.has(platform)) {
                          newSet.delete(platform);
                        } else {
                          newSet.add(platform);
                        }
                        setSelectedPlatforms(newSet);
                      }}
                      className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-white/5"
                    >
                      <div
                        className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border"
                        style={{
                          backgroundColor: selectedPlatforms.has(platform) ? COLORS.primary : 'transparent',
                          borderColor: selectedPlatforms.has(platform) ? COLORS.primary : COLORS.borderGray,
                        }}
                      >
                        {selectedPlatforms.has(platform) && (
                          <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span style={{ color: COLORS.textWhite }}>{getPlatformName(platform)}</span>
                    </button>
                  ))
                )}
              </div>
              {/* More platforms link - only show when not searching */}
              {!platformSearch.trim() && (
                <button
                  onClick={() => setShowAllPlatforms(!showAllPlatforms)}
                  className="mt-2 text-sm font-medium"
                  style={{ color: COLORS.primary }}
                >
                  {showAllPlatforms ? 'Show fewer platforms' : `More platforms (${otherPlatforms.length})`}
                </button>
              )}
            </div>

            {/* Artist Filter */}
            <div>
              <p className="text-sm font-medium mb-3" style={{ color: COLORS.textWhite }}>
                Artists
                {selectedArtists.size > 0 && (
                  <span className="ml-2 text-xs" style={{ color: COLORS.error }}>
                    ({selectedArtists.size} selected)
                  </span>
                )}
              </p>
              <div className="max-h-40 space-y-1 overflow-y-auto">
                {artists.map((artist) => (
                  <button
                    key={artist}
                    onClick={() => {
                      const newSet = new Set(selectedArtists);
                      if (newSet.has(artist)) {
                        newSet.delete(artist);
                      } else {
                        newSet.add(artist);
                      }
                      setSelectedArtists(newSet);
                    }}
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-white/5"
                  >
                    <div
                      className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border"
                      style={{
                        backgroundColor: selectedArtists.has(artist) ? COLORS.error : 'transparent',
                        borderColor: selectedArtists.has(artist) ? COLORS.error : COLORS.borderGray,
                      }}
                    >
                      {selectedArtists.has(artist) && (
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span style={{ color: COLORS.textWhite }}>{artist}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Releases & Tracks Filter */}
            <div>
              <p className="text-sm font-medium mb-3" style={{ color: COLORS.textWhite }}>
                Releases & Tracks
                {selectedTracks.length > 0 && (
                  <span className="ml-2 text-xs" style={{ color: COLORS.success }}>
                    ({selectedTracks.length} selected)
                  </span>
                )}
              </p>
              <div className="max-h-48 space-y-1 overflow-y-auto">
                {mockEarningsReleases.map((release) => {
                  const releaseTracks = getTracksForRelease(release.id);
                  const isExpanded = expandedReleases.includes(release.id);
                  const isFullySelected = isReleaseFullySelected(release.id);
                  const isPartiallySelected = isReleasePartiallySelected(release.id);
                  const isAlbum = release.type === 'album';

                  return (
                    <div key={release.id} className="space-y-1">
                      <div className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm transition-colors hover:bg-white/5">
                        {isAlbum ? (
                          <button
                            onClick={() => toggleRelease(release.id)}
                            className="flex-shrink-0 rounded p-0.5 hover:bg-white/10"
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4 text-white" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-white" />
                            )}
                          </button>
                        ) : (
                          <div className="w-5" />
                        )}
                        <button
                          onClick={() => selectAllTracksInRelease(release.id)}
                          className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border"
                          style={{
                            backgroundColor: isFullySelected ? COLORS.success : 'transparent',
                            borderColor: isFullySelected || isPartiallySelected ? COLORS.success : COLORS.borderGray,
                          }}
                        >
                          {isFullySelected && (
                            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                          {isPartiallySelected && (
                            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 12h14" />
                            </svg>
                          )}
                        </button>
                        <span className="font-medium text-white">
                          {release.name}
                          <span className="text-gray-400 ml-1 text-xs">
                            ({release.type === 'album' ? 'Album' : 'Single'})
                          </span>
                        </span>
                      </div>
                      {isAlbum && isExpanded && releaseTracks.length > 0 && (
                        <div className="space-y-1">
                          {releaseTracks.map((track) => (
                            <button
                              key={track.id}
                              onClick={() => toggleTrack(track.id)}
                              className="flex w-full items-center gap-2 rounded-md py-1.5 text-left text-sm transition-colors hover:bg-white/5"
                              style={{ paddingLeft: '2.5rem' }}
                            >
                              <div
                                className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border"
                                style={{
                                  backgroundColor: selectedTracks.includes(track.id) ? COLORS.success : 'transparent',
                                  borderColor: selectedTracks.includes(track.id) ? COLORS.success : COLORS.borderGray,
                                }}
                              >
                                {selectedTracks.includes(track.id) && (
                                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                              <span className="text-xs text-white">{track.name}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
