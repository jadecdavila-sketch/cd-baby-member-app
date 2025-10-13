'use client';

import { ArrowDown, ArrowUp, Music, Heart, Eye, Share2, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { formatNumber, getMetricLabel, type KPI } from '../mock-data';

interface KPICardsProps {
  kpis: KPI[];
}

export function KPICards({ kpis }: KPICardsProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'streams':
        return Music;
      case 'creations':
        return Sparkles;
      case 'views':
        return Eye;
      case 'likes':
        return Heart;
      case 'shares':
        return Share2;
      default:
        return Music;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'streams':
        return 'text-[var(--cdbaby-light-blue)]';
      case 'creations':
        return 'text-[var(--cdbaby-purple)]';
      case 'views':
        return 'text-[var(--cdbaby-green)]';
      case 'likes':
        return 'text-[var(--cdbaby-pink)]';
      case 'shares':
        return 'text-[var(--cdbaby-orange)]';
      default:
        return 'text-[var(--cdbaby-light-blue)]';
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'streams':
        return 'bg-[var(--cdbaby-light-blue)]/10';
      case 'creations':
        return 'bg-[var(--cdbaby-purple)]/10';
      case 'views':
        return 'bg-[var(--cdbaby-green)]/10';
      case 'likes':
        return 'bg-[var(--cdbaby-pink)]/10';
      case 'shares':
        return 'bg-[var(--cdbaby-orange)]/10';
      default:
        return 'bg-[var(--cdbaby-light-blue)]/10';
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
      {kpis.map((kpi) => {
        const Icon = getIcon(kpi.type);
        const isPositive = kpi.percentChange >= 0;
        const colorClass = getColor(kpi.type);
        const bgColorClass = getBgColor(kpi.type);

        return (
          <Card
            key={kpi.type}
            className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            <CardContent className="p-6">
              {/* Icon and Label */}
              <div className="mb-3 flex items-center gap-3">
                <div className={`inline-flex rounded-lg p-2 ${bgColorClass}`}>
                  <Icon className={`h-5 w-5 ${colorClass}`} />
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  {getMetricLabel(kpi.type)}
                </p>
              </div>

              {/* Current Value */}
              <p className="mb-2 text-3xl font-bold font-[var(--font-test-national-2-narrow)]">
                {formatNumber(kpi.current)}
              </p>

              {/* Percent Change */}
              <div className="flex items-center gap-1">
                {isPositive ? (
                  <ArrowUp className="h-4 w-4 text-[var(--cdbaby-green)]" />
                ) : (
                  <ArrowDown className="h-4 w-4 text-[var(--cdbaby-red)]" />
                )}
                <span
                  className={`text-sm font-semibold ${
                    isPositive
                      ? 'text-[var(--cdbaby-green)]'
                      : 'text-[var(--cdbaby-red)]'
                  }`}
                >
                  {Math.abs(kpi.percentChange).toFixed(1)}%
                </span>
                <span className="text-sm text-muted-foreground">vs last period</span>
              </div>

              {/* Animated background gradient on hover */}
              <div
                className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-5 ${bgColorClass}`}
              />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
