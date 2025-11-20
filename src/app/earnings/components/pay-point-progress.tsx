'use client';

import { useState } from 'react';
import { Settings } from 'lucide-react';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/shared/components/shadcn/sheet';
import { COLORS } from '@/shared/constants/theme';

import type { EarningsBalance } from '../mock-data';
import { formatCurrency, calculatePayoutProgress } from '../mock-data';

interface PayPointProgressProps {
  balance: EarningsBalance;
  onThresholdChange?: (newThreshold: number) => void;
}

const THRESHOLD_OPTIONS = [10, 25, 50, 100, 250, 500, 1000];

export function PayPointProgress({ balance, onThresholdChange }: PayPointProgressProps) {
  const [selectedThreshold, setSelectedThreshold] = useState(balance.payoutThreshold);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const progress = calculatePayoutProgress(
    balance.currentBalance,
    balance.payoutThreshold
  );
  const isEligible = balance.currentBalance >= balance.payoutThreshold;
  const amountToThreshold = Math.max(
    0,
    balance.payoutThreshold - balance.currentBalance
  );

  const handleThresholdChange = (newThreshold: number) => {
    setSelectedThreshold(newThreshold);
    onThresholdChange?.(newThreshold);
    setDrawerOpen(false);
  };

  return (
    <>
      <div className="space-y-3">
        {/* Progress Bar */}
        <div className="relative h-3 overflow-hidden rounded-full bg-gray-700">
          <div
            className="h-full transition-all duration-500 ease-out"
            style={{
              width: `${progress}%`,
              backgroundColor: isEligible ? COLORS.primary : COLORS.secondary,
            }}
          />
        </div>

        {/* Status Text */}
        <div className="flex items-center gap-2 text-sm">
          {isEligible ? (
            <p className="text-green-400">
              Eligible for payout
              {balance.nextPayoutDate && (
                <span className="text-muted-foreground ml-1">
                  on {new Date(balance.nextPayoutDate).toLocaleDateString()}
                </span>
              )}
            </p>
          ) : (
            <>
              <p className="text-muted-foreground">
                <span className="font-semibold text-amber-400">
                  {formatCurrency(amountToThreshold)}
                </span>{' '}
                more to reach {formatCurrency(balance.payoutThreshold)} pay point
              </p>

              {/* Change Pay Point Button */}
              <button
                onClick={() => setDrawerOpen(true)}
                className="flex items-center gap-1 text-xs transition-colors hover:opacity-80 whitespace-nowrap"
                style={{ color: COLORS.primary }}
              >
                <Settings className="h-3 w-3" />
                Change pay point
              </button>
            </>
          )}
        </div>
      </div>

      {/* Pay Point Drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent
          side="right"
          className="w-full border-0 sm:max-w-md"
          style={{ backgroundColor: COLORS.bgDark }}
        >
          <SheetHeader>
            <SheetTitle className="text-2xl font-[var(--font-test-national-2-narrow)] font-bold uppercase">
              CHANGE PAY POINT
            </SheetTitle>
            <p className="text-muted-foreground text-sm mt-2">
              Select your minimum payout threshold. Higher thresholds reduce processing fees.
            </p>
          </SheetHeader>

          <div className="space-y-6 px-4 pb-8 mt-6">
            {/* Threshold Options */}
            <div className="grid grid-cols-3 gap-3">
              {THRESHOLD_OPTIONS.map((option) => (
                <button
                  key={option}
                  onClick={() => handleThresholdChange(option)}
                  className="rounded-[3px] border px-4 py-3 text-sm font-medium transition-all"
                  style={{
                    backgroundColor:
                      selectedThreshold === option ? COLORS.primary : 'transparent',
                    borderColor:
                      selectedThreshold === option ? COLORS.primary : COLORS.borderLight,
                    color: selectedThreshold === option ? COLORS.textWhite : COLORS.textGray,
                  }}
                >
                  {formatCurrency(option)}
                </button>
              ))}
            </div>

            {/* Current Balance Info */}
            <div className="pt-4 border-t border-gray-700">
              <p className="text-muted-foreground text-sm">
                Your current balance:{' '}
                <span className="font-medium text-white">
                  {formatCurrency(balance.currentBalance)}
                </span>
              </p>
              {selectedThreshold > balance.currentBalance && (
                <p className="text-muted-foreground text-xs mt-2">
                  You need{' '}
                  <span className="text-amber-400 font-medium">
                    {formatCurrency(selectedThreshold - balance.currentBalance)}
                  </span>{' '}
                  more to reach this pay point.
                </p>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
