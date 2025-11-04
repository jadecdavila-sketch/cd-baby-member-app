'use client';

import { useState } from 'react';
import { Download, ChevronDown, Music, Video, Receipt, Banknote, FileText } from 'lucide-react';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/shared/components/shadcn/sheet';
import { Button } from '@/shared/components/shadcn/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/shadcn/select';
import { COLORS } from '@/shared/constants/theme';

interface ReportsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ReportType =
  | 'digital-distribution'
  | 'svm'
  | 'account-transactions'
  | 'payout-statement'
  | 'publishing-quarterly';

type TimeframeType = 'monthly' | 'quarterly' | 'yearly' | 'lifetime' | 'specific-payout';

interface ReportConfig {
  id: ReportType;
  name: string;
  description: string;
  icon: typeof Music;
  color: string;
  formats: Array<'PDF' | 'Excel' | 'CSV'>;
  timeframeOptions: TimeframeType[];
}

const reportConfigs: ReportConfig[] = [
  {
    id: 'digital-distribution',
    name: 'Digital Distribution Earnings',
    description: 'Streaming revenue by platform and track',
    icon: Music,
    color: COLORS.primary,
    formats: ['PDF', 'Excel'],
    timeframeOptions: ['monthly', 'yearly', 'lifetime'],
  },
  {
    id: 'svm',
    name: 'Social Video Monetization (SVM)',
    description: 'TikTok, Instagram, YouTube Shorts, and Facebook revenue',
    icon: Video,
    color: COLORS.secondary,
    formats: ['PDF', 'Excel'],
    timeframeOptions: ['monthly', 'yearly', 'lifetime'],
  },
  {
    id: 'account-transactions',
    name: 'Account Transactions',
    description: 'Complete ledger of all deposits and payouts',
    icon: Receipt,
    color: COLORS.success,
    formats: ['PDF', 'CSV'],
    timeframeOptions: ['monthly', 'yearly', 'lifetime'],
  },
  {
    id: 'payout-statement',
    name: 'Payout Statement',
    description: 'Detailed breakdown of a specific payout',
    icon: Banknote,
    color: '#8b5cf6',
    formats: ['PDF'],
    timeframeOptions: ['specific-payout'],
  },
  {
    id: 'publishing-quarterly',
    name: 'Publishing Quarterly Royalty Report',
    description: 'Publishing-specific royalty data by quarter',
    icon: FileText,
    color: COLORS.error,
    formats: ['PDF'],
    timeframeOptions: ['quarterly'],
  },
];

// Generate month and year options
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];

// Mock payout history for dropdown
const mockPayouts = [
  { id: 'payout-1', label: 'November 2024 - $1,234.56' },
  { id: 'payout-2', label: 'October 2024 - $987.65' },
  { id: 'payout-3', label: 'September 2024 - $1,543.21' },
];

export function ReportsDrawer({ open, onOpenChange }: ReportsDrawerProps) {
  const [expandedReport, setExpandedReport] = useState<ReportType | null>(null);
  const [selectedTimeframes, setSelectedTimeframes] = useState<
    Record<ReportType, {
      type: TimeframeType;
      month?: string;
      quarter?: string;
      year?: string;
      payout?: string;
    }>
  >({
    'digital-distribution': { type: 'monthly', month: 'November', year: String(currentYear) },
    'svm': { type: 'monthly', month: 'November', year: String(currentYear) },
    'account-transactions': { type: 'monthly', month: 'November', year: String(currentYear) },
    'payout-statement': { type: 'specific-payout', payout: 'payout-1' },
    'publishing-quarterly': { type: 'quarterly', quarter: 'Q4', year: String(currentYear) },
  });
  const [selectedFormats, setSelectedFormats] = useState<Record<ReportType, string>>({
    'digital-distribution': 'PDF',
    'svm': 'PDF',
    'account-transactions': 'PDF',
    'payout-statement': 'PDF',
    'publishing-quarterly': 'PDF',
  });

  const toggleReport = (reportId: ReportType) => {
    setExpandedReport(expandedReport === reportId ? null : reportId);
  };

  const handleTimeframeChange = (reportId: ReportType, type: TimeframeType) => {
    setSelectedTimeframes((prev) => ({
      ...prev,
      [reportId]: { ...prev[reportId], type },
    }));
  };

  const handleGenerate = (reportId: ReportType) => {
    // TODO: Implement report generation
    console.log('Generate report:', reportId, selectedTimeframes[reportId], selectedFormats[reportId]);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full border-0 sm:max-w-lg overflow-y-auto"
        style={{ backgroundColor: COLORS.bgDark }}
      >
        <SheetHeader>
          <SheetTitle className="text-2xl font-[var(--font-test-national-2-narrow)] font-bold uppercase">
            DOWNLOAD REPORTS
          </SheetTitle>
          <p className="text-muted-foreground text-sm mt-2">
            Generate and download detailed earnings reports
          </p>
        </SheetHeader>

        <div className="space-y-3 px-4 pb-8">
          {reportConfigs.map((report) => {
            const Icon = report.icon;
            const isExpanded = expandedReport === report.id;
            const timeframe = selectedTimeframes[report.id];

            return (
              <div
                key={report.id}
                className="rounded-[3px] border border-gray-700 overflow-hidden transition-all"
                style={{ backgroundColor: COLORS.bgCard }}
              >
                {/* Card Header - Clickable */}
                <button
                  type="button"
                  onClick={() => toggleReport(report.id)}
                  aria-expanded={isExpanded}
                  aria-controls={`report-content-${report.id}`}
                  aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${report.name} report options`}
                  className="w-full p-4 text-left transition-colors hover:bg-white/5"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div
                        className="flex-shrink-0 rounded-md p-2"
                        style={{ backgroundColor: `${report.color}20` }}
                      >
                        <Icon className="h-5 w-5" style={{ color: report.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium mb-1">{report.name}</h3>
                        <p className="text-muted-foreground text-xs">
                          {report.description}
                        </p>
                      </div>
                    </div>
                    <ChevronDown
                      className="h-5 w-5 text-gray-400 flex-shrink-0 ml-2 transition-transform"
                      style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    />
                  </div>
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div id={`report-content-${report.id}`} className="px-4 pb-4 space-y-4 border-t border-gray-700 pt-4">
                    {/* Timeframe Selection */}
                    <div>
                      <label className="text-muted-foreground block text-xs font-medium mb-2">
                        Timeframe
                      </label>
                      <div className="space-y-3">
                        {/* Timeframe Type Toggles */}
                        {report.timeframeOptions.length > 1 && (
                          <div className="border-border inline-flex flex-shrink-0 overflow-hidden rounded-lg border">
                            {report.timeframeOptions.map((option, idx) => (
                              <button
                                key={option}
                                type="button"
                                onClick={() => handleTimeframeChange(report.id, option)}
                                aria-pressed={timeframe.type === option}
                                className="border-border border-r px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all duration-200 last:border-r-0"
                                style={{
                                  backgroundColor:
                                    timeframe.type === option ? COLORS.primary : 'transparent',
                                  color:
                                    timeframe.type === option ? COLORS.textWhite : COLORS.textGray,
                                }}
                              >
                                {option === 'monthly' && 'Monthly'}
                                {option === 'quarterly' && 'Quarterly'}
                                {option === 'yearly' && 'Yearly'}
                                {option === 'lifetime' && 'Lifetime'}
                                {option === 'specific-payout' && 'Select Payout'}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Date Selection Based on Timeframe Type */}
                        {timeframe.type === 'monthly' && (
                          <div className="grid grid-cols-2 gap-2">
                            <Select
                              value={timeframe.month}
                              onValueChange={(value) =>
                                setSelectedTimeframes((prev) => ({
                                  ...prev,
                                  [report.id]: { ...prev[report.id], month: value },
                                }))
                              }
                            >
                              <SelectTrigger size="sm">
                                <SelectValue placeholder="Month" />
                              </SelectTrigger>
                              <SelectContent>
                                {months.map((month) => (
                                  <SelectItem key={month} value={month}>
                                    {month}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Select
                              value={timeframe.year}
                              onValueChange={(value) =>
                                setSelectedTimeframes((prev) => ({
                                  ...prev,
                                  [report.id]: { ...prev[report.id], year: value },
                                }))
                              }
                            >
                              <SelectTrigger size="sm">
                                <SelectValue placeholder="Year" />
                              </SelectTrigger>
                              <SelectContent>
                                {years.map((year) => (
                                  <SelectItem key={year} value={String(year)}>
                                    {year}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        {timeframe.type === 'quarterly' && (
                          <div className="grid grid-cols-2 gap-2">
                            <Select
                              value={timeframe.quarter}
                              onValueChange={(value) =>
                                setSelectedTimeframes((prev) => ({
                                  ...prev,
                                  [report.id]: { ...prev[report.id], quarter: value },
                                }))
                              }
                            >
                              <SelectTrigger size="sm">
                                <SelectValue placeholder="Quarter" />
                              </SelectTrigger>
                              <SelectContent>
                                {quarters.map((quarter) => (
                                  <SelectItem key={quarter} value={quarter}>
                                    {quarter}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Select
                              value={timeframe.year}
                              onValueChange={(value) =>
                                setSelectedTimeframes((prev) => ({
                                  ...prev,
                                  [report.id]: { ...prev[report.id], year: value },
                                }))
                              }
                            >
                              <SelectTrigger size="sm">
                                <SelectValue placeholder="Year" />
                              </SelectTrigger>
                              <SelectContent>
                                {years.map((year) => (
                                  <SelectItem key={year} value={String(year)}>
                                    {year}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        {timeframe.type === 'yearly' && (
                          <Select
                            value={timeframe.year}
                            onValueChange={(value) =>
                              setSelectedTimeframes((prev) => ({
                                ...prev,
                                [report.id]: { ...prev[report.id], year: value },
                              }))
                            }
                          >
                            <SelectTrigger size="sm">
                              <SelectValue placeholder="Year" />
                            </SelectTrigger>
                            <SelectContent>
                              {years.map((year) => (
                                <SelectItem key={year} value={String(year)}>
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}

                        {timeframe.type === 'specific-payout' && (
                          <Select
                            value={timeframe.payout}
                            onValueChange={(value) =>
                              setSelectedTimeframes((prev) => ({
                                ...prev,
                                [report.id]: { ...prev[report.id], payout: value },
                              }))
                            }
                          >
                            <SelectTrigger size="sm">
                              <SelectValue placeholder="Select payout" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockPayouts.map((payout) => (
                                <SelectItem key={payout.id} value={payout.id}>
                                  {payout.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    </div>

                    {/* Format Selection */}
                    {report.formats.length > 1 && (
                      <div>
                        <label className="text-muted-foreground block text-xs font-medium mb-2">
                          Format
                        </label>
                        <div className="border-border inline-flex flex-shrink-0 overflow-hidden rounded-lg border">
                          {report.formats.map((format) => (
                            <button
                              key={format}
                              type="button"
                              onClick={() =>
                                setSelectedFormats((prev) => ({
                                  ...prev,
                                  [report.id]: format,
                                }))
                              }
                              aria-pressed={selectedFormats[report.id] === format}
                              className="border-border border-r px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all duration-200 last:border-r-0"
                              style={{
                                backgroundColor:
                                  selectedFormats[report.id] === format
                                    ? COLORS.primary
                                    : 'transparent',
                                color:
                                  selectedFormats[report.id] === format
                                    ? COLORS.textWhite
                                    : COLORS.textGray,
                              }}
                            >
                              {format}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Generate Button */}
                    <Button
                      className="w-full"
                      size="sm"
                      onClick={() => handleGenerate(report.id)}
                      style={{
                        backgroundColor: COLORS.primary,
                        color: COLORS.textWhite,
                      }}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Generate Report
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
