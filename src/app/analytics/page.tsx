'use client';

import { useState, useEffect, useMemo } from 'react';
import { KPICards } from './components/kpi-cards';
import { FilterControls } from './components/filter-controls';
import dynamic from 'next/dynamic';
const MetricsChart = dynamic(() => import('./components/metrics-chart').then(mod => ({ default: mod.MetricsChart })), { ssr: false });
const GeographicMap = dynamic(() => import('./components/geographic-map').then(mod => ({ default: mod.GeographicMap })), { ssr: false });
import { TopTracks } from './components/top-tracks';
import { TopVideos } from './components/top-videos';
import { TopPlaylists } from './components/top-playlists';
import { AIInsights } from './components/ai-insights';
import { ActionCards } from './components/action-cards';
import { AIAssistant } from './components/ai-assistant';
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
    const filteredKPIs = mockKPIs.map(kpi => ({
      ...kpi,
      current: Math.round(kpi.current * multiplier),
      previous: Math.round(kpi.previous * multiplier),
    }));

    const filteredTimeSeriesData = mockTimeSeriesData.map(point => ({
      ...point,
      streams: Math.round(point.streams * multiplier),
      creations: Math.round(point.creations * multiplier),
      views: Math.round(point.views * multiplier),
      likes: Math.round(point.likes * multiplier),
      shares: Math.round(point.shares * multiplier),
    }));

    const filteredGeographicData = mockGeographicData.map(geo => ({
      ...geo,
      streams: Math.round(geo.streams * multiplier),
      creations: Math.round(geo.creations * multiplier),
      views: Math.round(geo.views * multiplier),
      likes: Math.round(geo.likes * multiplier),
      shares: Math.round(geo.shares * multiplier),
    }));

    const filteredTracks = mockTopTracks.map(track => ({
      ...track,
      streams: Math.round(track.streams * multiplier),
      creations: Math.round(track.creations * multiplier),
      views: Math.round(track.views * multiplier),
      likes: Math.round(track.likes * multiplier),
      shares: Math.round(track.shares * multiplier),
    }));

    const filteredVideos = mockTopVideos.map(video => ({
      ...video,
      creations: Math.round(video.creations * multiplier),
      views: Math.round(video.views * multiplier),
      likes: Math.round(video.likes * multiplier),
      shares: Math.round(video.shares * multiplier),
    }));

    const filteredPlaylists = mockTopPlaylists
      .filter(playlist => !selectedDSP || playlist.dsp === selectedDSP)
      .map(playlist => ({
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
  }, [timeFrame, selectedArtist, selectedRelease, selectedDSP]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1C1C1C' }}>
      {/* Page Header */}
      <div style={{ backgroundColor: '#1C1C1C' }}>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-2">
            <h1 className="text-4xl font-bold font-[var(--font-test-national-2-narrow)] uppercase">
              ANALYTICS
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Your creative command center – insights, trends, and next steps
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* KPI Cards */}
          <KPICards kpis={filteredData.kpis} />

          {/* AI Insights */}
          <AIInsights insights={mockAIInsights} />

          {/* Filter Controls - Sticky */}
          <div className="sticky top-0 z-10 pb-4" style={{ backgroundColor: '#1C1C1C' }}>
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

          {/* Geographic Map - Full Width */}
          <GeographicMap
            key={`geo-${timeFrame}-${selectedArtist}-${selectedRelease}-${selectedDSP}`}
            data={filteredData.geographicData}
          />

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

          {/* Top Playlists */}
          <TopPlaylists
            key={`playlists-${timeFrame}-${selectedArtist}-${selectedRelease}-${selectedDSP}`}
            playlists={filteredData.playlists}
          />

          {/* Action Cards */}
          <ActionCards />

          {/* Last Updated Info */}
          {lastUpdated && (
            <div className="text-center text-sm text-muted-foreground">
              <p>Data last updated: {lastUpdated}</p>
            </div>
          )}
        </div>
      </div>

      {/* AI Assistant (Floating) */}
      <AIAssistant />
    </div>
  );
}
