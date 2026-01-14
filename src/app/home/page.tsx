'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  Check,
  CheckCircle2,
  DollarSign,
  Music,
  Plus,
  Shield,
  Sparkles,
  Wallet,
  Zap,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { COLORS } from '@/shared/constants/theme';

type SetupTask = 'payout-tax' | 'identity' | 'release';

interface Milestone {
  id: SetupTask;
  icon: typeof Wallet;
  title: string;
  description: string;
  benefit: string;
  actions: string[];
}

const MILESTONES: Milestone[] = [
  {
    id: 'payout-tax',
    icon: Wallet,
    title: 'Payout and Tax',
    description: 'Set up how you get paid',
    benefit: 'Receive royalties via direct deposit or PayPal',
    actions: ['Add payout method', 'Complete tax information'],
  },
  {
    id: 'identity',
    icon: Shield,
    title: 'Verify Identity',
    description: 'Secure your account',
    benefit: 'Protects your earnings and account access',
    actions: ['Choose ID type', 'Upload document'],
  },
  {
    id: 'release',
    icon: Music,
    title: 'Start a Release',
    description: 'Get your music out there',
    benefit: 'Distribute to all major platforms',
    actions: ['Upload your tracks', 'Add release details'],
  },
];

export default function HomePage() {
  const [completedMilestones, setCompletedMilestones] = useState<Set<SetupTask>>(new Set());
  const [justCompletedMilestone, setJustCompletedMilestone] = useState<SetupTask | null>(null);
  const [expandedMilestone, setExpandedMilestone] = useState<SetupTask | null>(null);

  // Payout form state
  const [payoutMethod, setPayoutMethod] = useState<'bank' | 'paypal' | null>(null);
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');


  // Identity form state
  const [idType, setIdType] = useState<'passport' | 'license' | null>(null);
  const [idUploaded, setIdUploaded] = useState(false);

  const isPayoutValid =
    (payoutMethod === 'bank' && bankName && accountNumber && routingNumber) ||
    (payoutMethod === 'paypal' && paypalEmail);

  const isIdentityValid = idType && idUploaded;

  const getCurrentMilestone = (): Milestone => {
    if (justCompletedMilestone) {
      const found = MILESTONES.find((m) => m.id === justCompletedMilestone);
      if (found) return found;
    }
    const nextIncomplete = MILESTONES.find((m) => !completedMilestones.has(m.id));
    if (nextIncomplete) return nextIncomplete;
    return MILESTONES[0] as Milestone;
  };

  const currentMilestone = getCurrentMilestone();
  const progressPercentage = (completedMilestones.size / MILESTONES.length) * 100;

  const handleMilestoneComplete = (milestoneId: SetupTask) => {
    setJustCompletedMilestone(milestoneId);
    setExpandedMilestone(null);

    setTimeout(() => {
      const newCompleted = new Set(completedMilestones);
      newCompleted.add(milestoneId);
      setCompletedMilestones(newCompleted);
      setJustCompletedMilestone(null);
    }, 2000);
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
        style={{ backgroundColor: COLORS.bgCard }}
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
        onClick={() => setExpandedMilestone('payout-tax')}
        className="mt-4 flex items-center gap-2 rounded-[3px] px-6 py-2.5 text-sm font-medium text-white transition-all hover:opacity-90"
        style={{ backgroundColor: COLORS.primary }}
      >
        <Plus className="h-4 w-4" />
        Add Payout Method
      </button>
    </div>
  );

  const renderIdentityForm = () => (
    <div className="mt-4 space-y-4 rounded-lg p-4" style={{ backgroundColor: `${COLORS.primary}10` }}>
      {/* ID Type Selection */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setIdType('passport')}
          className="flex flex-col items-center gap-1 rounded-[3px] border p-3 transition-all"
          style={{
            backgroundColor: idType === 'passport' ? `${COLORS.primary}20` : 'transparent',
            borderColor: idType === 'passport' ? COLORS.primary : COLORS.borderGray,
          }}
        >
          <p
            className="text-sm font-medium"
            style={{ color: idType === 'passport' ? COLORS.textWhite : COLORS.textGray }}
          >
            Passport
          </p>
        </button>

        <button
          type="button"
          onClick={() => setIdType('license')}
          className="flex flex-col items-center gap-1 rounded-[3px] border p-3 transition-all"
          style={{
            backgroundColor: idType === 'license' ? `${COLORS.primary}20` : 'transparent',
            borderColor: idType === 'license' ? COLORS.primary : COLORS.borderGray,
          }}
        >
          <p
            className="text-sm font-medium"
            style={{ color: idType === 'license' ? COLORS.textWhite : COLORS.textGray }}
          >
            Driver&apos;s License
          </p>
        </button>
      </div>

      {idType && (
        <button
          type="button"
          className="w-full rounded-[3px] border-2 border-dashed p-6 text-center transition-all hover:border-opacity-70"
          style={{ borderColor: idUploaded ? COLORS.success : COLORS.borderGray }}
          onClick={() => setIdUploaded(true)}
        >
          {idUploaded ? (
            <div className="space-y-2">
              <div
                className="mx-auto w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${COLORS.success}20` }}
              >
                <Check className="h-5 w-5" style={{ color: COLORS.success }} />
              </div>
              <p className="text-sm font-medium" style={{ color: COLORS.success }}>
                Document uploaded
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <Shield className="mx-auto h-6 w-6" style={{ color: COLORS.textGray }} />
              <p className="text-sm" style={{ color: COLORS.textGray }}>
                Click to upload
              </p>
            </div>
          )}
        </button>
      )}

      <button
        type="button"
        onClick={() => handleMilestoneComplete('identity')}
        disabled={!isIdentityValid}
        className="w-full rounded-[3px] py-2 text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50"
        style={{
          backgroundColor: isIdentityValid ? COLORS.primary : COLORS.bgCard,
          color: COLORS.textWhite,
        }}
      >
        Complete Verification
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

  const allComplete = completedMilestones.size === MILESTONES.length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Hero Section */}
      <Card className="border-0 overflow-hidden" style={{ backgroundColor: '#F9D84E' }}>
        <CardContent className="p-8">
          <div className="flex items-start gap-6">
            <DollarSign className="h-12 w-12 flex-shrink-0" style={{ color: '#000000' }} />
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2
                    className="mb-2 text-3xl font-[var(--font-test-national-2-narrow)] font-bold uppercase"
                    style={{ color: '#000000' }}
                  >
                    Get Ready to Earn
                  </h2>
                  <p className="mb-6 text-lg" style={{ color: '#000000' }}>
                    Complete these steps now so you&apos;re ready to get paid the
                    moment your music starts earning royalties.
                  </p>
                </div>
                <Link
                  href="/releases"
                  className="flex items-center gap-2 rounded-[3px] bg-black px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-gray-800 flex-shrink-0"
                >
                  <Music className="h-4 w-4" />
                  Start a Release
                </Link>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium" style={{ color: '#000000' }}>
                    Progress
                  </span>
                  <span className="text-sm font-medium" style={{ color: '#000000' }}>
                    {completedMilestones.size} / {MILESTONES.length} complete
                  </span>
                </div>
                <div
                  className="h-3 w-full overflow-hidden rounded-full"
                  style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
                >
                  <div
                    className="h-full transition-all duration-500"
                    style={{
                      width: `${Math.max(2, progressPercentage)}%`,
                      backgroundColor: '#000000',
                    }}
                  />
                </div>
              </div>

              {/* Milestone Progress */}
              <div className="flex items-center gap-2 text-sm" style={{ color: '#000000' }}>
                <Sparkles className="h-4 w-4" style={{ color: '#000000' }} />
                <span>
                  {completedMilestones.size === 0
                    ? "Ready to set up your account? Let's get started!"
                    : allComplete
                      ? "All done! You're ready to earn."
                      : `${MILESTONES.length - completedMilestones.size} steps remaining`}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payout Roadmap - Full Width */}
      <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" style={{ color: COLORS.primary }} />
                Your Payout Roadmap
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {MILESTONES.map((milestone, index) => {
                  const isCompleted = completedMilestones.has(milestone.id);
                  const isCurrentMilestone = currentMilestone?.id === milestone.id;
                  const isJustCompleted = justCompletedMilestone === milestone.id;
                  const isExpanded = expandedMilestone === milestone.id;
                  const canExpand = isCurrentMilestone && !isCompleted;

                  return (
                    <div key={milestone.id} className="relative">
                      {/* Connector Line */}
                      {index < MILESTONES.length - 1 && (
                        <div
                          className="absolute top-10 left-4 h-full w-0.5 transition-colors duration-500"
                          style={{
                            backgroundColor: isCompleted ? COLORS.success : COLORS.borderGray,
                          }}
                        />
                      )}

                      <div
                        className={`flex gap-4 transition-all duration-500 ${
                          isCompleted ? 'opacity-60' : ''
                        } ${isCurrentMilestone && !isCompleted ? '-mx-4 rounded-lg px-4 py-4' : ''}`}
                        style={{
                          backgroundColor:
                            isCurrentMilestone && !isCompleted ? `${COLORS.primary}10` : 'transparent',
                        }}
                      >
                        {/* Milestone Icon */}
                        <div
                          className={`relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-all duration-500 ${
                            isJustCompleted ? 'scale-125' : ''
                          }`}
                          style={{
                            backgroundColor: isCompleted
                              ? COLORS.success
                              : isCurrentMilestone
                                ? COLORS.primary
                                : COLORS.bgCard,
                          }}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="h-5 w-5 text-white" />
                          ) : (
                            <span
                              className="text-xs font-bold"
                              style={{ color: isCurrentMilestone ? 'white' : COLORS.textGray }}
                            >
                              {index + 1}
                            </span>
                          )}

                          {/* Celebration burst */}
                          {isJustCompleted && (
                            <>
                              <Sparkles
                                className="absolute -top-3 -left-3 h-5 w-5 animate-ping"
                                style={{ color: COLORS.primary }}
                              />
                              <Sparkles
                                className="absolute -top-3 -right-3 h-5 w-5 animate-ping"
                                style={{ color: '#ff386a', animationDelay: '0.3s' }}
                              />
                              <Zap
                                className="absolute -bottom-3 -left-3 h-5 w-5 animate-ping"
                                style={{ color: COLORS.success, animationDelay: '0.15s' }}
                              />
                            </>
                          )}
                        </div>

                        {/* Milestone Content */}
                        <div className="flex-1 pb-6">
                          <div className="mb-1 flex items-center gap-2">
                            <h4
                              className={`font-semibold ${isCompleted ? 'line-through' : ''}`}
                              style={{ color: COLORS.textWhite }}
                            >
                              {milestone.title}
                            </h4>
                            {isCompleted && (
                              <span
                                className="text-xs font-bold"
                                style={{ color: COLORS.success }}
                              >
                                DONE
                              </span>
                            )}
                            {isCurrentMilestone && !isCompleted && (
                              <span
                                className="animate-pulse text-xs font-bold"
                                style={{ color: COLORS.primary }}
                              >
                                ACTIVE
                              </span>
                            )}
                          </div>
                          <p
                            className={`text-sm ${isCompleted ? 'line-through' : ''}`}
                            style={{ color: COLORS.textGray }}
                          >
                            {milestone.description}
                          </p>

                          {/* Show empty state or form for current milestone */}
                          {canExpand && !isExpanded && milestone.id === 'payout-tax' && renderPayoutEmptyState()}
                          {canExpand && isExpanded && milestone.id === 'payout-tax' && renderPayoutForm()}

                          {canExpand && milestone.id === 'identity' && renderIdentityForm()}

                          {canExpand && milestone.id === 'release' && renderReleaseStep()}

                          {/* Celebration message */}
                          {isJustCompleted && (
                            <div
                              className="mt-4 rounded-lg border-2 p-4"
                              style={{
                                borderColor: `${COLORS.success}50`,
                                backgroundColor: `${COLORS.success}10`,
                              }}
                            >
                              <div className="flex items-center gap-2" style={{ color: COLORS.success }}>
                                <CheckCircle2 className="h-5 w-5" />
                                <span className="font-semibold">
                                  Step Complete! Moving to next...
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Preview for upcoming milestones */}
                          {!isCompleted && !isCurrentMilestone && (
                            <div className="mt-2 space-y-1 opacity-60">
                              {milestone.actions.map((action, actionIndex) => (
                                <div
                                  key={actionIndex}
                                  className="border-l-2 pl-3 text-xs"
                                  style={{ borderColor: COLORS.borderGray, color: COLORS.textGray }}
                                >
                                  {action}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Ready to Rock celebration - shown when all complete */}
                {allComplete && (
                  <div
                    className="mt-8 rounded-lg border-2 p-6 text-center"
                    style={{
                      borderColor: COLORS.success,
                      backgroundColor: `${COLORS.success}10`,
                    }}
                  >
                    <div className="relative inline-block mb-4">
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                        style={{ backgroundColor: `${COLORS.success}20` }}
                      >
                        <CheckCircle2 className="h-8 w-8" style={{ color: COLORS.success }} />
                      </div>
                      <Sparkles
                        className="absolute -top-2 -left-2 h-5 w-5 animate-bounce"
                        style={{ color: '#ff386a' }}
                      />
                      <Sparkles
                        className="absolute -top-2 -right-2 h-4 w-4 animate-bounce"
                        style={{ color: COLORS.primary, animationDelay: '0.2s' }}
                      />
                      <Zap
                        className="absolute -bottom-1 -right-1 h-4 w-4 animate-bounce"
                        style={{ color: COLORS.success, animationDelay: '0.4s' }}
                      />
                    </div>
                    <h3
                      className="text-2xl font-[var(--font-test-national-2-narrow)] font-bold uppercase mb-2"
                      style={{ color: COLORS.success }}
                    >
                      You&apos;re Ready to Rock!
                    </h3>
                    <p className="text-sm" style={{ color: COLORS.textGray }}>
                      Great job! Your account is all set up.
                      <br />
                      You&apos;ll get paid the moment your music starts earning royalties.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
      </div>
    </div>
  );
}
