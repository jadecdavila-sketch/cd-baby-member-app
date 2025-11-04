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

export default function SocialVideoEarningsPage() {
  // Filter transactions for social video only
  const socialVideoTransactions = mockRecentTransactions.filter(
    (t) => t.earningType === 'social-video'
  );

  const socialVideoBreakdown = mockEarningTypeBreakdown.find(
    (b) => b.type === 'social-video'
  );

  // Get platform breakdown for social video
  const platformBreakdown = socialVideoTransactions.reduce(
    (acc, transaction) => {
      const existing = acc.find((p) => p.platform === transaction.platform);
      if (existing) {
        existing.amount += transaction.amount;
        existing.views = (existing.views || 0) + (transaction.views || 0);
      } else {
        acc.push({
          platform: transaction.platform as import('../mock-data').DSP,
          amount: transaction.amount,
          views: transaction.views || 0,
        });
      }
      return acc;
    },
    [] as Array<{ platform: import('../mock-data').DSP; amount: number; views: number }>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1C1C1C' }}>
      {/* Page Header */}
      <div style={{ backgroundColor: '#1C1C1C' }}>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-2">
            <h1 className="text-4xl font-[var(--font-test-national-2-narrow)] font-bold uppercase">
              SOCIAL VIDEO
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Earnings from social media platforms
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Total Social Video Earnings */}
          <Card className="border-0">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">
                TOTAL SOCIAL VIDEO EARNINGS
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold" style={{ color: '#f59e0b' }}>
                {formatCurrency(socialVideoBreakdown?.amount || 0)}
              </div>
              <p className="text-muted-foreground mt-2 text-sm">
                {socialVideoBreakdown?.percentage.toFixed(1)}% of total earnings
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
                          {platform.views.toLocaleString()} views
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
                {socialVideoTransactions.map((transaction) => (
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
                        {transaction.views?.toLocaleString()} views
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
