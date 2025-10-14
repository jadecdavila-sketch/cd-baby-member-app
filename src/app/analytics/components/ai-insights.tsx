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

interface AIInsightsProps {
  insights: AIInsight[];
}

export function AIInsights({ insights }: AIInsightsProps) {
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

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="mb-2 flex items-center gap-2">
        <Sparkles className="h-6 w-6 text-[var(--cdbaby-purple)]" />
        <h2 className="text-2xl font-[var(--font-test-national-2-narrow)] font-bold uppercase">
          AI INSIGHTS
        </h2>
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {insights.map((insight) => {
          const Icon = getIcon(insight.category);
          const colors = getColorClasses(insight.category);

          return (
            <Card
              key={insight.id}
              className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <CardContent className="p-6">
                {/* Icon and Title Row */}
                <div className="mb-3 flex items-center gap-3">
                  <div className={`inline-flex rounded-lg p-3 ${colors.bg}`}>
                    <Icon className={`h-5 w-5 ${colors.icon}`} />
                  </div>
                  <h3 className="text-lg font-bold">{insight.title}</h3>
                </div>

                {/* Description */}
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                  {insight.description}
                </p>

                {/* Action Button */}
                {insight.actionLabel && (
                  <Button
                    variant="outline"
                    size="sm"
                    className={`group/btn w-full transition-all duration-300 ${colors.icon}`}
                    onClick={() => {
                      if (insight.actionUrl) {
                        window.location.href = insight.actionUrl;
                      }
                    }}
                  >
                    {insight.actionLabel}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </Button>
                )}

                {/* Animated background on hover */}
                <div
                  className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-5 ${colors.bg}`}
                />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
