'use client';

import { useState, useMemo } from 'react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';

import type { TimeSeriesDataPoint, MetricType } from '../mock-data';
import { getMetricLabel, formatNumber } from '../mock-data';

interface MetricsChartProps {
  data: TimeSeriesDataPoint[];
}

export function MetricsChart({ data }: MetricsChartProps) {
  type ChartMetricType = 'streams' | 'creations' | 'views';
  const [selectedMetric, setSelectedMetric] = useState<ChartMetricType>('streams');

  const metricOptions: ChartMetricType[] = ['streams', 'creations', 'views'];

  const getColor = (metric: ChartMetricType) => {
    switch (metric) {
      case 'streams':
        return '#34D5FD';
      case 'creations':
        return '#A855F7';
      case 'views':
        return '#22C55E';
      default:
        return '#34D5FD';
    }
  };

  // Use useMemo to recalculate chart elements when data or metric changes
  const chartElements = useMemo(() => {
    const width = 800;
    const height = 200;
    const padding = { top: 20, right: 20, bottom: 30, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const values = data.map((d) => d[selectedMetric]);
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    const range = maxValue - minValue || 1;

    const points = data.map((point, index) => {
      const x = padding.left + (index / (data.length - 1)) * chartWidth;
      const y =
        padding.top +
        chartHeight -
        ((point[selectedMetric] - minValue) / range) * chartHeight;
      return { x, y, value: point[selectedMetric], date: point.date };
    });

    const linePath = points
      .map((point, index) =>
        index === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`
      )
      .join(' ');

    const lastPoint = points[points.length - 1];
    const areaPath = lastPoint
      ? `${linePath} L ${lastPoint.x} ${padding.top + chartHeight} L ${padding.left} ${padding.top + chartHeight} Z`
      : '';

    const yAxisSteps = 5;
    const yAxisLabels = Array.from({ length: yAxisSteps }, (_, i) => {
      const value = minValue + (range / (yAxisSteps - 1)) * i;
      const y =
        padding.top + chartHeight - (i / (yAxisSteps - 1)) * chartHeight;
      return { value, y };
    });

    return {
      width,
      height,
      padding,
      points,
      linePath,
      areaPath,
      yAxisLabels,
      maxValue,
      minValue,
      avgValue: Math.round(
        values.reduce((sum, v) => sum + v, 0) / values.length
      ),
    };
  }, [data, selectedMetric]);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Performance Over Time</CardTitle>
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
        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${chartElements.width} ${chartElements.height}`}
            className="w-full"
            style={{ minHeight: '200px' }}
          >
            {/* Grid lines */}
            {chartElements.yAxisLabels.map((label, i) => (
              <line
                key={`grid-${i}`}
                x1={chartElements.padding.left}
                y1={label.y}
                x2={chartElements.width - chartElements.padding.right}
                y2={label.y}
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="1"
              />
            ))}

            {/* Y-axis labels */}
            {chartElements.yAxisLabels.map((label, i) => (
              <text
                key={`ylabel-${i}`}
                x={chartElements.padding.left - 10}
                y={label.y}
                textAnchor="end"
                alignmentBaseline="middle"
                fill="rgba(255, 255, 255, 0.6)"
                fontSize="12"
              >
                {formatNumber(label.value)}
              </text>
            ))}

            {/* Area fill */}
            <path
              d={chartElements.areaPath}
              fill={getColor(selectedMetric)}
              fillOpacity="0.1"
            />

            {/* Line */}
            <path
              d={chartElements.linePath}
              fill="none"
              stroke={getColor(selectedMetric)}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data points */}
            {chartElements.points.map((point, index) => (
              <g key={`point-${index}-${point.value}`}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="5"
                  fill={getColor(selectedMetric)}
                  stroke="white"
                  strokeWidth="2"
                  className="cursor-pointer"
                />
                <title>
                  {new Date(point.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                  : {formatNumber(point.value)}
                </title>
              </g>
            ))}

            {/* X-axis labels */}
            {chartElements.points.map((point, index) => {
              const date = new Date(point.date);
              const label = date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              });
              return (
                <text
                  key={`xlabel-${index}`}
                  x={point.x}
                  y={chartElements.height - 10}
                  textAnchor="middle"
                  fill="rgba(255, 255, 255, 0.6)"
                  fontSize="12"
                >
                  {label}
                </text>
              );
            })}
          </svg>
        </div>

        {/* Summary stats */}
        <div
          className="mt-6 grid grid-cols-3 gap-4 rounded-lg p-4"
          style={{ backgroundColor: '#1C1C1C' }}
        >
          <div className="text-center">
            <p className="text-muted-foreground text-sm">Peak</p>
            <p
              className="text-lg font-bold"
              style={{ color: getColor(selectedMetric) }}
            >
              {formatNumber(chartElements.maxValue)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground text-sm">Lowest</p>
            <p className="text-lg font-bold">
              {formatNumber(chartElements.minValue)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground text-sm">Average</p>
            <p className="text-lg font-bold">
              {formatNumber(chartElements.avgValue)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
