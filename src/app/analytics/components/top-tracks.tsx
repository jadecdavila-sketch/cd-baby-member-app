'use client';

import { useState } from 'react';
import { Music, TrendingUp, Search } from 'lucide-react';
import Image from 'next/image';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Button } from '@/shared/components/shadcn/button';

import type { Track, MetricType } from '../mock-data';
import { getMetricLabel, formatNumber } from '../mock-data';

interface TopTracksProps {
  tracks: Track[];
}

export function TopTracks({ tracks }: TopTracksProps) {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('streams');
  const [searchQuery, setSearchQuery] = useState('');

  const metricOptions: MetricType[] = ['streams', 'creations', 'views'];

  const getColor = (metric: MetricType) => {
    switch (metric) {
      case 'streams':
        return 'var(--cdbaby-light-blue)';
      case 'creations':
        return 'var(--cdbaby-purple)';
      case 'views':
        return 'var(--cdbaby-green)';
      default:
        return 'var(--cdbaby-light-blue)';
    }
  };

  // Filter tracks by search query
  const filteredTracks = tracks.filter(
    (track) =>
      track.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort filtered tracks by selected metric
  const sortedTracks = [...filteredTracks].sort(
    (a, b) => b[selectedMetric] - a[selectedMetric]
  );

  return (
    <Card>
      <CardHeader>
        <div className="space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Music className="h-5 w-5" />
              <CardTitle>Top Tracks</CardTitle>
            </div>
            <div className="border-border inline-flex flex-shrink-0 overflow-hidden rounded-lg border">
              {metricOptions.map((metric) => (
                <button
                  key={metric}
                  onClick={() => setSelectedMetric(metric)}
                  className="border-border border-r px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-all duration-200 last:border-r-0"
                  style={{
                    backgroundColor:
                      selectedMetric === metric
                        ? getColor(metric)
                        : 'transparent',
                    color:
                      selectedMetric === metric
                        ? 'white'
                        : 'rgba(255, 255, 255, 0.7)',
                  }}
                >
                  {getMetricLabel(metric)}
                </button>
              ))}
            </div>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tracks or artists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-muted/50 border-border placeholder:text-muted-foreground w-full rounded-lg border px-10 py-2 text-sm transition-colors focus:border-[var(--cdbaby-light-blue)] focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 text-xs font-medium transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedTracks.map((track, index) => {
            const value = track[selectedMetric];

            return (
              <div
                key={track.id}
                onClick={() =>
                  track.trackUrl && window.open(track.trackUrl, '_blank')
                }
                className={`group flex items-center gap-4 rounded-lg p-3 transition-all duration-300 ${
                  track.trackUrl ? 'hover:bg-muted/50 cursor-pointer' : ''
                }`}
              >
                {/* Rank */}
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center">
                  {index === 0 ? (
                    <TrendingUp className="h-5 w-5 text-[var(--cdbaby-green)]" />
                  ) : (
                    <span className="text-muted-foreground text-sm font-bold">
                      #{index + 1}
                    </span>
                  )}
                </div>

                {/* Album Art */}
                <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md">
                  <Image
                    src={track.artworkUrl}
                    alt={track.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>

                {/* Track Info */}
                <div className="min-w-0 flex-1">
                  <p
                    className={`truncate font-semibold ${track.trackUrl ? 'underline' : ''}`}
                  >
                    {track.name}
                  </p>
                  <p className="text-muted-foreground truncate text-sm">
                    {track.artist}
                  </p>
                </div>

                {/* Metric Value */}
                <div className="flex-shrink-0 text-right">
                  <p
                    className="font-bold"
                    style={{ color: getColor(selectedMetric) }}
                  >
                    {formatNumber(value)}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {getMetricLabel(selectedMetric)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
