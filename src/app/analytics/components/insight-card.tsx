'use client';

import {
  Sparkles,
  TrendingUp,
  Target,
  Trophy,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';

import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/shadcn/button';

import type { AIInsight } from '../mock-data';

interface InsightCardProps {
  insight: AIInsight;
}

export function InsightCard({ insight }: InsightCardProps) {
  const getIcon = (category: string) => {
    switch (category) {
      case 'trending':
        return TrendingUp;
      case 'opportunity':
        return Target;
      case 'achievement':
        return Trophy;
      case 'alert':
        return AlertCircle;
      default:
        return Sparkles;
    }
  };

  const getColorClasses = (category: string) => {
    switch (category) {
      case 'trending':
        return {
          bg: 'bg-[var(--cdbaby-green)]/10',
          icon: 'text-[var(--cdbaby-green)]',
          border: 'border-[var(--cdbaby-green)]/20',
        };
      case 'opportunity':
        return {
          bg: 'bg-[var(--cdbaby-light-blue)]/10',
          icon: 'text-[var(--cdbaby-light-blue)]',
          border: 'border-[var(--cdbaby-light-blue)]/20',
        };
      case 'achievement':
        return {
          bg: 'bg-[var(--cdbaby-yellow)]/10',
          icon: 'text-[var(--cdbaby-yellow)]',
          border: 'border-[var(--cdbaby-yellow)]/20',
        };
      case 'alert':
        return {
          bg: 'bg-[var(--cdbaby-red)]/10',
          icon: 'text-[var(--cdbaby-red)]',
          border: 'border-[var(--cdbaby-red)]/20',
        };
      default:
        return {
          bg: 'bg-[var(--cdbaby-purple)]/10',
          icon: 'text-[var(--cdbaby-purple)]',
          border: 'border-[var(--cdbaby-purple)]/20',
        };
    }
  };

  const Icon = getIcon(insight.category);
  const colors = getColorClasses(insight.category);

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Icon and Title Row */}
          <div className="flex items-center gap-3">
            <div
              className={`inline-flex flex-shrink-0 rounded-lg p-3 ${colors.bg}`}
            >
              <Icon className={`h-5 w-5 ${colors.icon}`} />
            </div>
            <h3 className="text-lg font-bold">{insight.title}</h3>
          </div>

          {/* Description and Button Row */}
          <div className="flex items-start justify-between gap-4">
            <p className="text-muted-foreground flex-1 text-sm leading-relaxed">
              {insight.description}
            </p>

            {/* Action Button */}
            {insight.actionLabel && (
              <Button
                variant="outline"
                size="sm"
                className={`!w-auto flex-shrink-0 transition-all duration-300 ${colors.icon}`}
                onClick={() => {
                  if (insight.actionUrl) {
                    window.location.href = insight.actionUrl;
                  }
                }}
              >
                {insight.actionLabel}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Animated background on hover */}
        <div
          className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-5 ${colors.bg}`}
        />
      </CardContent>
    </Card>
  );
}
