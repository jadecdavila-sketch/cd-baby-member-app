'use client';

import { useMemo, useState } from 'react';

import { COLORS } from '@/shared/constants/theme';

import type { EarningType } from '../mock-data';
import { formatCurrency } from '../mock-data';

interface EarningsChartData {
  date: string;
  streaming: number;
  socialVideo: number;
  other?: number;
}

interface EarningsChartProps {
  data: EarningsChartData[];
  selectedType: EarningType | 'all';
  onTypeChange: (type: EarningType | 'all') => void;
}

export function EarningsChart({
  data,
  selectedType,
  onTypeChange,
}: EarningsChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const earningTypeOptions: Array<{
    value: EarningType | 'all';
    label: string;
  }> = [
    { value: 'all', label: 'All Types' },
    { value: 'streaming', label: 'Streaming' },
    { value: 'social-video', label: 'Social Video' },
  ];

  const getColor = (type: EarningType | 'all') => {
    switch (type) {
      case 'streaming':
        return COLORS.primary;
      case 'social-video':
        return COLORS.secondary;
      case 'all':
        return COLORS.primary;
      default:
        return COLORS.primary;
    }
  };
  // Format data and calculate scales
  const chartData = useMemo(() => {
    const formattedData = data.map((item) => ({
      ...item,
      displayDate: new Date(item.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
    }));

    const allValues = formattedData.flatMap((item) => {
      const values = [];
      if (selectedType === 'all' || selectedType === 'streaming') {
        values.push(item.streaming);
      }
      if (selectedType === 'all' || selectedType === 'social-video') {
        values.push(item.socialVideo);
      }
      if (selectedType === 'all' || selectedType === 'other') {
        values.push(item.other ?? 0);
      }
      return values;
    });

    const maxValue = Math.max(...allValues);
    const minValue = Math.min(...allValues);
    const range = maxValue - minValue;
    const padding = range * 0.2;

    return {
      data: formattedData,
      maxValue: maxValue + padding,
      minValue: Math.max(0, minValue - padding),
    };
  }, [data, selectedType]);

  const { data: formattedData, maxValue, minValue } = chartData;
  const valueRange = maxValue - minValue;
  const height = 240;
  const width = 800;
  const padding = { top: 10, right: 20, bottom: 30, left: 50 };
  const chartHeight = height - padding.top - padding.bottom;
  const chartWidth = width - padding.left - padding.right;

  // Calculate points for lines
  const getYPosition = (value: number) => {
    const ratio = (value - minValue) / valueRange;
    return padding.top + chartHeight - ratio * chartHeight;
  };

  const getXPosition = (index: number) => {
    const divisor = formattedData.length > 1 ? formattedData.length - 1 : 1;
    return padding.left + index * (chartWidth / divisor);
  };

  const streamingPath = formattedData
    .map(
      (item, i) =>
        `${i === 0 ? 'M' : 'L'}${getXPosition(i)},${getYPosition(item.streaming)}`
    )
    .join(' ');

  const socialVideoPath = formattedData
    .map(
      (item, i) =>
        `${i === 0 ? 'M' : 'L'}${getXPosition(i)},${getYPosition(item.socialVideo)}`
    )
    .join(' ');

  const otherPath = formattedData
    .map(
      (item, i) =>
        `${i === 0 ? 'M' : 'L'}${getXPosition(i)},${getYPosition(item.other ?? 0)}`
    )
    .join(' ');

  // Create area fill paths (line + bottom edge)
  const streamingAreaPath =
    streamingPath +
    ` L${getXPosition(formattedData.length - 1)},${padding.top + chartHeight} L${padding.left},${padding.top + chartHeight} Z`;

  const socialVideoAreaPath =
    socialVideoPath +
    ` L${getXPosition(formattedData.length - 1)},${padding.top + chartHeight} L${padding.left},${padding.top + chartHeight} Z`;

  const otherAreaPath =
    otherPath +
    ` L${getXPosition(formattedData.length - 1)},${padding.top + chartHeight} L${padding.left},${padding.top + chartHeight} Z`;

  // Color for "other" type
  const otherColor = '#9ca3af'; // gray-400

  // Calculate percentage change for tooltip
  const getPercentageChange = (index: number, type: 'streaming' | 'socialVideo') => {
    if (index === 0) return null;
    const currentItem = formattedData[index];
    const previousItem = formattedData[index - 1];
    if (!currentItem || !previousItem) return null;
    const current = currentItem[type];
    const previous = previousItem[type];
    if (previous === 0) return null;
    return ((current - previous) / previous) * 100;
  };

  // Y-axis ticks
  const yAxisTicks = Array.from({ length: 5 }, (_, i) => {
    const value = minValue + (valueRange * i) / 4;
    return { value, y: getYPosition(value) };
  });

  return (
    <div className="relative w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ maxHeight: '240px' }}
      >
        {/* Gradient definitions */}
        <defs>
          <linearGradient id="streamingGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={COLORS.primary} stopOpacity="0.3" />
            <stop offset="100%" stopColor={COLORS.primary} stopOpacity="0" />
          </linearGradient>
          <linearGradient id="socialVideoGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={COLORS.secondary} stopOpacity="0.3" />
            <stop offset="100%" stopColor={COLORS.secondary} stopOpacity="0" />
          </linearGradient>
          <linearGradient id="otherGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={otherColor} stopOpacity="0.3" />
            <stop offset="100%" stopColor={otherColor} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {yAxisTicks.map((tick, i) => (
          <line
            key={i}
            x1={padding.left}
            y1={tick.y}
            x2={width - padding.right}
            y2={tick.y}
            stroke="#404040"
            strokeDasharray="3 3"
            strokeWidth="0.5"
            opacity="0.5"
          />
        ))}

        {/* Y-axis labels */}
        {yAxisTicks.map((tick, i) => (
          <text
            key={i}
            x={padding.left - 8}
            y={tick.y + 3}
            textAnchor="end"
            fontSize="11"
            fill="#a3a3a3"
          >
            ${tick.value.toFixed(0)}
          </text>
        ))}

        {/* X-axis labels */}
        {formattedData.map((item, i) => (
          <text
            key={i}
            x={getXPosition(i)}
            y={height - padding.bottom + 18}
            textAnchor="middle"
            fontSize="11"
            fill="#a3a3a3"
          >
            {item.displayDate}
          </text>
        ))}

        {/* Streaming area fill */}
        {(selectedType === 'all' || selectedType === 'streaming') && (
          <path
            d={streamingAreaPath}
            fill="url(#streamingGradient)"
            style={{
              animation: 'fadeIn 0.8s ease-out',
            }}
          />
        )}

        {/* Social Video area fill */}
        {(selectedType === 'all' || selectedType === 'social-video') && (
          <path
            d={socialVideoAreaPath}
            fill="url(#socialVideoGradient)"
            style={{
              animation: 'fadeIn 0.8s ease-out',
            }}
          />
        )}

        {/* Other area fill */}
        {(selectedType === 'all' || selectedType === 'other') && (
          <path
            d={otherAreaPath}
            fill="url(#otherGradient)"
            style={{
              animation: 'fadeIn 0.8s ease-out',
            }}
          />
        )}

        {/* Streaming line */}
        {(selectedType === 'all' || selectedType === 'streaming') && (
          <path
            d={streamingPath}
            fill="none"
            stroke={COLORS.primary}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: '1000',
              strokeDashoffset: '1000',
              animation: 'drawLine 1.5s ease-out forwards',
            }}
          />
        )}

        {/* Social Video line */}
        {(selectedType === 'all' || selectedType === 'social-video') && (
          <path
            d={socialVideoPath}
            fill="none"
            stroke={COLORS.secondary}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: '1000',
              strokeDashoffset: '1000',
              animation: 'drawLine 1.5s ease-out forwards',
            }}
          />
        )}

        {/* Other line */}
        {(selectedType === 'all' || selectedType === 'other') && (
          <path
            d={otherPath}
            fill="none"
            stroke={otherColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: '1000',
              strokeDashoffset: '1000',
              animation: 'drawLine 1.5s ease-out forwards',
            }}
          />
        )}

        {/* Interactive data points */}
        {formattedData.map((item, i) => (
          <g key={i}>
            {/* Visible data point - Streaming */}
            {(selectedType === 'all' || selectedType === 'streaming') && (
              <>
                {/* Invisible larger hit area for better hover */}
                <circle
                  cx={getXPosition(i)}
                  cy={getYPosition(item.streaming)}
                  r="12"
                  fill="transparent"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
                {/* Visible dot */}
                <circle
                  cx={getXPosition(i)}
                  cy={getYPosition(item.streaming)}
                  r={hoveredIndex === i ? '5' : '3'}
                  fill={COLORS.primary}
                  stroke={COLORS.bgDark}
                  strokeWidth="2"
                  style={{
                    transition: 'r 0.2s ease',
                    cursor: 'pointer',
                    opacity: hoveredIndex === i ? 1 : 0.8,
                  }}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              </>
            )}

            {/* Visible data point - Social Video */}
            {(selectedType === 'all' || selectedType === 'social-video') && (
              <>
                {/* Invisible larger hit area for better hover */}
                <circle
                  cx={getXPosition(i)}
                  cy={getYPosition(item.socialVideo)}
                  r="12"
                  fill="transparent"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
                {/* Visible dot */}
                <circle
                  cx={getXPosition(i)}
                  cy={getYPosition(item.socialVideo)}
                  r={hoveredIndex === i ? '5' : '3'}
                  fill={COLORS.secondary}
                  stroke={COLORS.bgDark}
                  strokeWidth="2"
                  style={{
                    transition: 'r 0.2s ease',
                    cursor: 'pointer',
                    opacity: hoveredIndex === i ? 1 : 0.8,
                  }}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              </>
            )}

            {/* Visible data point - Other */}
            {(selectedType === 'all' || selectedType === 'other') && (
              <>
                {/* Invisible larger hit area for better hover */}
                <circle
                  cx={getXPosition(i)}
                  cy={getYPosition(item.other ?? 0)}
                  r="12"
                  fill="transparent"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
                {/* Visible dot */}
                <circle
                  cx={getXPosition(i)}
                  cy={getYPosition(item.other ?? 0)}
                  r={hoveredIndex === i ? '5' : '3'}
                  fill={otherColor}
                  stroke={COLORS.bgDark}
                  strokeWidth="2"
                  style={{
                    transition: 'r 0.2s ease',
                    cursor: 'pointer',
                    opacity: hoveredIndex === i ? 1 : 0.8,
                  }}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              </>
            )}
          </g>
        ))}
      </svg>

      {/* Rich tooltip */}
      {hoveredIndex !== null && formattedData[hoveredIndex] && (
        <div
          className="absolute rounded-lg border border-gray-600 p-3 shadow-lg"
          style={{
            backgroundColor: COLORS.bgCard,
            left: `${(getXPosition(hoveredIndex) / width) * 100}%`,
            top: '10px',
            transform: 'translateX(-50%)',
            zIndex: 10,
            minWidth: '180px',
            animation: 'tooltipFadeIn 0.2s ease-out',
          }}
        >
          <p className="mb-2 text-xs font-medium text-gray-400">
            {formattedData[hoveredIndex].displayDate}
          </p>

          {(selectedType === 'all' || selectedType === 'streaming') && (
            <div className="mb-2">
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: COLORS.primary }}>
                  Streaming
                </span>
                <span className="font-bold" style={{ color: COLORS.primary }}>
                  {formatCurrency(formattedData[hoveredIndex].streaming)}
                </span>
              </div>
              {getPercentageChange(hoveredIndex, 'streaming') !== null && (
                <p
                  className="text-xs"
                  style={{
                    color:
                      getPercentageChange(hoveredIndex, 'streaming')! > 0
                        ? COLORS.success
                        : COLORS.error,
                  }}
                >
                  {getPercentageChange(hoveredIndex, 'streaming')! > 0
                    ? '↑'
                    : '↓'}{' '}
                  {Math.abs(
                    getPercentageChange(hoveredIndex, 'streaming')!
                  ).toFixed(1)}
                  % from previous
                </p>
              )}
            </div>
          )}

          {(selectedType === 'all' || selectedType === 'social-video') && (
            <div className="mb-2">
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: COLORS.secondary }}>
                  Social Video
                </span>
                <span className="font-bold" style={{ color: COLORS.secondary }}>
                  {formatCurrency(formattedData[hoveredIndex].socialVideo)}
                </span>
              </div>
              {getPercentageChange(hoveredIndex, 'socialVideo') !== null && (
                <p
                  className="text-xs"
                  style={{
                    color:
                      getPercentageChange(hoveredIndex, 'socialVideo')! > 0
                        ? COLORS.success
                        : COLORS.error,
                  }}
                >
                  {getPercentageChange(hoveredIndex, 'socialVideo')! > 0
                    ? '↑'
                    : '↓'}{' '}
                  {Math.abs(
                    getPercentageChange(hoveredIndex, 'socialVideo')!
                  ).toFixed(1)}
                  % from previous
                </p>
              )}
            </div>
          )}

          {(selectedType === 'all' || selectedType === 'other') && (
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: otherColor }}>
                  Other
                </span>
                <span className="font-bold" style={{ color: otherColor }}>
                  {formatCurrency(formattedData[hoveredIndex].other ?? 0)}
                </span>
              </div>
            </div>
          )}

          {selectedType === 'all' && (
            <div className="mt-2 border-t border-gray-600 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-400">Total</span>
                <span className="font-bold text-white">
                  {formatCurrency(
                    formattedData[hoveredIndex].streaming +
                      formattedData[hoveredIndex].socialVideo +
                      (formattedData[hoveredIndex].other ?? 0)
                  )}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CSS animations */}
      <style jsx>{`
        @keyframes drawLine {
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes tooltipFadeIn {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
