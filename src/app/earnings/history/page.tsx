'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronDown } from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/shadcn/popover';
import { Button } from '@/shared/components/shadcn/button';

import { PlatformIcon } from '../components/platform-icon';
import {
  mockRecentTransactions,
  mockPayoutHistory,
  formatCurrency,
  getPlatformName,
  getEarningTypeLabel,
  type EarningType,
  type DSP,
} from '../mock-data';

export default function EarningsHistoryPage() {
  const [timeRange, setTimeRange] = useState<'30d' | '90d' | 'all'>('30d');
  const [selectedEarningType, setSelectedEarningType] =
    useState<EarningType | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<DSP>>(new Set());

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return mockRecentTransactions.filter((transaction) => {
      if (
        selectedEarningType &&
        transaction.earningType !== selectedEarningType
      ) {
        return false;
      }
      if (selectedPlatforms.size > 0 && !selectedPlatforms.has(transaction.platform)) {
        return false;
      }
      return true;
    });
  }, [selectedEarningType, selectedPlatforms]);

  // Get unique platforms from transactions
  const platforms = Array.from(
    new Set(mockRecentTransactions.map((t) => t.platform))
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1C1C1C' }}>
      {/* Page Header */}
      <div style={{ backgroundColor: '#1C1C1C' }}>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-2">
            <h1 className="text-4xl font-[var(--font-test-national-2-narrow)] font-bold uppercase">
              EARNINGS HISTORY
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              View your earnings activity and past payouts
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Filters */}
          <Card className="border-0">
            <CardContent className="pt-6">
              <div className="grid gap-4 md:grid-cols-3">
                {/* Time Range */}
                <div>
                  <label className="text-muted-foreground mb-2 block text-sm font-medium">
                    Time Range
                  </label>
                  <div className="border-border inline-flex flex-shrink-0 overflow-hidden rounded-lg border">
                    {(['30d', '90d', 'all'] as const).map((range) => (
                      <button
                        key={range}
                        onClick={() => setTimeRange(range)}
                        className="border-border border-r px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-all duration-200 last:border-r-0"
                        style={{
                          backgroundColor:
                            timeRange === range ? '#52bcd6' : 'transparent',
                          color: timeRange === range ? 'white' : 'rgba(255, 255, 255, 0.7)',
                        }}
                      >
                        {range === '30d' && 'Last 30 Days'}
                        {range === '90d' && 'Last 90 Days'}
                        {range === 'all' && 'All Time'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Earning Type Filter */}
                <div>
                  <label className="text-muted-foreground mb-2 block text-sm font-medium">
                    Earning Type
                  </label>
                  <div className="border-border inline-flex flex-shrink-0 overflow-hidden rounded-lg border">
                    <button
                      onClick={() => setSelectedEarningType(null)}
                      className="border-border border-r px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-all duration-200"
                      style={{
                        backgroundColor:
                          selectedEarningType === null
                            ? '#52bcd6'
                            : 'transparent',
                        color:
                          selectedEarningType === null ? 'white' : 'rgba(255, 255, 255, 0.7)',
                      }}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setSelectedEarningType('streaming')}
                      className="border-border border-r px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-all duration-200"
                      style={{
                        backgroundColor:
                          selectedEarningType === 'streaming'
                            ? '#52bcd6'
                            : 'transparent',
                        color:
                          selectedEarningType === 'streaming'
                            ? 'white'
                            : 'rgba(255, 255, 255, 0.7)',
                      }}
                    >
                      Streaming
                    </button>
                    <button
                      onClick={() => setSelectedEarningType('social-video')}
                      className="border-border px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-all duration-200 last:border-r-0"
                      style={{
                        backgroundColor:
                          selectedEarningType === 'social-video'
                            ? '#52bcd6'
                            : 'transparent',
                        color:
                          selectedEarningType === 'social-video'
                            ? 'white'
                            : 'rgba(255, 255, 255, 0.7)',
                      }}
                    >
                      Social Video
                    </button>
                  </div>
                </div>

                {/* Platform Filter */}
                <div>
                  <label className="text-muted-foreground mb-2 block text-sm font-medium">
                    Platform
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 w-full gap-2 justify-between"
                        style={{
                          backgroundColor:
                            selectedPlatforms.size > 0 ? '#52bcd6' : 'transparent',
                          color:
                            selectedPlatforms.size > 0
                              ? 'white'
                              : 'rgba(255, 255, 255, 0.7)',
                          borderColor:
                            selectedPlatforms.size > 0 ? '#52bcd6' : undefined,
                        }}
                      >
                        <span>
                          Platforms
                          {selectedPlatforms.size > 0 && (
                            <span className="ml-2 rounded-full bg-white/20 px-1.5 py-0.5 text-xs font-bold">
                              {selectedPlatforms.size}
                            </span>
                          )}
                        </span>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-2" align="start">
                      <div className="max-h-64 space-y-1 overflow-y-auto">
                        {platforms.map((platform) => (
                          <button
                            key={platform}
                            onClick={() => {
                              const newSet = new Set(selectedPlatforms);
                              if (newSet.has(platform)) {
                                newSet.delete(platform);
                              } else {
                                newSet.add(platform);
                              }
                              setSelectedPlatforms(newSet);
                            }}
                            className="hover:bg-muted flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors"
                          >
                            <div
                              className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border"
                              style={{
                                backgroundColor: selectedPlatforms.has(platform)
                                  ? '#52bcd6'
                                  : 'transparent',
                                borderColor: selectedPlatforms.has(platform)
                                  ? '#52bcd6'
                                  : 'rgba(255, 255, 255, 0.3)',
                              }}
                            >
                              {selectedPlatforms.has(platform) && (
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
                            <span>{getPlatformName(platform)}</span>
                          </button>
                        ))}
                      </div>
                      {selectedPlatforms.size > 0 && (
                        <div className="border-t border-gray-700 pt-2 mt-2">
                          <button
                            onClick={() => setSelectedPlatforms(new Set())}
                            className="text-xs w-full text-center py-1"
                            style={{ color: '#52bcd6' }}
                          >
                            Clear all
                          </button>
                        </div>
                      )}
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card className="border-0">
            <CardHeader>
              <CardTitle className="text-base">RECENT ACTIVITY</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {filteredTransactions.map((transaction) => (
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

          {/* Payout History */}
          <Card className="border-0">
            <CardHeader>
              <CardTitle className="text-base">PAYOUT HISTORY</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockPayoutHistory.map((payout) => (
                  <Link key={payout.id} href={`/earnings/payout/${payout.id}`}>
                    <div className="flex items-center justify-between rounded-[3px] border border-gray-700 p-4 transition-colors hover:border-gray-600">
                      <div>
                        <p className="font-medium">
                          Payout -{' '}
                          {new Date(payout.payoutDate).toLocaleDateString(
                            'en-US',
                            {
                              month: 'long',
                              year: 'numeric',
                            }
                          )}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {new Date(payout.periodStart).toLocaleDateString(
                            'en-US',
                            {
                              month: 'short',
                              day: 'numeric',
                            }
                          )}{' '}
                          -{' '}
                          {new Date(payout.periodEnd).toLocaleDateString(
                            'en-US',
                            {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            }
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="text-xl font-bold">
                          {formatCurrency(payout.netAmount)}
                        </p>
                        <ChevronRight className="text-muted-foreground h-5 w-5" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
