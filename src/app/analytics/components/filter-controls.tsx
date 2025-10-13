'use client';

import { useState } from 'react';
import { Calendar, ChevronDown, X } from 'lucide-react';
import { Button } from '@/shared/components/shadcn/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/shadcn/popover';
import { Card, CardContent } from '@/shared/components/ui/card';
import type { TimeFrame, Artist, Release, DSP } from '../mock-data';

interface FilterControlsProps {
  timeFrame: TimeFrame;
  onTimeFrameChange: (timeFrame: TimeFrame) => void;
  selectedArtist: string | null;
  onArtistChange: (artistId: string | null) => void;
  selectedRelease: string | null;
  onReleaseChange: (releaseId: string | null) => void;
  selectedDSP: DSP | null;
  onDSPChange: (dsp: DSP | null) => void;
  artists: Artist[];
  releases: Release[];
}

export function FilterControls({
  timeFrame,
  onTimeFrameChange,
  selectedArtist,
  onArtistChange,
  selectedRelease,
  onReleaseChange,
  selectedDSP,
  onDSPChange,
  artists,
  releases,
}: FilterControlsProps) {
  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);
  const [selectedReleases, setSelectedReleases] = useState<string[]>([]);
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
    onArtistChange(newSelection.length > 0 ? newSelection[0] : null);
  };

  const toggleRelease = (releaseId: string) => {
    const newSelection = selectedReleases.includes(releaseId)
      ? selectedReleases.filter((id) => id !== releaseId)
      : [...selectedReleases, releaseId];

    setSelectedReleases(newSelection);
    // For now, just use the first selected release for the parent state
    onReleaseChange(newSelection.length > 0 ? newSelection[0] : null);
  };

  const toggleDSP = (dsp: DSP) => {
    const newSelection = selectedDSPs.includes(dsp)
      ? selectedDSPs.filter((d) => d !== dsp)
      : [...selectedDSPs, dsp];

    setSelectedDSPs(newSelection);
    // For now, just use the first selected DSP for the parent state
    onDSPChange(newSelection.length > 0 ? newSelection[0] : null);
  };

  const clearAllFilters = () => {
    setSelectedArtists([]);
    setSelectedReleases([]);
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

  const getDSPLabel = (dsp: DSP) => {
    return dspOptions.find((d) => d.value === dsp)?.label || '';
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          {/* Time Frame Selector - Left Side */}
          <div className="inline-flex rounded-lg border border-border overflow-hidden">
            {timeFrameOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onTimeFrameChange(option.value)}
                className="px-3 py-1.5 text-sm font-medium transition-all duration-200 border-r border-border last:border-r-0 hover:bg-muted/50"
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
                    selectedArtists.length > 0 ? 'white' : 'rgba(255, 255, 255, 0.7)',
                  borderColor: selectedArtists.length > 0 ? '#606bf8' : undefined,
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
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {artists.map((artist) => (
                  <button
                    key={artist.id}
                    onClick={() => toggleArtist(artist.id)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors text-left"
                  >
                    <div
                      className="h-4 w-4 rounded border flex items-center justify-center flex-shrink-0"
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

          {/* Release Filter Chip */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-2"
                style={{
                  backgroundColor:
                    selectedReleases.length > 0 ? '#7fc832' : 'transparent',
                  color:
                    selectedReleases.length > 0 ? 'white' : 'rgba(255, 255, 255, 0.7)',
                  borderColor: selectedReleases.length > 0 ? '#7fc832' : undefined,
                }}
              >
                Releases
                {selectedReleases.length > 0 && (
                  <span className="ml-1 rounded-full bg-white/20 px-1.5 py-0.5 text-xs font-bold">
                    {selectedReleases.length}
                  </span>
                )}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2" align="start">
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {releases.map((release) => (
                  <button
                    key={release.id}
                    onClick={() => toggleRelease(release.id)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors text-left"
                  >
                    <div
                      className="h-4 w-4 rounded border flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: selectedReleases.includes(release.id)
                          ? '#7fc832'
                          : 'transparent',
                        borderColor: selectedReleases.includes(release.id)
                          ? '#7fc832'
                          : 'rgba(255, 255, 255, 0.3)',
                      }}
                    >
                      {selectedReleases.includes(release.id) && (
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
                    <span>{release.name}</span>
                  </button>
                ))}
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
                    selectedDSPs.length > 0 ? 'white' : 'rgba(255, 255, 255, 0.7)',
                  borderColor: selectedDSPs.length > 0 ? '#ff386a' : undefined,
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
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {dspOptions.map((dsp) => (
                  <button
                    key={dsp.value}
                    onClick={() => toggleDSP(dsp.value)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors text-left"
                  >
                    <div
                      className="h-4 w-4 rounded border flex items-center justify-center flex-shrink-0"
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
            selectedReleases.length > 0 ||
            selectedDSPs.length > 0) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="h-9 gap-1 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
              Clear All
            </Button>
          )}
          </div>
        </div>

        {/* Active Filter Chips */}
        {(selectedArtists.length > 0 ||
          selectedReleases.length > 0 ||
          selectedDSPs.length > 0) && (
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedArtists.map((artistId) => (
              <button
                key={artistId}
                onClick={() => toggleArtist(artistId)}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full transition-colors"
                style={{ backgroundColor: '#606bf8', color: 'white' }}
              >
                {getArtistName(artistId)}
                <X className="h-3 w-3" />
              </button>
            ))}
            {selectedReleases.map((releaseId) => (
              <button
                key={releaseId}
                onClick={() => toggleRelease(releaseId)}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full transition-colors"
                style={{ backgroundColor: '#7fc832', color: 'white' }}
              >
                {getReleaseName(releaseId)}
                <X className="h-3 w-3" />
              </button>
            ))}
            {selectedDSPs.map((dsp) => (
              <button
                key={dsp}
                onClick={() => toggleDSP(dsp)}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full transition-colors"
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
