'use client';

import { useState, useEffect, useRef } from 'react';
import { Globe, TrendingUp } from 'lucide-react';
import { scaleLinear } from 'd3-scale';
import { interpolateRgb } from 'd3-interpolate';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Button } from '@/shared/components/shadcn/button';

import type { GeographicData, MetricType } from '../mock-data';
import { getMetricLabel, formatNumber } from '../mock-data';

// Helper function to add basePath for production
const getAssetPath = (path: string) => {
  const basePath =
    process.env.NODE_ENV === 'production' ? '/cd-baby-member-app' : '';
  return `${basePath}${path}`;
};

interface GeographicMapProps {
  data: GeographicData[];
}

export function GeographicMap({ data }: GeographicMapProps) {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('streams');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const metricOptions: MetricType[] = ['streams', 'creations', 'views'];

  const getColor = (metric: MetricType) => {
    switch (metric) {
      case 'streams':
        return 'var(--cdbaby-light-blue)';
      case 'creations':
        return 'var(--cdbaby-purple)';
      case 'views':
        return 'var(--cdbaby-green)';
      default:
        return 'var(--cdbaby-light-blue)';
    }
  };

  // Sort data by selected metric
  const sortedData = [...data].sort(
    (a, b) => b[selectedMetric] - a[selectedMetric]
  );

  // Get max value for calculating bar width
  const maxValue = Math.max(...sortedData.map((d) => d[selectedMetric]));

  // Get country flag emoji
  const getFlagEmoji = (countryCode: string) => {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  // Create color intensity based on value
  const getColorIntensity = (value: number) => {
    const intensity = value / maxValue;
    return intensity;
  };

  // Map country codes to data
  const countryDataMap = new Map(
    data.map((country) => [country.countryCode.toUpperCase(), country])
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            <CardTitle>Geographic Performance</CardTitle>
          </div>
          <div className="border-border inline-flex flex-shrink-0 overflow-hidden rounded-lg border">
            {metricOptions.map((metric) => (
              <button
                key={metric}
                onClick={() => setSelectedMetric(metric)}
                className="border-border border-r px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-all duration-200 last:border-r-0"
                style={{
                  backgroundColor:
                    selectedMetric === metric
                      ? getColor(metric)
                      : 'transparent',
                  color:
                    selectedMetric === metric
                      ? 'white'
                      : 'rgba(255, 255, 255, 0.7)',
                }}
              >
                {getMetricLabel(metric)}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* World Map */}
        <div className="mb-6 rounded-lg bg-[#0a0a0a] p-6">
          <img
            src={getAssetPath('/world-map.jpg')}
            alt="World Map"
            className="h-auto w-full rounded"
          />
        </div>

        {/* Top Countries Table */}
        {!isMounted ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-muted-foreground border-b text-left text-sm font-medium">
                  <th className="pb-2">Rank</th>
                  <th className="pb-2">Country</th>
                  <th className="pb-2 text-right">
                    {getMetricLabel(selectedMetric)}
                  </th>
                  <th className="pb-2 text-right">% of Total</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.slice(0, 5).map((country, index) => {
                  const value = country[selectedMetric];
                  const total = sortedData.reduce(
                    (sum, c) => sum + c[selectedMetric],
                    0
                  );
                  const percentage = ((value / total) * 100).toFixed(1);

                  return (
                    <tr
                      key={`ssr-${country.countryCode}`}
                      className="hover:bg-muted/50 border-b transition-colors"
                    >
                      <td className="py-3 text-sm font-medium">#{index + 1}</td>
                      <td className="py-3">
                        <span className="text-sm font-medium">
                          {country.country}
                        </span>
                      </td>
                      <td className="py-3 text-right text-sm font-bold">
                        {formatNumber(value)}
                      </td>
                      <td className="text-muted-foreground py-3 text-right text-sm">
                        {percentage}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-muted-foreground border-b text-left text-sm font-medium">
                  <th className="pb-2">Rank</th>
                  <th className="pb-2">Country</th>
                  <th className="pb-2 text-right">
                    {getMetricLabel(selectedMetric)}
                  </th>
                  <th className="pb-2 text-right">% of Total</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((country, index) => {
                  const value = country[selectedMetric];
                  const total = sortedData.reduce(
                    (sum, c) => sum + c[selectedMetric],
                    0
                  );
                  const percentage = ((value / total) * 100).toFixed(1);

                  return (
                    <tr
                      key={country.countryCode}
                      className="hover:bg-muted/50 border-b transition-colors"
                    >
                      <td className="py-3 text-sm font-medium">#{index + 1}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">
                            {getFlagEmoji(country.countryCode)}
                          </span>
                          <span className="text-sm font-medium">
                            {country.country}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 text-right text-sm font-bold">
                        {formatNumber(value)}
                      </td>
                      <td className="text-muted-foreground py-3 text-right text-sm">
                        {percentage}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </Card>
  );
}
