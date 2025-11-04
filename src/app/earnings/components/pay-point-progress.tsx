'use client';

import { useState } from 'react';
import { Settings } from 'lucide-react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/shadcn/popover';
import { Button } from '@/shared/components/shadcn/button';
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
  const [popoverOpen, setPopoverOpen] = useState(false);

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
    setPopoverOpen(false);
  };

  return (
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
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <button
                  className="flex items-center gap-1 text-xs transition-colors hover:opacity-80 whitespace-nowrap"
                  style={{ color: COLORS.primary }}
                >
                  <Settings className="h-3 w-3" />
                  Change pay point
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-4" align="end">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium mb-1">Change Pay Point</h4>
                    <p className="text-muted-foreground text-xs">
                      Select your minimum payout threshold. Higher thresholds reduce processing
                      fees.
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {THRESHOLD_OPTIONS.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleThresholdChange(option)}
                        className="rounded-[3px] border px-3 py-2 text-sm font-medium transition-all"
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
                  <p className="text-muted-foreground text-xs pt-2 border-t border-gray-700">
                    Your current balance: <span className="font-medium text-white">{formatCurrency(balance.currentBalance)}</span>
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          </>
        )}
      </div>
    </div>
  );
}
