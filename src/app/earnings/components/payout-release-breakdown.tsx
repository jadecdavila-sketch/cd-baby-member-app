'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

import { formatCurrency, type ReleaseEarning } from '../mock-data';

interface PayoutReleaseBreakdownProps {
  releases: ReleaseEarning[];
}

export function PayoutReleaseBreakdown({
  releases,
}: PayoutReleaseBreakdownProps) {
  const [expandedReleases, setExpandedReleases] = useState<Set<string>>(
    new Set()
  );

  const toggleRelease = (releaseId: string) => {
    const newExpanded = new Set(expandedReleases);
    if (newExpanded.has(releaseId)) {
      newExpanded.delete(releaseId);
    } else {
      newExpanded.add(releaseId);
    }
    setExpandedReleases(newExpanded);
  };

  return (
    <div className="space-y-3">
      {releases.map((release) => (
        <div
          key={release.releaseId}
          className="border-b border-gray-700 pb-3 last:border-0 last:pb-0"
        >
          {/* Release Header */}
          <button
            onClick={() => toggleRelease(release.releaseId)}
            className="flex w-full items-center justify-between py-2 text-left"
          >
            <div className="flex items-center gap-3">
              {expandedReleases.has(release.releaseId) ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
              <div>
                <p className="font-medium">{release.releaseName}</p>
                <p className="text-muted-foreground text-sm">
                  {release.artistName}
                </p>
              </div>
            </div>
            <span className="font-bold">{formatCurrency(release.amount)}</span>
          </button>

          {/* Track Breakdown (Expandable) */}
          {expandedReleases.has(release.releaseId) && (
            <div className="mt-2 ml-8 space-y-2">
              {release.tracks.map((track) => (
                <div
                  key={track.trackId}
                  className="flex items-center justify-between rounded-[3px] bg-gray-800/50 p-3"
                >
                  <div>
                    <p className="text-sm font-medium">{track.trackName}</p>
                    <p className="text-muted-foreground text-xs">
                      {track.streams.toLocaleString()} streams
                    </p>
                  </div>
                  <span className="text-sm font-bold">
                    {formatCurrency(track.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
