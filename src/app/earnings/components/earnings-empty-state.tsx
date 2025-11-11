'use client';

import { DollarSign, Sparkles, TrendingUp } from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Button } from '@/shared/components/shadcn/button';
import { COLORS } from '@/shared/constants/theme';

export function EarningsEmptyState() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <Card className="border-0" style={{ backgroundColor: '#61113A' }}>
        <CardContent className="p-8 md:p-12">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 flex justify-center">
              <div
                className="flex h-20 w-20 items-center justify-center rounded-full"
                style={{ backgroundColor: 'rgba(255, 56, 106, 0.2)' }}
              >
                <DollarSign
                  className="h-10 w-10"
                  style={{ color: '#ff386a' }}
                />
              </div>
            </div>

            <h2 className="mb-4 text-4xl font-[var(--font-test-national-2-narrow)] font-bold">
              Silence for now — soon, it'll be sound
            </h2>

            <p className="text-muted-foreground mb-8 text-xl">
              Your dashboard will light up once your music hits the world
            </p>

            <Button
              className="h-12 px-8 text-base font-medium"
              style={{
                backgroundColor: COLORS.primary,
                color: 'white',
              }}
            >
              Learn how earnings work
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Support Section */}
      <Card className="border-0" style={{ backgroundColor: '#2A2A2A' }}>
        <CardContent className="p-8">
          <div className="text-center">
            <p className="text-muted-foreground text-lg">
              Artists on CD Baby earned over{' '}
              <span
                className="font-bold text-xl"
                style={{ color: '#7fc832' }}
              >
                $3.2 million
              </span>{' '}
              last month.
            </p>
            <p
              className="mt-2 text-2xl font-bold"
              style={{ color: '#ff386a' }}
            >
              You're next.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Ghost Chart + Shimmer Placeholder */}
      <Card className="border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Earnings Over Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Ghost Chart */}
          <div className="relative h-64 overflow-hidden rounded-lg bg-gradient-to-b from-white/5 to-white/10">
            {/* Shimmer Effect */}
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Ghost Chart Bars */}
            <div className="flex h-full items-end justify-around p-6">
              {[30, 45, 35, 50, 40, 55, 42, 60, 48, 65, 52, 70].map(
                (height, i) => (
                  <div
                    key={i}
                    className="w-full max-w-[40px] rounded-t opacity-30"
                    style={{
                      height: `${height}%`,
                      backgroundColor: COLORS.primary,
                    }}
                  />
                )
              )}
            </div>

            {/* Overlay text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Sparkles
                  className="mx-auto mb-2 h-8 w-8 opacity-40"
                  style={{ color: COLORS.primary }}
                />
                <p className="text-muted-foreground text-sm">
                  Your earnings will appear here
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shimmer Placeholder Tiles */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          'Total Earnings',
          'Current Balance',
          'Last Payout',
          'Streaming Revenue',
        ].map((title, i) => (
          <Card
            key={i}
            className="border-0 overflow-hidden relative"
            style={{ backgroundColor: '#2A2A2A' }}
          >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <CardHeader className="pb-3">
              <CardTitle className="text-sm opacity-50">{title}</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Ghost number */}
              <div
                className="h-10 w-24 rounded opacity-20"
                style={{ backgroundColor: COLORS.textWhite }}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
