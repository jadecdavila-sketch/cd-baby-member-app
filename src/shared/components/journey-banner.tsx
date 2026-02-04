'use client';

import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';

import { getAssetPath } from '@/shared/utils/asset-path';

interface JourneyBannerProps {
  currentStreams?: number;
  goalStreams?: number;
  completedMilestones?: number;
  totalMilestones?: number;
  showLearnMore?: boolean;
}

export function JourneyBanner({
  currentStreams = 0,
  goalStreams = 1000,
  completedMilestones = 0,
  totalMilestones = 5,
  showLearnMore = false,
}: JourneyBannerProps) {
  const progressPercentage = (currentStreams / goalStreams) * 100;

  return (
    <div
      className="rounded-[3px] p-8 relative overflow-hidden"
      style={{ backgroundColor: '#61113A' }}
    >
      <div className="flex items-start gap-6">
        <img
          src={getAssetPath('/assets/cd.png')}
          alt="CD"
          className="h-12 w-12 flex-shrink-0"
        />
        <div className="flex-1">
          <h2 className="mb-2 text-3xl font-[var(--font-test-national-2-narrow)] font-bold text-white">
            Your Journey to 1,000 Streams
          </h2>
          <p className="text-white/70 mb-6 text-lg max-w-2xl">
            Reach 1,000 streams and join the top 13% of tracks on Spotify. This
            milestone unlocks monetization and proves your music resonates with
            listeners.
          </p>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-white">Progress</span>
              <span className="text-sm font-medium text-[#52bcd6]">
                {currentStreams.toLocaleString()} / {goalStreams.toLocaleString()} streams
              </span>
            </div>
            <div className="bg-white/20 h-3 w-full overflow-hidden rounded-full">
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${Math.max(2, progressPercentage)}%`,
                  backgroundColor: '#ff386a',
                }}
              />
            </div>
          </div>

          {/* Milestone Progress */}
          <div className="flex items-center justify-between">
            <div className="text-white/70 flex items-center gap-2 text-sm">
              <Sparkles className="h-4 w-4" style={{ color: '#ff386a' }} />
              <span>
                {completedMilestones === 0
                  ? "Ready to start your journey? Let's get your first streams!"
                  : `${completedMilestones} of ${totalMilestones} milestones completed`}
              </span>
            </div>

            {showLearnMore && (
              <Link
                href="/analytics"
                className="inline-flex items-center gap-2 rounded-[3px] px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#ff386a', color: '#ffffff' }}
              >
                Learn More
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
