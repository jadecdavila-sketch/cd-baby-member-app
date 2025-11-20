'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ExternalLink } from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { COLORS } from '@/shared/constants/theme';

import { PayPointProgress } from './components/pay-point-progress';
import { PlatformIcon } from './components/platform-icon';
import { ReportsDrawer } from './components/reports-drawer';
import { EarningsEmptyState } from './components/earnings-empty-state';
import {
  mockEarningsBalance,
  mockRecentTransactions,
  mockEarningsTimeSeries,
  mockEarningsByTimeframe,
  formatCurrency,
  getPlatformName,
  getEarningTypeLabel,
  type EarningType,
  type TimeFrame,
} from './mock-data';

const EarningsChart = dynamic(
  () =>
    import('./components/earnings-chart').then((mod) => ({
      default: mod.EarningsChart,
    })),
  { ssr: false }
);

export default function EarningsPage() {
  const [viewMode, setViewMode] = useState<'full' | 'empty'>('full');
  const [reportsDrawerOpen, setReportsDrawerOpen] = useState(false);

  const [timeFrame, setTimeFrame] = useState<TimeFrame>('monthly');
  const [selectedEarningType, setSelectedEarningType] = useState<
    EarningType | 'all'
  >('all');

  // State for pay point threshold
  const [payoutThreshold, setPayoutThreshold] = useState(mockEarningsBalance.payoutThreshold);

  const handleThresholdChange = (newThreshold: number) => {
    setPayoutThreshold(newThreshold);
    // TODO: In production, this would call an API to update the user's threshold
    console.log('Pay point changed to:', newThreshold);
  };

  // Get filtered earnings data based on selected timeframe
  const filteredEarnings = mockEarningsByTimeframe[timeFrame] ?? mockEarningsByTimeframe.monthly;

  // Filter chart data based on timeframe
  const filteredChartData = useMemo(() => {
    const now = new Date();

    switch (timeFrame) {
      case 'monthly': {
        // Last 30 days
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(now.getDate() - 30);
        return mockEarningsTimeSeries.filter(
          (item) => new Date(item.date) >= thirtyDaysAgo
        );
      }
      case 'quarterly': {
        // Last 90 days
        const ninetyDaysAgo = new Date(now);
        ninetyDaysAgo.setDate(now.getDate() - 90);
        return mockEarningsTimeSeries.filter(
          (item) => new Date(item.date) >= ninetyDaysAgo
        );
      }
      case 'yearly': {
        // Last 365 days
        const oneYearAgo = new Date(now);
        oneYearAgo.setFullYear(now.getFullYear() - 1);
        return mockEarningsTimeSeries.filter(
          (item) => new Date(item.date) >= oneYearAgo
        );
      }
      case 'lifetime':
        // All data
        return mockEarningsTimeSeries;
      default:
        return mockEarningsTimeSeries;
    }
  }, [timeFrame]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.bgDark }}>
      {/* Page Header */}
      <div style={{ backgroundColor: COLORS.bgDark }}>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-2 flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-[var(--font-test-national-2-narrow)] font-bold uppercase">
                EARNINGS
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">
                Track your revenue, payouts, and download reports
              </p>
            </div>
            {/* Prototype Toggle */}
            <div className="border-border inline-flex overflow-hidden rounded-lg border">
              <button
                onClick={() => setViewMode('full')}
                className="border-border hover:bg-muted/50 border-r px-3 py-1.5 text-sm font-medium transition-all duration-200"
                style={{
                  backgroundColor: viewMode === 'full' ? COLORS.primary : 'transparent',
                  color: viewMode === 'full' ? 'white' : 'rgba(255, 255, 255, 0.7)',
                }}
              >
                Full Data
              </button>
              <button
                onClick={() => setViewMode('empty')}
                className="hover:bg-muted/50 px-3 py-1.5 text-sm font-medium transition-all duration-200"
                style={{
                  backgroundColor: viewMode === 'empty' ? COLORS.primary : 'transparent',
                  color: viewMode === 'empty' ? 'white' : 'rgba(255, 255, 255, 0.7)',
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
          <EarningsEmptyState />
        ) : (
          <div className="space-y-6">
            {/* Filters Bar - Above all content */}
            <Card className="border-0">
              <CardContent className="flex items-center justify-between p-4">
                {/* Time Frame Filter - Left */}
                <div className="border-border inline-flex flex-shrink-0 overflow-hidden rounded-lg border">
                  {(['monthly', 'quarterly', 'yearly', 'lifetime'] as const).map(
                    (frame) => (
                      <button
                        key={frame}
                        onClick={() => setTimeFrame(frame)}
                        className="border-border border-r px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-all duration-200 last:border-r-0"
                        style={{
                          backgroundColor:
                            timeFrame === frame ? COLORS.primary : 'transparent',
                          color:
                            timeFrame === frame
                              ? COLORS.textWhite
                              : COLORS.textGray,
                        }}
                      >
                        {frame.charAt(0).toUpperCase() + frame.slice(1)}
                      </button>
                    )
                  )}
                </div>

                {/* Detailed Reports - Right */}
                <button
                  type="button"
                  onClick={() => setReportsDrawerOpen(true)}
                  aria-label="Open reports download menu"
                  className="text-xs"
                  style={{ color: COLORS.primary }}
                >
                  Detailed Reports
                </button>
              </CardContent>
            </Card>

            {/* 4 KPI Cards Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Total Earnings */}
            <Link href="/earnings/history">
              <Card className="border-0 transition-all hover:border-gray-600">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">TOTAL EARNINGS</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-2 text-2xl font-bold">
                    {formatCurrency(filteredEarnings.totalEarnings)}
                  </div>
                  <p className="text-muted-foreground text-xs">
                    {timeFrame === 'lifetime' ? 'All-time' : `This ${timeFrame.replace('ly', '')}`}
                  </p>
                  <button
                    type="button"
                    aria-label="View earnings history"
                    className="mt-2 flex items-center gap-1 text-xs"
                    style={{ color: COLORS.primary }}
                  >
                    View history
                    <ExternalLink className="h-3 w-3" />
                  </button>
                </CardContent>
              </Card>
            </Link>

            {/* Streaming & Downloads */}
            <Link href="/earnings/streaming">
              <Card className="border-0 transition-all hover:border-gray-600">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">STREAMING</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-2 text-2xl font-bold">
                    {formatCurrency(filteredEarnings.streaming.amount)}
                  </div>
                  <p className="text-muted-foreground text-xs">
                    {filteredEarnings.streaming.percentage.toFixed(1)}% of total
                  </p>
                  <p
                    className="mt-2 flex items-center gap-1 text-xs"
                    style={{ color: COLORS.primary }}
                  >
                    View details
                    <ExternalLink className="h-3 w-3" />
                  </p>
                </CardContent>
              </Card>
            </Link>

            {/* Social Video */}
            <Link href="/earnings/social-video">
              <Card className="border-0 transition-all hover:border-gray-600">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">SOCIAL VIDEO</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-2 text-2xl font-bold">
                    {formatCurrency(filteredEarnings.socialVideo.amount)}
                  </div>
                  <p className="text-muted-foreground text-xs">
                    {filteredEarnings.socialVideo.percentage.toFixed(1)}% of total
                  </p>
                  <p
                    className="mt-2 flex items-center gap-1 text-xs"
                    style={{ color: COLORS.primary }}
                  >
                    View details
                    <ExternalLink className="h-3 w-3" />
                  </p>
                </CardContent>
              </Card>
            </Link>

            {/* Other */}
            <Link href="/earnings/other">
              <Card className="border-0 transition-all hover:border-gray-600">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">OTHER</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-2 text-2xl font-bold">
                    {formatCurrency(filteredEarnings.other.amount)}
                  </div>
                  <p className="text-muted-foreground text-xs">
                    {filteredEarnings.other.percentage.toFixed(1)}% of total
                  </p>
                  <p
                    className="mt-2 flex items-center gap-1 text-xs"
                    style={{ color: COLORS.primary }}
                  >
                    View details
                    <ExternalLink className="h-3 w-3" />
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Hero Section - Current Balance */}
          <Card className="border-0">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">CURRENT BALANCE</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div
                  className="text-6xl font-bold"
                  style={{ color: COLORS.primary }}
                >
                  {formatCurrency(mockEarningsBalance.currentBalance)}
                </div>
              </div>

              {/* Pay Point Progress */}
              <PayPointProgress
                balance={{
                  ...mockEarningsBalance,
                  payoutThreshold,
                }}
                onThresholdChange={handleThresholdChange}
              />
            </CardContent>
          </Card>

          {/* Chart */}
          <Card className="border-0">
            <CardHeader className="pb-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="text-base">EARNINGS TRENDS</CardTitle>
                <div className="border-border inline-flex flex-shrink-0 overflow-hidden rounded-lg border">
                  {(['all', 'streaming', 'social-video'] as const).map(
                    (type) => (
                      <button
                        key={type}
                        onClick={() => setSelectedEarningType(type)}
                        className="border-border border-r px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-all duration-200 last:border-r-0"
                        style={{
                          backgroundColor:
                            selectedEarningType === type
                              ? type === 'social-video'
                                ? COLORS.secondary
                                : COLORS.primary
                              : 'transparent',
                          color:
                            selectedEarningType === type
                              ? COLORS.textWhite
                              : COLORS.textGray,
                        }}
                      >
                        {type === 'all'
                          ? 'All Types'
                          : type === 'streaming'
                            ? 'Streaming'
                            : 'Social Video'}
                      </button>
                    )
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <EarningsChart
                data={filteredChartData}
                selectedType={selectedEarningType}
                onTypeChange={setSelectedEarningType}
              />
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">RECENT ACTIVITY</CardTitle>
                <Link
                  href="/earnings/history"
                  className="text-xs"
                  style={{ color: COLORS.primary }}
                >
                  View all activity
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockRecentTransactions.slice(0, 5).map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between border-b border-gray-700 pb-6 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-4">
                      <PlatformIcon platform={transaction.platform} size="md" />
                      <div className="space-y-1.5">
                        <p className="font-medium">{transaction.trackName}</p>
                        <p className="text-muted-foreground text-xs">
                          {getEarningTypeLabel(transaction.earningType)} •{' '}
                          {getPlatformName(transaction.platform)} •{' '}
                          {new Date(transaction.date).toLocaleDateString(
                            'en-US',
                            {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            }
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="font-bold">
                        {formatCurrency(transaction.amount)}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {transaction.streams
                          ? `${transaction.streams.toLocaleString()} streams`
                          : `${transaction.views?.toLocaleString()} views`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          </div>
        )}
      </div>

      {/* Reports Drawer */}
      <ReportsDrawer
        open={reportsDrawerOpen}
        onOpenChange={setReportsDrawerOpen}
      />
    </div>
  );
}
