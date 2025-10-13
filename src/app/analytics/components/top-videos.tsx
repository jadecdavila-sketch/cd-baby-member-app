'use client';

import { useState } from 'react';
import { Video as VideoIcon, ExternalLink, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/shadcn/button';
import type { Video, MetricType } from '../mock-data';
import { getMetricLabel, formatNumber } from '../mock-data';
import Image from 'next/image';

interface TopVideosProps {
  videos: Video[];
}

export function TopVideos({ videos }: TopVideosProps) {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('creations');

  const metricOptions: MetricType[] = ['creations', 'views', 'likes', 'shares'];

  const getColor = (metric: MetricType) => {
    switch (metric) {
      case 'creations':
        return 'var(--cdbaby-purple)';
      case 'views':
        return 'var(--cdbaby-green)';
      case 'likes':
        return 'var(--cdbaby-pink)';
      case 'shares':
        return 'var(--cdbaby-orange)';
      default:
        return 'var(--cdbaby-purple)';
    }
  };

  const getPlatformBadgeColor = (platform: string) => {
    switch (platform) {
      case 'tiktok':
        return 'bg-black text-white';
      case 'instagram':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'youtube-shorts':
        return 'bg-red-600 text-white';
      case 'facebook':
        return 'bg-blue-600 text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getPlatformName = (platform: string) => {
    switch (platform) {
      case 'tiktok':
        return 'TikTok';
      case 'instagram':
        return 'Instagram';
      case 'youtube-shorts':
        return 'YouTube Shorts';
      case 'facebook':
        return 'Facebook';
      default:
        return platform;
    }
  };

  // Sort videos by selected metric
  const sortedVideos = [...videos].sort(
    (a, b) => b[selectedMetric] - a[selectedMetric]
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <VideoIcon className="h-5 w-5" />
            <CardTitle>Top Videos</CardTitle>
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sortedVideos.map((video, index) => {
            const value = video[selectedMetric];

            return (
              <div
                key={video.id}
                className="group relative overflow-hidden rounded-lg border transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                {/* Rank Badge */}
                {index === 0 && (
                  <div className="absolute left-2 top-2 z-10 flex items-center gap-1 rounded-full bg-[var(--cdbaby-green)] px-2 py-1 text-xs font-bold text-white">
                    <TrendingUp className="h-3 w-3" />
                    #1
                  </div>
                )}

                {/* Thumbnail */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                  <Image
                    src={video.thumbnailUrl}
                    alt={video.trackName}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Platform Badge */}
                  <div className="absolute bottom-2 right-2">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${getPlatformBadgeColor(video.platform)}`}
                    >
                      {getPlatformName(video.platform)}
                    </span>
                  </div>
                </div>

                {/* Video Info */}
                <div className="p-4">
                  <h4 className="mb-1 truncate font-semibold">{video.trackName}</h4>
                  <p className="mb-3 truncate text-sm text-muted-foreground">
                    by {video.creator}
                  </p>

                  {/* Metrics */}
                  <div className="mb-3 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-muted-foreground">Views</p>
                      <p className="font-bold">{formatNumber(video.views)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Creations</p>
                      <p className="font-bold">{formatNumber(video.creations)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Likes</p>
                      <p className="font-bold">{formatNumber(video.likes)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Shares</p>
                      <p className="font-bold">{formatNumber(video.shares)}</p>
                    </div>
                  </div>

                  {/* View Video Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => window.open(video.videoUrl, '_blank')}
                  >
                    <ExternalLink className="mr-2 h-3 w-3" />
                    View Video
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
