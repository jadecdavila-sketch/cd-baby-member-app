'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/shared/components/shadcn/sheet';

import {
  formatCurrency,
  getPlatformName,
  type EarningsTransaction,
} from '../mock-data';

import { PlatformIcon } from './platform-icon';
import { EarningTypeBadge } from './earning-type-badge';

interface EarningsDetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  transactions: EarningsTransaction[];
  totalAmount: number;
}

export function EarningsDetailDrawer({
  open,
  onOpenChange,
  title,
  transactions,
  totalAmount,
}: EarningsDetailDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full border-0 sm:max-w-lg"
        style={{ backgroundColor: '#1C1C1C' }}
      >
        <SheetHeader>
          <SheetTitle className="text-2xl font-[var(--font-test-national-2-narrow)] font-bold uppercase">
            {title}
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6 px-4 pb-4">
          {/* Total Amount */}
          <div
            className="rounded-[3px] border border-gray-700 p-4"
            style={{ backgroundColor: '#262626' }}
          >
            <p className="text-muted-foreground mb-2 text-sm font-medium uppercase">
              Total
            </p>
            <p className="text-4xl font-bold" style={{ color: '#52bcd6' }}>
              {formatCurrency(totalAmount)}
            </p>
          </div>

          {/* Transaction List */}
          <div>
            <p className="text-muted-foreground mb-3 text-sm font-medium uppercase">
              Transactions
            </p>
            <div className="space-y-3">
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="rounded-[3px] border border-gray-700 p-4"
                    style={{ backgroundColor: '#262626' }}
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <PlatformIcon
                          platform={transaction.platform}
                          size="sm"
                        />
                        <div>
                          <p className="text-sm font-medium">
                            {transaction.trackName}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {getPlatformName(transaction.platform)}
                          </p>
                        </div>
                      </div>
                      <EarningTypeBadge
                        type={transaction.earningType}
                        className="text-xs"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-muted-foreground text-xs">
                        {new Date(transaction.date).toLocaleDateString(
                          'en-US',
                          {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          }
                        )}
                      </p>
                      <div className="text-right">
                        <p className="text-sm font-bold">
                          {formatCurrency(transaction.amount)}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {transaction.streams
                            ? `${transaction.streams.toLocaleString()} streams`
                            : `${transaction.views?.toLocaleString()} views`}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center text-sm">
                  No transactions available
                </p>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
