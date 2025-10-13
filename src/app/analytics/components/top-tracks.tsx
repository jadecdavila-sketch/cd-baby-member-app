'use client';

import { useState } from 'react';
import { Music, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/shadcn/button';
import type { Track, MetricType } from '../mock-data';
import { getMetricLabel, formatNumber } from '../mock-data';
import Image from 'next/image';

interface TopTracksProps {
  tracks: Track[];
}

export function TopTracks({ tracks }: TopTracksProps) {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('streams');

  const metricOptions: MetricType[] = ['streams', 'creations', 'views', 'likes', 'shares'];

  const getColor = (metric: MetricType) => {
    switch (metric) {
      case 'streams':
        return 'var(--cdbaby-light-blue)';
      case 'creations':
        return 'var(--cdbaby-purple)';
      case 'views':
        return 'var(--cdbaby-green)';
      case 'likes':
        return 'var(--cdbaby-pink)';
      case 'shares':
        return 'var(--cdbaby-orange)';
      default:
        return 'var(--cdbaby-light-blue)';
    }
  };

  // Sort tracks by selected metric
  const sortedTracks = [...tracks].sort(
    (a, b) => b[selectedMetric] - a[selectedMetric]
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            <CardTitle>Top Tracks</CardTitle>
          </div>
          <div className="inline-flex rounded-lg border border-border overflow-hidden flex-shrink-0">
            {metricOptions.map((metric) => (
              <button
                key={metric}
                onClick={() => setSelectedMetric(metric)}
                className="px-3 py-1.5 text-sm font-medium transition-all duration-200 border-r border-border last:border-r-0 whitespace-nowrap"
                style={{
                  backgroundColor: selectedMetric === metric ? getColor(metric) : 'transparent',
                  color: selectedMetric === metric ? 'white' : 'rgba(255, 255, 255, 0.7)',
                }}
              >
                {getMetricLabel(metric)}
              </button>
            ))}
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
                className="group flex items-center gap-4 rounded-lg p-3 transition-all duration-300 hover:bg-muted/50"
              >
                {/* Rank */}
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center">
                  {index === 0 ? (
                    <TrendingUp className="h-5 w-5 text-[var(--cdbaby-green)]" />
                  ) : (
                    <span className="text-sm font-bold text-muted-foreground">
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
                <div className="flex-1 min-w-0">
                  <p className="truncate font-semibold">{track.name}</p>
                  <p className="truncate text-sm text-muted-foreground">
                    {track.artist}
                  </p>
                </div>

                {/* Metric Value */}
                <div className="flex-shrink-0 text-right">
                  <p className="font-bold" style={{ color: getColor(selectedMetric) }}>
                    {formatNumber(value)}
                  </p>
                  <p className="text-xs text-muted-foreground">
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
