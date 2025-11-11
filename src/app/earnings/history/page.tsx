'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronDown } from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/shadcn/popover';
import { Button } from '@/shared/components/shadcn/button';

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
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
  const [expandedReleases, setExpandedReleases] = useState<string[]>([]);

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
  }, [selectedEarningType, selectedPlatforms, selectedTracks]);

  // Get unique platforms from transactions
  const platforms = Array.from(
    new Set(mockRecentTransactions.map((t) => t.platform))
  );

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

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Filters */}
          <Card className="border-0">
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-4 justify-between">
                {/* Time Range */}
                <div>
                  <label className="text-muted-foreground mb-2 block text-sm font-medium">
                    Time Range
                  </label>
                  <div className="border-border inline-flex flex-shrink-0 overflow-hidden rounded-lg border">
                    {(['30d', '90d', 'all'] as const).map((range) => (
                      <button
                        key={range}
                        onClick={() => setTimeRange(range)}
                        className="border-border border-r px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-all duration-200 last:border-r-0"
                        style={{
                          backgroundColor:
                            timeRange === range ? '#52bcd6' : 'transparent',
                          color: timeRange === range ? 'white' : 'rgba(255, 255, 255, 0.7)',
                        }}
                      >
                        {range === '30d' && 'Last 30 Days'}
                        {range === '90d' && 'Last 90 Days'}
                        {range === 'all' && 'All Time'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right-aligned dropdown filters */}
                <div className="flex flex-wrap gap-4">
                  {/* Earning Type Filter */}
                  <div>
                  <label className="text-muted-foreground mb-2 block text-sm font-medium">
                    Earning Type
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 gap-2 justify-between"
                        style={{
                          backgroundColor:
                            selectedEarningType !== null ? '#52bcd6' : 'transparent',
                          color:
                            selectedEarningType !== null
                              ? 'white'
                              : 'rgba(255, 255, 255, 0.7)',
                          borderColor:
                            selectedEarningType !== null ? '#52bcd6' : undefined,
                          minWidth: '140px',
                        }}
                      >
                        <span>
                          {selectedEarningType === null && 'All Types'}
                          {selectedEarningType === 'streaming' && 'Streaming'}
                          {selectedEarningType === 'social-video' && 'Social Video'}
                        </span>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-2" align="start">
                      <div className="space-y-1">
                        <button
                          onClick={() => setSelectedEarningType(null)}
                          className="hover:bg-muted flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors"
                        >
                          <div
                            className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border"
                            style={{
                              backgroundColor: selectedEarningType === null
                                ? '#52bcd6'
                                : 'transparent',
                              borderColor: selectedEarningType === null
                                ? '#52bcd6'
                                : 'rgba(255, 255, 255, 0.3)',
                            }}
                          >
                            {selectedEarningType === null && (
                              <svg
                                className="h-3 w-3 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={3}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </div>
                          <span>All Types</span>
                        </button>
                        <button
                          onClick={() => setSelectedEarningType('streaming')}
                          className="hover:bg-muted flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors"
                        >
                          <div
                            className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border"
                            style={{
                              backgroundColor: selectedEarningType === 'streaming'
                                ? '#52bcd6'
                                : 'transparent',
                              borderColor: selectedEarningType === 'streaming'
                                ? '#52bcd6'
                                : 'rgba(255, 255, 255, 0.3)',
                            }}
                          >
                            {selectedEarningType === 'streaming' && (
                              <svg
                                className="h-3 w-3 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={3}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </div>
                          <span>Streaming</span>
                        </button>
                        <button
                          onClick={() => setSelectedEarningType('social-video')}
                          className="hover:bg-muted flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors"
                        >
                          <div
                            className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border"
                            style={{
                              backgroundColor: selectedEarningType === 'social-video'
                                ? '#52bcd6'
                                : 'transparent',
                              borderColor: selectedEarningType === 'social-video'
                                ? '#52bcd6'
                                : 'rgba(255, 255, 255, 0.3)',
                            }}
                          >
                            {selectedEarningType === 'social-video' && (
                              <svg
                                className="h-3 w-3 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={3}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </div>
                          <span>Social Video</span>
                        </button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Platform Filter */}
                <div>
                  <label className="text-muted-foreground mb-2 block text-sm font-medium">
                    Platform
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 gap-2 justify-between"
                        style={{
                          backgroundColor:
                            selectedPlatforms.size > 0 ? '#52bcd6' : 'transparent',
                          color:
                            selectedPlatforms.size > 0
                              ? 'white'
                              : 'rgba(255, 255, 255, 0.7)',
                          borderColor:
                            selectedPlatforms.size > 0 ? '#52bcd6' : undefined,
                          minWidth: '140px',
                        }}
                      >
                        <span>
                          Platforms
                          {selectedPlatforms.size > 0 && (
                            <span className="ml-2 rounded-full bg-white/20 px-1.5 py-0.5 text-xs font-bold">
                              {selectedPlatforms.size}
                            </span>
                          )}
                        </span>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-2" align="start">
                      <div className="max-h-64 space-y-1 overflow-y-auto">
                        {platforms.map((platform) => (
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
                            className="hover:bg-muted flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors"
                          >
                            <div
                              className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border"
                              style={{
                                backgroundColor: selectedPlatforms.has(platform)
                                  ? '#52bcd6'
                                  : 'transparent',
                                borderColor: selectedPlatforms.has(platform)
                                  ? '#52bcd6'
                                  : 'rgba(255, 255, 255, 0.3)',
                              }}
                            >
                              {selectedPlatforms.has(platform) && (
                                <svg
                                  className="h-3 w-3 text-white"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              )}
                            </div>
                            <span>{getPlatformName(platform)}</span>
                          </button>
                        ))}
                      </div>
                      {selectedPlatforms.size > 0 && (
                        <div className="border-t border-gray-700 pt-2 mt-2">
                          <button
                            onClick={() => setSelectedPlatforms(new Set())}
                            className="text-xs w-full text-center py-1"
                            style={{ color: '#52bcd6' }}
                          >
                            Clear all
                          </button>
                        </div>
                      )}
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Releases & Tracks Filter */}
                <div>
                  <label className="text-muted-foreground mb-2 block text-sm font-medium">
                    Releases & Tracks
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 gap-2 justify-between"
                        style={{
                          backgroundColor:
                            selectedTracks.length > 0 ? '#7fc832' : 'transparent',
                          color:
                            selectedTracks.length > 0
                              ? 'white'
                              : 'rgba(255, 255, 255, 0.7)',
                          borderColor:
                            selectedTracks.length > 0 ? '#7fc832' : undefined,
                          minWidth: '180px',
                        }}
                      >
                        <span>
                          Releases & Tracks
                          {selectedTracks.length > 0 && (
                            <span className="ml-2 rounded-full bg-white/20 px-1.5 py-0.5 text-xs font-bold">
                              {selectedTracks.length}
                            </span>
                          )}
                        </span>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-2" align="start">
                      <div className="max-h-96 space-y-1 overflow-y-auto">
                        {mockEarningsReleases.map((release) => {
                          const releaseTracks = getTracksForRelease(release.id);
                          const isExpanded = expandedReleases.includes(release.id);
                          const isFullySelected = isReleaseFullySelected(release.id);
                          const isPartiallySelected = isReleasePartiallySelected(
                            release.id
                          );
                          const isAlbum = release.type === 'album';

                          return (
                            <div key={release.id} className="space-y-1">
                              {/* Release Row */}
                              <div className="hover:bg-muted flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm transition-colors">
                                {/* Expand/Collapse Button (only for albums) */}
                                {isAlbum ? (
                                  <button
                                    onClick={() => toggleRelease(release.id)}
                                    className="flex-shrink-0 rounded p-0.5 hover:bg-white/10"
                                  >
                                    {isExpanded ? (
                                      <ChevronDown className="h-4 w-4" />
                                    ) : (
                                      <ChevronRight className="h-4 w-4" />
                                    )}
                                  </button>
                                ) : (
                                  <div className="w-5" />
                                )}

                                {/* Select All Checkbox */}
                                <button
                                  onClick={() => selectAllTracksInRelease(release.id)}
                                  className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border"
                                  style={{
                                    backgroundColor: isFullySelected
                                      ? '#7fc832'
                                      : 'transparent',
                                    borderColor:
                                      isFullySelected || isPartiallySelected
                                        ? '#7fc832'
                                        : 'rgba(255, 255, 255, 0.3)',
                                  }}
                                >
                                  {isFullySelected && (
                                    <svg
                                      className="h-3 w-3 text-white"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={3}
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                  )}
                                  {isPartiallySelected && (
                                    <svg
                                      className="h-3 w-3 text-white"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={3}
                                        d="M5 12h14"
                                      />
                                    </svg>
                                  )}
                                </button>

                                <span className="font-medium">
                                  {release.name}
                                  <span className="text-muted-foreground ml-1 text-xs">
                                    ({release.type === 'album' ? 'Album' : 'Single'})
                                  </span>
                                </span>
                              </div>

                              {/* Nested Tracks (only for albums when expanded) */}
                              {isAlbum && isExpanded && releaseTracks.length > 0 && (
                                <div className="space-y-1">
                                  {releaseTracks.map((track) => (
                                    <button
                                      key={track.id}
                                      onClick={() => toggleTrack(track.id)}
                                      className="hover:bg-muted flex w-full items-center gap-2 rounded-md py-1.5 text-left text-sm transition-colors"
                                      style={{ paddingLeft: '2.5rem' }}
                                    >
                                      <div
                                        className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border"
                                        style={{
                                          backgroundColor: selectedTracks.includes(
                                            track.id
                                          )
                                            ? '#7fc832'
                                            : 'transparent',
                                          borderColor: selectedTracks.includes(
                                            track.id
                                          )
                                            ? '#7fc832'
                                            : 'rgba(255, 255, 255, 0.3)',
                                        }}
                                      >
                                        {selectedTracks.includes(track.id) && (
                                          <svg
                                            className="h-3 w-3 text-white"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={3}
                                              d="M5 13l4 4L19 7"
                                            />
                                          </svg>
                                        )}
                                      </div>
                                      <span className="text-xs">{track.name}</span>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      {selectedTracks.length > 0 && (
                        <div className="border-t border-gray-700 pt-2 mt-2">
                          <button
                            onClick={() => setSelectedTracks([])}
                            className="text-xs w-full text-center py-1"
                            style={{ color: '#7fc832' }}
                          >
                            Clear all
                          </button>
                        </div>
                      )}
                    </PopoverContent>
                  </Popover>
                </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card className="border-0">
            <CardHeader>
              <CardTitle className="text-base">RECENT ACTIVITY</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between border-b border-gray-700 pb-6 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-4">
                      <PlatformIcon platform={transaction.platform} size="md" />
                      <div className="space-y-1.5">
                        <p className="font-medium">{transaction.trackName}</p>
                        <p className="text-muted-foreground text-xs">
                          {getEarningTypeLabel(transaction.earningType)} •{' '}
                          {getPlatformName(transaction.platform)} •{' '}
                          {new Date(transaction.date).toLocaleDateString(
                            'en-US',
                            {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            }
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="font-bold">
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

          {/* Payout History */}
          <Card className="border-0">
            <CardHeader>
              <CardTitle className="text-base">PAYOUT HISTORY</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
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
                        <p className="text-muted-foreground text-sm">
                          {new Date(payout.periodStart).toLocaleDateString(
                            'en-US',
                            {
                              month: 'short',
                              day: 'numeric',
                            }
                          )}{' '}
                          -{' '}
                          {new Date(payout.periodEnd).toLocaleDateString(
                            'en-US',
                            {
                              month: 'short',
                              day: 'numeric',
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
    </div>
  );
}
