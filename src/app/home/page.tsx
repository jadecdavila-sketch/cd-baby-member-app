'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  Check,
  Music,
  Plus,
  User,
  Wallet,
} from 'lucide-react';

import { COLORS } from '@/shared/constants/theme';

type SetupTask = 'account-info' | 'payout-tax' | 'release';

interface Milestone {
  id: SetupTask;
  icon: typeof Wallet;
  title: string;
  description: string;
}

const MILESTONES: Milestone[] = [
  {
    id: 'account-info',
    icon: User,
    title: 'Account Info',
    description: 'Basic account details',
  },
  {
    id: 'payout-tax',
    icon: Wallet,
    title: 'Payout + Tax',
    description: 'Set up how you get paid',
  },
  {
    id: 'release',
    icon: Music,
    title: 'Start a Release',
    description: 'Get your music out there',
  },
];

export default function HomePage() {
  // Account info is always complete since they did it during signup
  const [completedMilestones, setCompletedMilestones] = useState<Set<SetupTask>>(
    new Set(['account-info'])
  );

  // Payout form state
  const [payoutMethod, setPayoutMethod] = useState<'bank' | 'paypal' | null>(null);
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');
  const [showPayoutForm, setShowPayoutForm] = useState(false);

  const isPayoutValid =
    (payoutMethod === 'bank' && bankName && accountNumber && routingNumber) ||
    (payoutMethod === 'paypal' && paypalEmail);

  // Find the current active milestone (first non-completed one)
  const currentMilestoneId = MILESTONES.find((m) => !completedMilestones.has(m.id))?.id;

  const handleMilestoneComplete = (milestoneId: SetupTask) => {
    const newCompleted = new Set(completedMilestones);
    newCompleted.add(milestoneId);
    setCompletedMilestones(newCompleted);
    setShowPayoutForm(false);
  };

  const renderPayoutForm = () => (
    <div className="mt-4 space-y-4 rounded-lg p-4" style={{ backgroundColor: `${COLORS.primary}10` }}>
      {/* Method Selection */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setPayoutMethod('bank')}
          className="flex items-center gap-3 rounded-[3px] border p-3 transition-all text-left"
          style={{
            backgroundColor: payoutMethod === 'bank' ? `${COLORS.primary}20` : 'transparent',
            borderColor: payoutMethod === 'bank' ? COLORS.primary : COLORS.borderGray,
          }}
        >
          <Building2
            className="h-5 w-5"
            style={{ color: payoutMethod === 'bank' ? COLORS.primary : COLORS.textGray }}
          />
          <div>
            <p
              className="text-sm font-medium"
              style={{ color: payoutMethod === 'bank' ? COLORS.textWhite : COLORS.textGray }}
            >
              Bank Transfer
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setPayoutMethod('paypal')}
          className="flex items-center gap-3 rounded-[3px] border p-3 transition-all text-left"
          style={{
            backgroundColor: payoutMethod === 'paypal' ? `${COLORS.primary}20` : 'transparent',
            borderColor: payoutMethod === 'paypal' ? COLORS.primary : COLORS.borderGray,
          }}
        >
          <Wallet
            className="h-5 w-5"
            style={{ color: payoutMethod === 'paypal' ? COLORS.primary : COLORS.textGray }}
          />
          <div>
            <p
              className="text-sm font-medium"
              style={{ color: payoutMethod === 'paypal' ? COLORS.textWhite : COLORS.textGray }}
            >
              PayPal
            </p>
          </div>
        </button>
      </div>

      {/* Bank Form */}
      {payoutMethod === 'bank' && (
        <div className="space-y-3">
          <input
            type="text"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            className="w-full rounded-[3px] border px-4 py-2 text-sm focus:outline-none"
            style={{
              backgroundColor: COLORS.bgInput,
              borderColor: COLORS.borderGray,
              color: COLORS.textWhite,
            }}
            placeholder="Bank name"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={routingNumber}
              onChange={(e) => setRoutingNumber(e.target.value.replace(/\D/g, '').slice(0, 9))}
              className="w-full rounded-[3px] border px-4 py-2 text-sm focus:outline-none"
              style={{
                backgroundColor: COLORS.bgInput,
                borderColor: COLORS.borderGray,
                color: COLORS.textWhite,
              }}
              placeholder="Routing number"
            />
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
              className="w-full rounded-[3px] border px-4 py-2 text-sm focus:outline-none"
              style={{
                backgroundColor: COLORS.bgInput,
                borderColor: COLORS.borderGray,
                color: COLORS.textWhite,
              }}
              placeholder="Account number"
            />
          </div>
        </div>
      )}

      {/* PayPal Form */}
      {payoutMethod === 'paypal' && (
        <input
          type="email"
          value={paypalEmail}
          onChange={(e) => setPaypalEmail(e.target.value)}
          className="w-full rounded-[3px] border px-4 py-2 text-sm focus:outline-none"
          style={{
            backgroundColor: COLORS.bgInput,
            borderColor: COLORS.borderGray,
            color: COLORS.textWhite,
          }}
          placeholder="PayPal email"
        />
      )}

      <button
        type="button"
        onClick={() => handleMilestoneComplete('payout-tax')}
        disabled={!isPayoutValid}
        className="w-full rounded-[3px] py-2 text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50"
        style={{
          backgroundColor: isPayoutValid ? COLORS.primary : COLORS.bgCard,
          color: COLORS.textWhite,
        }}
      >
        Save Payout Method
      </button>
    </div>
  );

  const renderPayoutEmptyState = () => (
    <div className="mt-4 flex flex-col items-center text-center py-6">
      <div
        className="mb-4 flex h-12 w-12 items-center justify-center rounded-full"
        style={{ backgroundColor: COLORS.bgDark }}
      >
        <Wallet className="h-6 w-6" style={{ color: COLORS.textGray }} />
      </div>
      <p className="text-sm font-medium" style={{ color: COLORS.textWhite }}>
        You do not currently have a payout method setup.
      </p>
      <p className="mt-1 text-sm" style={{ color: COLORS.textGray }}>
        Add a payout method to receive payouts.
      </p>
      <button
        type="button"
        onClick={() => setShowPayoutForm(true)}
        className="mt-4 flex items-center gap-2 rounded-[3px] px-6 py-2.5 text-sm font-medium text-white transition-all hover:opacity-90"
        style={{ backgroundColor: COLORS.primary }}
      >
        <Plus className="h-4 w-4" />
        Add Payout Method
      </button>
    </div>
  );

  const renderReleaseStep = () => (
    <div className="mt-4 flex flex-col items-center text-center py-6">
      <div
        className="mb-4 flex h-12 w-12 items-center justify-center rounded-full"
        style={{ backgroundColor: `${COLORS.primary}20` }}
      >
        <Music className="h-6 w-6" style={{ color: COLORS.primary }} />
      </div>
      <p className="text-sm font-medium" style={{ color: COLORS.textWhite }}>
        Ready to share your music with the world?
      </p>
      <p className="mt-1 text-sm" style={{ color: COLORS.textGray }}>
        Distribute your tracks to all major streaming platforms.
      </p>
      <Link
        href="/onboarding/release-type"
        className="mt-4 flex items-center gap-2 rounded-[3px] px-6 py-2.5 text-sm font-medium text-white transition-all hover:opacity-90"
        style={{ backgroundColor: COLORS.primary }}
      >
        <Music className="h-4 w-4" />
        Start a Release
      </Link>
    </div>
  );

  const renderExpandedContent = (milestoneId: SetupTask) => {
    if (milestoneId === 'account-info') {
      return (
        <div className="mt-4 flex items-center gap-3 py-4">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: `${COLORS.success}20` }}
          >
            <Check className="h-5 w-5" style={{ color: COLORS.success }} />
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: COLORS.textWhite }}>
              Account information saved
            </p>
            <p className="text-xs" style={{ color: COLORS.textGray }}>
              Your basic details have been saved during signup
            </p>
          </div>
        </div>
      );
    }

    if (milestoneId === 'payout-tax') {
      if (completedMilestones.has('payout-tax')) {
        return (
          <div className="mt-4 flex items-center gap-3 py-4">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full"
              style={{ backgroundColor: `${COLORS.success}20` }}
            >
              <Check className="h-5 w-5" style={{ color: COLORS.success }} />
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: COLORS.textWhite }}>
                Payout method configured
              </p>
              <p className="text-xs" style={{ color: COLORS.textGray }}>
                You&apos;re ready to receive royalties
              </p>
            </div>
          </div>
        );
      }
      return showPayoutForm ? renderPayoutForm() : renderPayoutEmptyState();
    }

    if (milestoneId === 'release') {
      return renderReleaseStep();
    }

    return null;
  };

  return (
    <div className="px-6 py-8">
      {/* Three Boxes - Horizontal layout with flex grow/shrink */}
      <div className="flex gap-4">
        {MILESTONES.map((milestone, index) => {
          const isCompleted = completedMilestones.has(milestone.id);
          const isCurrent = currentMilestoneId === milestone.id;
          const isExpanded = isCurrent;
          const Icon = milestone.icon;

          return (
            <div
              key={milestone.id}
              className={`rounded-[3px] overflow-hidden transition-all duration-300 ${
                isExpanded ? 'flex-[6]' : 'flex-none'
              }`}
              style={{
                backgroundColor: COLORS.bgCard,
                border: `1px solid ${isCurrent ? COLORS.primary : COLORS.borderGray}`,
                width: isExpanded ? 'auto' : '160px',
              }}
            >
              {/* Collapsed State - Completed or Upcoming */}
              {!isExpanded && isCompleted && (
                <div
                  className="p-5 flex flex-col items-center justify-center text-center h-full"
                  style={{ backgroundColor: COLORS.success }}
                >
                  {/* Check Icon */}
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-full mb-3"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                  >
                    <Check className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-base font-semibold text-white">
                    {milestone.title}
                  </h3>
                  <p className="text-xs mt-1 text-white/80">
                    {milestone.description}
                  </p>
                  <span
                    className="text-xs font-semibold mt-3 px-3 py-1 rounded-full"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.25)', color: 'white' }}
                  >
                    Complete
                  </span>
                </div>
              )}

              {/* Collapsed State - Upcoming (not current, not completed) */}
              {!isExpanded && !isCompleted && (
                <div className="p-5 flex flex-col items-center justify-center text-center h-full">
                  {/* Step Number with Icon */}
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-full mb-3"
                    style={{ backgroundColor: `${COLORS.primary}15` }}
                  >
                    <Icon className="h-6 w-6" style={{ color: COLORS.primary }} />
                  </div>
                  <h3 className="text-base font-semibold" style={{ color: COLORS.textWhite }}>
                    {milestone.title}
                  </h3>
                  <p className="text-xs mt-1" style={{ color: COLORS.textGray }}>
                    {milestone.description}
                  </p>
                  <span
                    className="text-xs font-medium mt-3 px-3 py-1 rounded-full"
                    style={{ backgroundColor: COLORS.bgDark, color: COLORS.textGray }}
                  >
                    Up Next
                  </span>
                </div>
              )}

              {/* Expanded State - Full content */}
              {isExpanded && (
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-full flex-shrink-0"
                      style={{ backgroundColor: COLORS.primary }}
                    >
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold" style={{ color: COLORS.textWhite }}>
                          {milestone.title}
                        </h3>
                        <span
                          className="text-xs font-medium px-2 py-0.5 rounded"
                          style={{ backgroundColor: `${COLORS.primary}20`, color: COLORS.primary }}
                        >
                          Current
                        </span>
                      </div>
                      <p className="text-sm" style={{ color: COLORS.textGray }}>
                        {milestone.description}
                      </p>
                    </div>
                  </div>

                  {/* Content */}
                  {renderExpandedContent(milestone.id)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Analytics Section with Overlay */}
      <div className="mt-8 relative">
        {/* Blurred Analytics Background */}
        <div
          className="rounded-[3px] p-6 blur-sm opacity-50 select-none pointer-events-none"
          style={{ backgroundColor: COLORS.bgCard }}
        >
          {/* Fake Analytics Header */}
          <div className="flex items-center justify-between mb-6">
            <h2
              className="text-xl font-bold uppercase tracking-wide"
              style={{ color: COLORS.textWhite }}
            >
              Analytics
            </h2>
            <div className="flex gap-2">
              <div className="h-8 w-24 rounded-[3px]" style={{ backgroundColor: COLORS.bgDark }} />
              <div className="h-8 w-24 rounded-[3px]" style={{ backgroundColor: COLORS.bgDark }} />
            </div>
          </div>

          {/* Fake Stats Row */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-4 rounded-[3px]" style={{ backgroundColor: COLORS.bgDark }}>
                <div className="h-4 w-16 rounded mb-2" style={{ backgroundColor: COLORS.borderGray }} />
                <div className="h-8 w-24 rounded" style={{ backgroundColor: COLORS.borderGray }} />
              </div>
            ))}
          </div>

          {/* Fake Chart Area */}
          <div
            className="h-64 rounded-[3px] flex items-end justify-around px-4 pb-4"
            style={{ backgroundColor: `${COLORS.primary}15` }}
          >
            {[40, 65, 45, 80, 55, 70, 50, 85, 60, 75, 55, 90].map((height, i) => (
              <div
                key={i}
                className="w-8 rounded-t"
                style={{
                  height: `${height}%`,
                  backgroundColor: COLORS.primary,
                  opacity: 0.6,
                }}
              />
            ))}
          </div>
        </div>

        {/* Overlay Dialog */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="rounded-[3px] p-8 max-w-md w-full mx-4"
            style={{ backgroundColor: '#000000' }}
          >
            <h2
              className="text-2xl font-bold uppercase tracking-wide mb-3"
              style={{ color: COLORS.textWhite }}
            >
              Nothing to See... Yet
            </h2>
            <p className="text-sm mb-6" style={{ color: COLORS.textGray }}>
              You haven&apos;t distributed any releases yet. Upload and distribute some music to start tracking streams and more.
            </p>
            <Link
              href="/onboarding/release-type"
              className="inline-block w-full text-center rounded-[3px] px-6 py-3 text-sm font-medium text-black bg-white hover:bg-gray-100 transition-colors"
            >
              Create your first release
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
