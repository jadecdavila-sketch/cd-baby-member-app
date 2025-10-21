'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';

import { KPICards } from './components/kpi-cards';
import { FilterControls } from './components/filter-controls';
const MetricsChart = dynamic(
  () =>
    import('./components/metrics-chart').then((mod) => ({
      default: mod.MetricsChart,
    })),
  { ssr: false }
);
const GeographicMap = dynamic(
  () =>
    import('./components/geographic-map').then((mod) => ({
      default: mod.GeographicMap,
    })),
  { ssr: false }
);
import { TopTracks } from './components/top-tracks';
import { TopVideos } from './components/top-videos';
import { TopPlaylists } from './components/top-playlists';
import { InsightCard } from './components/insight-card';
import { ActionCards } from './components/action-cards';
import { EmptyState } from './components/empty-state';
import { IntermediateState } from './components/intermediate-state';
import {
  mockKPIs,
  mockTimeSeriesData,
  mockGeographicData,
  mockTopTracks,
  mockTopVideos,
  mockTopPlaylists,
  mockAIInsights,
  mockArtists,
  mockReleases,
  type TimeFrame,
  type DSP,
} from './mock-data';

export default function AnalyticsPage() {
  const [viewMode, setViewMode] = useState<'full' | 'intermediate' | 'empty'>(
    'full'
  );
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('7d');
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);
  const [selectedRelease, setSelectedRelease] = useState<string | null>(null);
  const [selectedDSP, setSelectedDSP] = useState<DSP | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    setLastUpdated(new Date().toLocaleString());
  }, []);

  // Simulate data changes based on filters
  const filteredData = useMemo(() => {
    // Create a multiplier based on filters to simulate different data
    let multiplier = 1;

    // Intermediate state shows much smaller numbers (100-999 streams range)
    if (viewMode === 'intermediate') {
      multiplier = 0.005; // Reduces ~125k streams to ~625 streams
    }

    // Time frame affects data amount
    if (timeFrame === '30d') multiplier *= 1.8;
    if (timeFrame === 'ytd') multiplier *= 3.2;
    if (timeFrame === 'custom') multiplier *= 2.5;

    // Single artist selected shows reduced data
    if (selectedArtist) multiplier *= 0.6;

    // Single release selected shows even more reduced data
    if (selectedRelease) multiplier *= 0.4;

    // DSP filter affects data
    if (selectedDSP) multiplier *= 0.7;

    // Apply multiplier to all data
    const filteredKPIs = mockKPIs.map((kpi) => ({
      ...kpi,
      current: Math.round(kpi.current * multiplier),
      previous: Math.round(kpi.previous * multiplier),
    }));

    const filteredTimeSeriesData = mockTimeSeriesData.map((point) => ({
      ...point,
      streams: Math.round(point.streams * multiplier),
      creations: Math.round(point.creations * multiplier),
      views: Math.round(point.views * multiplier),
      likes: Math.round(point.likes * multiplier),
      shares: Math.round(point.shares * multiplier),
    }));

    const filteredGeographicData = mockGeographicData.map((geo) => ({
      ...geo,
      streams: Math.round(geo.streams * multiplier),
      creations: Math.round(geo.creations * multiplier),
      views: Math.round(geo.views * multiplier),
      likes: Math.round(geo.likes * multiplier),
      shares: Math.round(geo.shares * multiplier),
    }));

    const filteredTracks = mockTopTracks
      .filter((track) => {
        // Filter by artist if selected
        if (selectedArtist) {
          const artist = mockArtists.find((a) => a.id === selectedArtist);
          if (artist && track.artist !== artist.name) {
            return false;
          }
        }
        // Filter by release if selected
        if (selectedRelease) {
          const release = mockReleases.find((r) => r.id === selectedRelease);
          if (release && track.releaseDate !== release.releaseDate) {
            return false;
          }
        }
        return true;
      })
      .map((track) => ({
        ...track,
        streams: Math.round(track.streams * multiplier),
        creations: Math.round(track.creations * multiplier),
        views: Math.round(track.views * multiplier),
        likes: Math.round(track.likes * multiplier),
        shares: Math.round(track.shares * multiplier),
      }));

    const filteredVideos = mockTopVideos
      .filter((video) => !selectedDSP || video.platform === selectedDSP)
      .map((video) => ({
        ...video,
        creations: Math.round(video.creations * multiplier),
        views: Math.round(video.views * multiplier),
        likes: Math.round(video.likes * multiplier),
        shares: Math.round(video.shares * multiplier),
      }));

    const filteredPlaylists = mockTopPlaylists
      .filter((playlist) => !selectedDSP || playlist.dsp === selectedDSP)
      .map((playlist) => ({
        ...playlist,
        streams: Math.round(playlist.streams * multiplier),
      }));

    return {
      kpis: filteredKPIs,
      timeSeriesData: filteredTimeSeriesData,
      geographicData: filteredGeographicData,
      tracks: filteredTracks,
      videos: filteredVideos,
      playlists: filteredPlaylists,
    };
  }, [viewMode, timeFrame, selectedArtist, selectedRelease, selectedDSP]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1C1C1C' }}>
      {/* Page Header */}
      <div style={{ backgroundColor: '#1C1C1C' }}>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-2 flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-[var(--font-test-national-2-narrow)] font-bold uppercase">
                ANALYTICS
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">
                Your creative command center – insights, trends, and next steps
              </p>
            </div>
            {/* Prototype Toggle */}
            <div className="border-border inline-flex overflow-hidden rounded-lg border">
              <button
                onClick={() => setViewMode('full')}
                className="border-border hover:bg-muted/50 border-r px-3 py-1.5 text-sm font-medium transition-all duration-200"
                style={{
                  backgroundColor:
                    viewMode === 'full' ? '#52bcd6' : 'transparent',
                  color:
                    viewMode === 'full' ? 'white' : 'rgba(255, 255, 255, 0.7)',
                }}
              >
                Full Analytics
              </button>
              <button
                onClick={() => setViewMode('intermediate')}
                className="border-border hover:bg-muted/50 border-r px-3 py-1.5 text-sm font-medium transition-all duration-200"
                style={{
                  backgroundColor:
                    viewMode === 'intermediate' ? '#52bcd6' : 'transparent',
                  color:
                    viewMode === 'intermediate'
                      ? 'white'
                      : 'rgba(255, 255, 255, 0.7)',
                }}
              >
                Intermediate
              </button>
              <button
                onClick={() => setViewMode('empty')}
                className="hover:bg-muted/50 px-3 py-1.5 text-sm font-medium transition-all duration-200"
                style={{
                  backgroundColor:
                    viewMode === 'empty' ? '#52bcd6' : 'transparent',
                  color:
                    viewMode === 'empty' ? 'white' : 'rgba(255, 255, 255, 0.7)',
                }}
              >
                Empty State
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {viewMode === 'empty' ? (
          <EmptyState onComplete={() => setViewMode('intermediate')} />
        ) : viewMode === 'intermediate' ? (
          <IntermediateState
            currentStreams={Math.round(filteredData.kpis[0]?.current || 625)}
            renderKPICards={() => <KPICards kpis={filteredData.kpis} />}
            renderFilterControls={() => (
              <div
                className="sticky top-0 z-10 pb-4"
                style={{ backgroundColor: '#1C1C1C' }}
              >
                <FilterControls
                  timeFrame={timeFrame}
                  onTimeFrameChange={setTimeFrame}
                  selectedArtist={selectedArtist}
                  onArtistChange={setSelectedArtist}
                  selectedRelease={selectedRelease}
                  onReleaseChange={setSelectedRelease}
                  selectedDSP={selectedDSP}
                  onDSPChange={setSelectedDSP}
                  artists={mockArtists}
                  releases={mockReleases}
                />
              </div>
            )}
            renderMetricsChart={() => (
              <MetricsChart
                key={`chart-${timeFrame}-${selectedArtist}-${selectedRelease}-${selectedDSP}`}
                data={filteredData.timeSeriesData}
              />
            )}
            renderTopTracks={() => (
              <TopTracks
                key={`tracks-${timeFrame}-${selectedArtist}-${selectedRelease}-${selectedDSP}`}
                tracks={filteredData.tracks}
              />
            )}
            renderTopVideos={() => (
              <TopVideos
                key={`videos-${timeFrame}-${selectedArtist}-${selectedRelease}-${selectedDSP}`}
                videos={[]}
              />
            )}
          />
        ) : (
          <div className="space-y-8">
            {/* KPI Cards */}
            <KPICards kpis={filteredData.kpis} />

            {/* Filter Controls - Sticky */}
            <div
              className="sticky top-0 z-10 pb-4"
              style={{ backgroundColor: '#1C1C1C' }}
            >
              <FilterControls
                timeFrame={timeFrame}
                onTimeFrameChange={setTimeFrame}
                selectedArtist={selectedArtist}
                onArtistChange={setSelectedArtist}
                selectedRelease={selectedRelease}
                onReleaseChange={setSelectedRelease}
                selectedDSP={selectedDSP}
                onDSPChange={setSelectedDSP}
                artists={mockArtists}
                releases={mockReleases}
              />
            </div>

            {/* Metrics Chart */}
            <MetricsChart
              key={`chart-${timeFrame}-${selectedArtist}-${selectedRelease}-${selectedDSP}`}
              data={filteredData.timeSeriesData}
            />

            {/* Brazil Insight - Full Width */}
            {viewMode === 'full' && mockAIInsights[0] && (
              <InsightCard insight={mockAIInsights[0]} />
            )}

            {/* Geographic Map - Full Width */}
            {viewMode === 'full' && (
              <GeographicMap
                key={`geo-${timeFrame}-${selectedArtist}-${selectedRelease}-${selectedDSP}`}
                data={filteredData.geographicData}
              />
            )}

            {/* TikTok Insight - Full Width */}
            {viewMode === 'full' && mockAIInsights[3] && (
              <InsightCard insight={mockAIInsights[3]} />
            )}

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Top Tracks */}
              <TopTracks
                key={`tracks-${timeFrame}-${selectedArtist}-${selectedRelease}-${selectedDSP}`}
                tracks={filteredData.tracks}
              />

              {/* Top Videos */}
              <TopVideos
                key={`videos-${timeFrame}-${selectedArtist}-${selectedRelease}-${selectedDSP}`}
                videos={filteredData.videos}
              />
            </div>

            {/* Playlist Insight - Full Width */}
            {viewMode === 'full' && mockAIInsights[1] && (
              <InsightCard insight={mockAIInsights[1]} />
            )}

            {/* Top Playlists */}
            {viewMode === 'full' && (
              <TopPlaylists
                key={`playlists-${timeFrame}-${selectedArtist}-${selectedRelease}-${selectedDSP}`}
                playlists={filteredData.playlists}
              />
            )}

            {/* Action Cards */}
            {viewMode === 'full' && <ActionCards />}

            {/* Last Updated Info */}
            {lastUpdated && (
              <div className="text-muted-foreground text-center text-sm">
                <p>Data last updated: {lastUpdated}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
