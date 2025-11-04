import { Download } from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';

import { PlatformIcon } from '../../components/platform-icon';
import { PayoutReleaseBreakdown } from '../../components/payout-release-breakdown';
import {
  mockPayoutHistory,
  formatCurrency,
  getPlatformName,
  getPayoutStatusLabel,
  getEarningTypeLabel,
} from '../../mock-data';

// Generate static params for static export
export function generateStaticParams() {
  return mockPayoutHistory.map((payout) => ({
    id: payout.id,
  }));
}

interface PayoutDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PayoutDetailsPage({ params }: PayoutDetailsPageProps) {
  // Await params for Next.js 15 compatibility
  const { id } = await params;

  // Find the payout by ID
  const payout = mockPayoutHistory.find((p) => p.id === id);

  if (!payout) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#1C1C1C' }}>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p>Payout not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1C1C1C' }}>
      {/* Page Header */}
      <div style={{ backgroundColor: '#1C1C1C' }}>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-[var(--font-test-national-2-narrow)] font-bold uppercase">
                PAYOUT -{' '}
                {new Date(payout.payoutDate).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">
                {new Date(payout.periodStart).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}{' '}
                -{' '}
                {new Date(payout.periodEnd).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
            <button
              className="flex items-center gap-1 text-xs"
              style={{ color: '#52bcd6' }}
            >
              <Download className="h-3 w-3" />
              Download Statement
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Payout Summary */}
          <Card className="border-0">
            <CardHeader>
              <CardTitle className="text-base">PAYOUT SUMMARY</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 border-b border-gray-700 pb-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gross Amount:</span>
                  <span className="font-medium">
                    {formatCurrency(payout.grossAmount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fees:</span>
                  <span className="font-medium text-red-400">
                    -{formatCurrency(payout.fees)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Tax Withholding:
                  </span>
                  <span className="font-medium text-red-400">
                    -{formatCurrency(payout.taxWithholding)}
                  </span>
                </div>
              </div>
              <div className="mt-4 flex justify-between text-xl">
                <span className="font-bold">Net Paid Out:</span>
                <span className="font-bold" style={{ color: '#52bcd6' }}>
                  {formatCurrency(payout.netAmount)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Earning Type Breakdown */}
          <Card className="border-0">
            <CardHeader>
              <CardTitle className="text-base">BY EARNING TYPE</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payout.earningTypeBreakdown.map((breakdown) => (
                  <div
                    key={breakdown.type}
                    className="flex items-center justify-between rounded-[3px] border border-gray-700 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-medium">
                        {getEarningTypeLabel(breakdown.type)}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {breakdown.percentage.toFixed(1)}%
                      </span>
                    </div>
                    <span className="font-bold">
                      {formatCurrency(breakdown.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Platform Breakdown */}
          <Card className="border-0">
            <CardHeader>
              <CardTitle className="text-base">BY PLATFORM</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {payout.platformBreakdown.map((platform) => (
                  <div
                    key={platform.platform}
                    className="flex items-center justify-between border-b border-gray-700 pb-6 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-4">
                      <PlatformIcon platform={platform.platform} size="md" />
                      <div className="space-y-1">
                        <p className="font-medium">
                          {getPlatformName(platform.platform)}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {platform.streams
                            ? `${platform.streams.toLocaleString()} streams`
                            : `${platform.views?.toLocaleString()} views`}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold">
                      {formatCurrency(platform.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Artist → Release → Track Breakdown */}
          {payout.releaseBreakdown.length > 0 && (
            <Card className="border-0">
              <CardHeader>
                <CardTitle className="text-base">BY RELEASE</CardTitle>
              </CardHeader>
              <CardContent>
                <PayoutReleaseBreakdown releases={payout.releaseBreakdown} />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
