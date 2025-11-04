'use client';

import { useState } from 'react';
import { Calendar, ChevronDown, ChevronRight, X } from 'lucide-react';

import { Button } from '@/shared/components/shadcn/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/shadcn/popover';
import { Card, CardContent } from '@/shared/components/ui/card';

import type { TimeFrame, Artist, Release, DSP, Track } from '../mock-data';

interface FilterControlsProps {
  timeFrame: TimeFrame;
  onTimeFrameChange: (timeFrame: TimeFrame) => void;
  selectedArtist: string | null;
  onArtistChange: (artistId: string | null) => void;
  selectedRelease: string | null;
  onReleaseChange: (releaseId: string | null) => void;
  selectedTracks: string[];
  onTracksChange: (trackIds: string[]) => void;
  selectedDSP: DSP | null;
  onDSPChange: (dsp: DSP | null) => void;
  artists: Artist[];
  releases: Release[];
  tracks: Track[];
}

export function FilterControls({
  timeFrame,
  onTimeFrameChange,
  selectedArtist,
  onArtistChange,
  selectedRelease,
  onReleaseChange,
  selectedTracks,
  onTracksChange,
  selectedDSP,
  onDSPChange,
  artists,
  releases,
  tracks,
}: FilterControlsProps) {
  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);
  const [expandedReleases, setExpandedReleases] = useState<string[]>([]);
  const [selectedDSPs, setSelectedDSPs] = useState<DSP[]>([]);

  const timeFrameOptions: { value: TimeFrame; label: string }[] = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: 'ytd', label: 'Year to Date' },
    { value: 'custom', label: 'Custom Range' },
  ];

  const dspOptions: { value: DSP; label: string }[] = [
    { value: 'spotify', label: 'Spotify' },
    { value: 'apple-music', label: 'Apple Music' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'youtube-music', label: 'YouTube Music' },
    { value: 'youtube-content-id', label: 'YouTube Content ID' },
    { value: 'youtube-shorts', label: 'YouTube Shorts' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'amazon', label: 'Amazon Music' },
  ];

  const toggleArtist = (artistId: string) => {
    const newSelection = selectedArtists.includes(artistId)
      ? selectedArtists.filter((id) => id !== artistId)
      : [...selectedArtists, artistId];

    setSelectedArtists(newSelection);
    // For now, just use the first selected artist for the parent state
    onArtistChange(newSelection.length > 0 ? (newSelection[0] ?? null) : null);
  };

  const toggleRelease = (releaseId: string) => {
    // Toggle expanded state
    setExpandedReleases((prev) =>
      prev.includes(releaseId)
        ? prev.filter((id) => id !== releaseId)
        : [...prev, releaseId]
    );
  };

  const selectAllTracksInRelease = (releaseId: string) => {
    const release = releases.find((r) => r.id === releaseId);
    if (!release?.trackIds) return;

    const releaseTrackIds = release.trackIds;
    const allSelected = releaseTrackIds.every((trackId) =>
      selectedTracks.includes(trackId)
    );

    if (allSelected) {
      // Deselect all tracks in this release
      onTracksChange(
        selectedTracks.filter((id) => !releaseTrackIds.includes(id))
      );
    } else {
      // Select all tracks in this release
      const newSelection = [
        ...new Set([...selectedTracks, ...releaseTrackIds]),
      ];
      onTracksChange(newSelection);
    }
  };

  const toggleTrack = (trackId: string) => {
    const newSelection = selectedTracks.includes(trackId)
      ? selectedTracks.filter((id) => id !== trackId)
      : [...selectedTracks, trackId];

    onTracksChange(newSelection);
  };

  const toggleDSP = (dsp: DSP) => {
    const newSelection = selectedDSPs.includes(dsp)
      ? selectedDSPs.filter((d) => d !== dsp)
      : [...selectedDSPs, dsp];

    setSelectedDSPs(newSelection);
    // For now, just use the first selected DSP for the parent state
    onDSPChange(newSelection.length > 0 ? (newSelection[0] ?? null) : null);
  };

  const clearAllFilters = () => {
    setSelectedArtists([]);
    onTracksChange([]);
    setSelectedDSPs([]);
    onArtistChange(null);
    onReleaseChange(null);
    onDSPChange(null);
  };

  const getArtistName = (id: string) => {
    return artists.find((a) => a.id === id)?.name || '';
  };

  const getReleaseName = (id: string) => {
    return releases.find((r) => r.id === id)?.name || '';
  };

  const getTrackName = (id: string) => {
    return tracks.find((t) => t.id === id)?.name || '';
  };

  const getDSPLabel = (dsp: DSP) => {
    return dspOptions.find((d) => d.value === dsp)?.label || '';
  };

  const getTracksForRelease = (releaseId: string) => {
    return tracks.filter((track) => track.releaseId === releaseId);
  };

  const isReleaseFullySelected = (releaseId: string) => {
    const release = releases.find((r) => r.id === releaseId);
    if (!release?.trackIds || release.trackIds.length === 0) return false;
    return release.trackIds.every((trackId) =>
      selectedTracks.includes(trackId)
    );
  };

  const isReleasePartiallySelected = (releaseId: string) => {
    const release = releases.find((r) => r.id === releaseId);
    if (!release?.trackIds || release.trackIds.length === 0) return false;
    return (
      release.trackIds.some((trackId) => selectedTracks.includes(trackId)) &&
      !isReleaseFullySelected(releaseId)
    );
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          {/* Time Frame Selector - Left Side */}
          <div className="border-border inline-flex overflow-hidden rounded-lg border">
            {timeFrameOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onTimeFrameChange(option.value)}
                className="border-border hover:bg-muted/50 border-r px-3 py-1.5 text-sm font-medium transition-all duration-200 last:border-r-0"
                style={{
                  backgroundColor:
                    timeFrame === option.value ? '#52bcd6' : 'transparent',
                  color:
                    timeFrame === option.value
                      ? 'white'
                      : 'rgba(255, 255, 255, 0.7)',
                }}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Filter Chips - Right Side */}
          <div className="flex items-center gap-2">
            {/* Artist Filter Chip */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 gap-2"
                  style={{
                    backgroundColor:
                      selectedArtists.length > 0 ? '#606bf8' : 'transparent',
                    color:
                      selectedArtists.length > 0
                        ? 'white'
                        : 'rgba(255, 255, 255, 0.7)',
                    borderColor:
                      selectedArtists.length > 0 ? '#606bf8' : undefined,
                  }}
                >
                  Artists
                  {selectedArtists.length > 0 && (
                    <span className="ml-1 rounded-full bg-white/20 px-1.5 py-0.5 text-xs font-bold">
                      {selectedArtists.length}
                    </span>
                  )}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-2" align="start">
                <div className="max-h-64 space-y-1 overflow-y-auto">
                  {artists.map((artist) => (
                    <button
                      key={artist.id}
                      onClick={() => toggleArtist(artist.id)}
                      className="hover:bg-muted flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors"
                    >
                      <div
                        className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border"
                        style={{
                          backgroundColor: selectedArtists.includes(artist.id)
                            ? '#606bf8'
                            : 'transparent',
                          borderColor: selectedArtists.includes(artist.id)
                            ? '#606bf8'
                            : 'rgba(255, 255, 255, 0.3)',
                        }}
                      >
                        {selectedArtists.includes(artist.id) && (
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
                      <span>{artist.name}</span>
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* Release Filter Chip - Hierarchical */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 gap-2"
                  style={{
                    backgroundColor:
                      selectedTracks.length > 0 ? '#7fc832' : 'transparent',
                    color:
                      selectedTracks.length > 0
                        ? 'white'
                        : 'rgba(255, 255, 255, 0.7)',
                    borderColor:
                      selectedTracks.length > 0 ? '#7fc832' : undefined,
                  }}
                >
                  Releases & Tracks
                  {selectedTracks.length > 0 && (
                    <span className="ml-1 rounded-full bg-white/20 px-1.5 py-0.5 text-xs font-bold">
                      {selectedTracks.length}
                    </span>
                  )}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-2" align="start">
                <div className="max-h-96 space-y-1 overflow-y-auto">
                  {releases.map((release) => {
                    const releaseTracks = getTracksForRelease(release.id);
                    const isExpanded = expandedReleases.includes(release.id);
                    const isFullySelected = isReleaseFullySelected(release.id);
                    const isPartiallySelected = isReleasePartiallySelected(
                      release.id
                    );
                    const isSingle = release.type === 'single';
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
              </PopoverContent>
            </Popover>

            {/* DSP/Platform Filter Chip */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 gap-2"
                  style={{
                    backgroundColor:
                      selectedDSPs.length > 0 ? '#ff386a' : 'transparent',
                    color:
                      selectedDSPs.length > 0
                        ? 'white'
                        : 'rgba(255, 255, 255, 0.7)',
                    borderColor:
                      selectedDSPs.length > 0 ? '#ff386a' : undefined,
                  }}
                >
                  Platforms
                  {selectedDSPs.length > 0 && (
                    <span className="ml-1 rounded-full bg-white/20 px-1.5 py-0.5 text-xs font-bold">
                      {selectedDSPs.length}
                    </span>
                  )}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-2" align="start">
                <div className="max-h-64 space-y-1 overflow-y-auto">
                  {dspOptions.map((dsp) => (
                    <button
                      key={dsp.value}
                      onClick={() => toggleDSP(dsp.value)}
                      className="hover:bg-muted flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors"
                    >
                      <div
                        className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border"
                        style={{
                          backgroundColor: selectedDSPs.includes(dsp.value)
                            ? '#ff386a'
                            : 'transparent',
                          borderColor: selectedDSPs.includes(dsp.value)
                            ? '#ff386a'
                            : 'rgba(255, 255, 255, 0.3)',
                        }}
                      >
                        {selectedDSPs.includes(dsp.value) && (
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
                      <span>{dsp.label}</span>
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* Clear All Button (only show if filters are active) */}
            {(selectedArtists.length > 0 ||
              selectedTracks.length > 0 ||
              selectedDSPs.length > 0) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-muted-foreground hover:text-foreground h-9 gap-1"
              >
                <X className="h-4 w-4" />
                Clear All
              </Button>
            )}
          </div>
        </div>

        {/* Active Filter Chips */}
        {(selectedArtists.length > 0 ||
          selectedTracks.length > 0 ||
          selectedDSPs.length > 0) && (
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedArtists.map((artistId) => (
              <button
                key={artistId}
                onClick={() => toggleArtist(artistId)}
                className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs transition-colors"
                style={{ backgroundColor: '#606bf8', color: 'white' }}
              >
                {getArtistName(artistId)}
                <X className="h-3 w-3" />
              </button>
            ))}
            {selectedTracks.map((trackId) => (
              <button
                key={trackId}
                onClick={() => toggleTrack(trackId)}
                className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs transition-colors"
                style={{ backgroundColor: '#7fc832', color: 'white' }}
              >
                {getTrackName(trackId)}
                <X className="h-3 w-3" />
              </button>
            ))}
            {selectedDSPs.map((dsp) => (
              <button
                key={dsp}
                onClick={() => toggleDSP(dsp)}
                className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs transition-colors"
                style={{ backgroundColor: '#ff386a', color: 'white' }}
              >
                {getDSPLabel(dsp)}
                <X className="h-3 w-3" />
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
