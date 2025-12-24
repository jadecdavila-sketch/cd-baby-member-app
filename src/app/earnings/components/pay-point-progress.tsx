'use client';

import { useState } from 'react';
import { Settings, HelpCircle } from 'lucide-react';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/shared/components/shadcn/sheet';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/shadcn/dialog';
import { COLORS } from '@/shared/constants/theme';

import type { EarningsBalance } from '../mock-data';
import { formatCurrency, calculatePayoutProgress } from '../mock-data';

interface PayPointProgressProps {
  balance: EarningsBalance;
  onThresholdChange?: (newThreshold: number) => void;
}

export function PayPointProgress({ balance, onThresholdChange }: PayPointProgressProps) {
  const [inputValue, setInputValue] = useState(String(balance.payoutThreshold));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);

  const progress = calculatePayoutProgress(
    balance.currentBalance,
    balance.payoutThreshold
  );
  const isEligible = balance.currentBalance >= balance.payoutThreshold;
  const amountToThreshold = Math.max(
    0,
    balance.payoutThreshold - balance.currentBalance
  );

  const handleSaveThreshold = () => {
    const newThreshold = parseFloat(inputValue);
    if (!isNaN(newThreshold) && newThreshold >= 10) {
      onThresholdChange?.(newThreshold);
      setDrawerOpen(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      setInputValue(value);
    }
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
              Enter your minimum payout threshold. Higher thresholds reduce processing fees.
            </p>
          </SheetHeader>

          <div className="space-y-6 px-4 pb-8 mt-6">
            {/* Number Input */}
            <div>
              <label
                htmlFor="paypoint-input"
                className="block text-sm font-medium mb-2"
                style={{ color: COLORS.textWhite }}
              >
                Pay Point Amount
              </label>
              <div className="relative">
                <span
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-sm"
                  style={{ color: COLORS.textGray }}
                >
                  $
                </span>
                <input
                  type="text"
                  id="paypoint-input"
                  inputMode="decimal"
                  value={inputValue}
                  onChange={handleInputChange}
                  className="w-full rounded-[3px] border pl-8 pr-4 py-3 text-sm focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: COLORS.bgInput,
                    borderColor: COLORS.borderGray,
                    color: COLORS.textWhite,
                  }}
                  placeholder="Enter amount"
                />
              </div>
              <p className="text-xs mt-2" style={{ color: COLORS.textGray }}>
                Minimum pay point is $10.00
              </p>
            </div>

            {/* How Pay Points Work Link */}
            <button
              type="button"
              onClick={() => setInfoModalOpen(true)}
              className="flex items-center gap-2 text-sm transition-colors hover:opacity-80"
              style={{ color: COLORS.primary }}
            >
              <HelpCircle className="h-4 w-4" />
              How are pay points calculated?
            </button>

            {/* Current Balance Info */}
            <div className="pt-4 border-t border-gray-700">
              <p className="text-muted-foreground text-sm">
                Your current balance:{' '}
                <span className="font-medium text-white">
                  {formatCurrency(balance.currentBalance)}
                </span>
              </p>
              {parseFloat(inputValue) > balance.currentBalance && (
                <p className="text-muted-foreground text-xs mt-2">
                  You need{' '}
                  <span className="text-amber-400 font-medium">
                    {formatCurrency(parseFloat(inputValue) - balance.currentBalance)}
                  </span>{' '}
                  more to reach this pay point.
                </p>
              )}
            </div>

            {/* Save Button */}
            <button
              type="button"
              onClick={handleSaveThreshold}
              disabled={!inputValue || parseFloat(inputValue) < 10}
              className="w-full rounded-[3px] py-3 text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                backgroundColor: COLORS.primary,
                color: COLORS.textWhite,
              }}
            >
              Save Pay Point
            </button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Pay Point Info Modal */}
      <Dialog open={infoModalOpen} onOpenChange={setInfoModalOpen}>
        <DialogContent
          className="max-w-lg max-h-[80vh] overflow-y-auto border-0"
          style={{ backgroundColor: COLORS.bgCard }}
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-[var(--font-test-national-2-narrow)] font-bold uppercase">
              How Pay Points Are Calculated
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 text-sm" style={{ color: COLORS.textGray }}>
            <div>
              <p className="font-medium mb-2" style={{ color: COLORS.textWhite }}>
                Default Values
              </p>
              <ul className="space-y-1 ml-4 list-disc">
                <li>
                  <span className="font-medium text-white">minimalPayPoint</span> — starts at 0 and will be set based on the payment method and tax-withholding percentage.
                </li>
                <li>
                  <span className="font-medium text-white">defaultPayPoint</span> — set to 10 and used as a fallback when no other pay point applies.
                </li>
              </ul>
            </div>

            <div>
              <p className="font-medium mb-2" style={{ color: COLORS.textWhite }}>
                Minimum Pay Points by Payment Method
              </p>
              <p className="mb-3">
                For each payment account type, the minimum required pay point is determined by your estimated tax withholding (expressed as a decimal; e.g. 0.24 = 24%):
              </p>

              {/* ACH */}
              <div className="mb-3 p-3 rounded-[3px] bg-gray-800">
                <p className="font-medium text-white mb-1">ACH</p>
                <p>Minimum pay point = $10</p>
              </div>

              {/* IACH */}
              <div className="mb-3 p-3 rounded-[3px] bg-gray-800">
                <p className="font-medium text-white mb-1">IACH (International ACH)</p>
                <ul className="space-y-1 ml-4 list-disc">
                  <li>If withholding ≤ 24% → minimum = $10</li>
                  <li>If withholding &gt; 24% → minimum = $11</li>
                </ul>
              </div>

              {/* SWIFT10 */}
              <div className="mb-3 p-3 rounded-[3px] bg-gray-800">
                <p className="font-medium text-white mb-1">SWIFT10</p>
                <ul className="space-y-1 ml-4 list-disc">
                  <li>If withholding = 0% → minimum = $30</li>
                  <li>If 0% &lt; withholding ≤ 5% → minimum = $32</li>
                  <li>If 5% &lt; withholding ≤ 15% → minimum = $36</li>
                  <li>If 15% &lt; withholding ≤ 24% → minimum = $40</li>
                  <li>If withholding &gt; 24% → minimum = $43</li>
                </ul>
              </div>

              {/* USDSWIFT25 */}
              <div className="mb-3 p-3 rounded-[3px] bg-gray-800">
                <p className="font-medium text-white mb-1">USDSWIFT25</p>
                <ul className="space-y-1 ml-4 list-disc">
                  <li>If withholding = 0% → minimum = $45</li>
                  <li>If 0% &lt; withholding ≤ 5% → minimum = $48</li>
                  <li>If 5% &lt; withholding ≤ 15% → minimum = $53</li>
                  <li>If 15% &lt; withholding ≤ 24% → minimum = $60</li>
                  <li>If withholding &gt; 24% → minimum = $65</li>
                </ul>
              </div>

              {/* PayPal */}
              <div className="mb-3 p-3 rounded-[3px] bg-gray-800">
                <p className="font-medium text-white mb-1">PayPal</p>
                <ul className="space-y-1 ml-4 list-disc">
                  <li>If withholding ≤ 24% → minimum = $10</li>
                  <li>If withholding &gt; 24% → minimum = $11</li>
                </ul>
              </div>

              {/* Check */}
              <div className="mb-3 p-3 rounded-[3px] bg-gray-800">
                <p className="font-medium text-white mb-1">Check</p>
                <ul className="space-y-1 ml-4 list-disc">
                  <li>If withholding ≤ 24% and current pay point &lt; $10 → minimum = $10</li>
                  <li>If withholding &gt; 24% and current pay point &lt; $11 → minimum = $11</li>
                </ul>
              </div>
            </div>

            <div>
              <p className="font-medium mb-2" style={{ color: COLORS.textWhite }}>
                How It Works
              </p>
              <ul className="space-y-1 ml-4 list-disc">
                <li>If your current pay point is less than the minimal pay point for your payment method, your pay point will be automatically set to the minimal value.</li>
                <li>If no pay point exists and no minimal requirement applies, your pay point defaults to $10.</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
