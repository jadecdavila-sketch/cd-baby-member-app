'use client';

import { useState } from 'react';
import { Video as VideoIcon, ExternalLink, TrendingUp } from 'lucide-react';
import Image from 'next/image';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Button } from '@/shared/components/shadcn/button';

import type { Video, MetricType } from '../mock-data';
import { getMetricLabel, formatNumber } from '../mock-data';

interface TopVideosProps {
  videos: Video[];
}

export function TopVideos({ videos }: TopVideosProps) {
  type VideoMetricType = 'creations' | 'views' | 'likes' | 'shares';
  const [selectedMetric, setSelectedMetric] =
    useState<VideoMetricType>('creations');

  const metricOptions: VideoMetricType[] = [
    'creations',
    'views',
    'likes',
    'shares',
  ];

  const getColor = (metric: VideoMetricType) => {
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
      </CardHeader>
      <CardContent>
        {sortedVideos.length === 0 ? (
          // Empty State - No Videos Yet
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-[var(--cdbaby-purple)]/30 bg-[var(--cdbaby-purple)]/5 p-12 text-center">
            <div className="mb-4 rounded-full bg-[var(--cdbaby-purple)]/10 p-6">
              <VideoIcon
                className="h-12 w-12"
                style={{ color: 'var(--cdbaby-purple)' }}
              />
            </div>
            <h3 className="mb-2 text-xl font-bold">
              No Video Creations Yet
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md text-sm">
              People haven't started creating content with your music yet. Get
              your music in front of potential fans and inspire them to create!
            </p>

            {/* HearNow Promotion */}
            <div className="w-full max-w-md rounded-lg border-2 border-[var(--cdbaby-light-blue)]/30 bg-[var(--cdbaby-light-blue)]/10 p-6">
              <div className="mb-3 flex items-center justify-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#606bf8]">
                  <ExternalLink className="h-5 w-5 text-white" />
                </div>
                <h4 className="text-lg font-bold">Share with HearNow</h4>
              </div>
              <p className="text-muted-foreground mb-4 text-sm">
                Create a smart link to share your music everywhere. Make it easy
                for fans to listen, save, and share your tracks on their
                favorite platforms.
              </p>
              <Button
                size="lg"
                className="w-full border-0 text-white"
                style={{ backgroundColor: '#606bf8' }}
              >
                Create Your Link
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          // Regular Video Grid
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sortedVideos.map((video, index) => {
              const value = video[selectedMetric];

              return (
                <div
                  key={video.id}
                  className="group relative overflow-hidden rounded-lg border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* Rank Badge */}
                  {index === 0 && (
                    <div className="absolute top-2 left-2 z-10 flex items-center gap-1 rounded-full bg-[var(--cdbaby-green)] px-2 py-1 text-xs font-bold text-white">
                      <TrendingUp className="h-3 w-3" />
                      #1
                    </div>
                  )}

                  {/* Thumbnail */}
                  <div className="bg-muted relative aspect-[4/3] w-full overflow-hidden">
                    <Image
                      src={video.thumbnailUrl}
                      alt={video.trackName}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* Platform Badge */}
                    <div className="absolute right-2 bottom-2">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${getPlatformBadgeColor(video.platform)}`}
                      >
                        {getPlatformName(video.platform)}
                      </span>
                    </div>
                  </div>

                  {/* Video Info */}
                  <div className="p-4">
                    <h4 className="mb-1 truncate font-semibold">
                      {video.trackName}
                    </h4>
                    <p className="text-muted-foreground mb-3 truncate text-sm">
                      by {video.creator}
                    </p>

                    {/* Selected Metric Value */}
                    <div className="mb-3">
                      <p
                        className="text-3xl font-bold"
                        style={{ color: getColor(selectedMetric) }}
                      >
                        {formatNumber(value)}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {getMetricLabel(selectedMetric)}
                      </p>
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
        )}
      </CardContent>
    </Card>
  );
}
