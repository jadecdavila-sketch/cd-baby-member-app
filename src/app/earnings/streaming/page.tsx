'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';

import { PlatformIcon } from '../components/platform-icon';
import {
  mockRecentTransactions,
  mockEarningTypeBreakdown,
  formatCurrency,
  getPlatformName,
} from '../mock-data';

export default function StreamingEarningsPage() {
  // Filter transactions for streaming only
  const streamingTransactions = mockRecentTransactions.filter(
    (t) => t.earningType === 'streaming'
  );

  const streamingBreakdown = mockEarningTypeBreakdown.find(
    (b) => b.type === 'streaming'
  );

  // Get platform breakdown for streaming
  const platformBreakdown = streamingTransactions.reduce(
    (acc, transaction) => {
      const existing = acc.find((p) => p.platform === transaction.platform);
      if (existing) {
        existing.amount += transaction.amount;
        existing.streams = (existing.streams || 0) + (transaction.streams || 0);
      } else {
        acc.push({
          platform: transaction.platform as import('../mock-data').DSP,
          amount: transaction.amount,
          streams: transaction.streams || 0,
        });
      }
      return acc;
    },
    [] as Array<{ platform: import('../mock-data').DSP; amount: number; streams: number }>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1C1C1C' }}>
      {/* Page Header */}
      <div style={{ backgroundColor: '#1C1C1C' }}>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-2">
            <h1 className="text-4xl font-[var(--font-test-national-2-narrow)] font-bold uppercase">
              STREAMING & DOWNLOADS
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Earnings from digital streaming platforms
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Total Streaming Earnings */}
          <Card className="border-0">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">
                TOTAL STREAMING EARNINGS
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold" style={{ color: '#52bcd6' }}>
                {formatCurrency(streamingBreakdown?.amount || 0)}
              </div>
              <p className="text-muted-foreground mt-2 text-sm">
                {streamingBreakdown?.percentage.toFixed(1)}% of total earnings
              </p>
            </CardContent>
          </Card>

          {/* Platform Breakdown */}
          <Card className="border-0">
            <CardHeader>
              <CardTitle className="text-base">BY PLATFORM</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {platformBreakdown.map((platform) => (
                  <div
                    key={platform.platform}
                    className="flex items-center justify-between border-b border-gray-700 pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <PlatformIcon
                        platform={platform.platform}
                        size="md"
                      />
                      <div>
                        <p className="font-medium">
                          {getPlatformName(platform.platform)}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {platform.streams.toLocaleString()} streams
                        </p>
                      </div>
                    </div>
                    <p className="text-xl font-bold">
                      {formatCurrency(platform.amount)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="border-0">
            <CardHeader>
              <CardTitle className="text-base">RECENT TRANSACTIONS</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {streamingTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="rounded-[3px] border border-gray-700 p-4"
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <PlatformIcon
                          platform={transaction.platform}
                          size="sm"
                        />
                        <div>
                          <p className="font-medium">{transaction.trackName}</p>
                          <p className="text-muted-foreground text-sm">
                            {getPlatformName(transaction.platform)}
                          </p>
                        </div>
                      </div>
                      <p className="font-bold">
                        {formatCurrency(transaction.amount)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-muted-foreground text-sm">
                        {new Date(transaction.date).toLocaleDateString(
                          'en-US',
                          {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          }
                        )}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {transaction.streams?.toLocaleString()} streams
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
