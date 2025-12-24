'use client';

import { useState } from 'react';
import {
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  DollarSign,
  FileText,
  Plus,
  Shield,
  Sparkles,
  Wallet,
  Zap,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { COLORS } from '@/shared/constants/theme';

interface AccountSetupStepProps {
  firstName: string;
  onComplete: () => void;
}

type SetupTask = 'payout' | 'tax' | 'identity';

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
    id: 'payout',
    icon: Wallet,
    title: 'Add Payout Method',
    description: 'Get paid directly to your bank',
    benefit: 'Receive royalties via direct deposit or PayPal',
    actions: ['Choose payment method', 'Enter account details'],
  },
  {
    id: 'tax',
    icon: FileText,
    title: 'Complete Tax Information',
    description: 'Avoid payment delays',
    benefit: 'Required by law to receive payments',
    actions: ['Select tax form type', 'Provide tax details'],
  },
  {
    id: 'identity',
    icon: Shield,
    title: 'Verify Your Identity',
    description: 'Secure your account',
    benefit: 'Protects your earnings and account access',
    actions: ['Choose ID type', 'Upload document'],
  },
];

export function AccountSetupStep({ firstName, onComplete }: AccountSetupStepProps) {
  const [completedMilestones, setCompletedMilestones] = useState<Set<SetupTask>>(new Set());
  const [justCompletedMilestone, setJustCompletedMilestone] = useState<SetupTask | null>(null);
  const [expandedMilestone, setExpandedMilestone] = useState<SetupTask | null>(null);

  // Payout form state
  const [payoutMethod, setPayoutMethod] = useState<'bank' | 'paypal' | null>(null);
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');

  // Tax form state
  const [taxFormType, setTaxFormType] = useState<'w9' | 'w8ben' | null>(null);
  const [legalName, setLegalName] = useState('');
  const [taxId, setTaxId] = useState('');
  const [address, setAddress] = useState('');

  // Identity form state
  const [idType, setIdType] = useState<'passport' | 'license' | null>(null);
  const [idUploaded, setIdUploaded] = useState(false);

  const isPayoutValid =
    (payoutMethod === 'bank' && bankName && accountNumber && routingNumber) ||
    (payoutMethod === 'paypal' && paypalEmail);

  const isTaxValid = taxFormType && legalName && taxId && address;
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
        onClick={() => handleMilestoneComplete('payout')}
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
        onClick={() => setExpandedMilestone('payout')}
        className="mt-4 flex items-center gap-2 rounded-[3px] px-6 py-2.5 text-sm font-medium text-white transition-all hover:opacity-90"
        style={{ backgroundColor: COLORS.primary }}
      >
        <Plus className="h-4 w-4" />
        Add Payout Method
      </button>
    </div>
  );

  const renderTaxForm = () => (
    <div className="mt-4 space-y-4 rounded-lg p-4" style={{ backgroundColor: `${COLORS.primary}10` }}>
      {/* Tax Form Type Selection */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setTaxFormType('w9')}
          className="flex flex-col items-center gap-1 rounded-[3px] border p-3 transition-all"
          style={{
            backgroundColor: taxFormType === 'w9' ? `${COLORS.primary}20` : 'transparent',
            borderColor: taxFormType === 'w9' ? COLORS.primary : COLORS.borderGray,
          }}
        >
          <p
            className="text-sm font-medium"
            style={{ color: taxFormType === 'w9' ? COLORS.textWhite : COLORS.textGray }}
          >
            W-9
          </p>
          <p className="text-xs" style={{ color: COLORS.textGray }}>
            US Residents
          </p>
        </button>

        <button
          type="button"
          onClick={() => setTaxFormType('w8ben')}
          className="flex flex-col items-center gap-1 rounded-[3px] border p-3 transition-all"
          style={{
            backgroundColor: taxFormType === 'w8ben' ? `${COLORS.primary}20` : 'transparent',
            borderColor: taxFormType === 'w8ben' ? COLORS.primary : COLORS.borderGray,
          }}
        >
          <p
            className="text-sm font-medium"
            style={{ color: taxFormType === 'w8ben' ? COLORS.textWhite : COLORS.textGray }}
          >
            W-8BEN
          </p>
          <p className="text-xs" style={{ color: COLORS.textGray }}>
            International
          </p>
        </button>
      </div>

      {taxFormType && (
        <div className="space-y-3">
          <input
            type="text"
            value={legalName}
            onChange={(e) => setLegalName(e.target.value)}
            className="w-full rounded-[3px] border px-4 py-2 text-sm focus:outline-none"
            style={{
              backgroundColor: COLORS.bgInput,
              borderColor: COLORS.borderGray,
              color: COLORS.textWhite,
            }}
            placeholder="Legal name (as on tax return)"
          />
          <input
            type="text"
            value={taxId}
            onChange={(e) => setTaxId(e.target.value)}
            className="w-full rounded-[3px] border px-4 py-2 text-sm focus:outline-none"
            style={{
              backgroundColor: COLORS.bgInput,
              borderColor: COLORS.borderGray,
              color: COLORS.textWhite,
            }}
            placeholder={taxFormType === 'w9' ? 'SSN or EIN' : 'Foreign Tax ID'}
          />
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full rounded-[3px] border px-4 py-2 text-sm focus:outline-none"
            style={{
              backgroundColor: COLORS.bgInput,
              borderColor: COLORS.borderGray,
              color: COLORS.textWhite,
            }}
            placeholder="Address"
          />
        </div>
      )}

      <button
        type="button"
        onClick={() => handleMilestoneComplete('tax')}
        disabled={!isTaxValid}
        className="w-full rounded-[3px] py-2 text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50"
        style={{
          backgroundColor: isTaxValid ? COLORS.primary : COLORS.bgCard,
          color: COLORS.textWhite,
        }}
      >
        Save Tax Information
      </button>
    </div>
  );

  const renderTaxEmptyState = () => {
    const hasPayoutMethod = completedMilestones.has('payout');

    return (
      <div className="mt-4 flex flex-col items-center text-center py-6">
        <div
          className="mb-4 flex h-12 w-12 items-center justify-center rounded-full"
          style={{ backgroundColor: COLORS.bgCard }}
        >
          <FileText className="h-6 w-6" style={{ color: hasPayoutMethod ? COLORS.textGray : COLORS.textGray }} />
        </div>
        <p className="text-sm font-medium" style={{ color: COLORS.textWhite }}>
          You have not completed a tax form.
        </p>
        <p className="mt-1 text-sm" style={{ color: COLORS.textGray }}>
          {hasPayoutMethod
            ? 'Complete your tax information to receive payments.'
            : 'Please setup a payout method before submitting a tax form.'}
        </p>
        {hasPayoutMethod && (
          <button
            type="button"
            onClick={() => setExpandedMilestone('tax')}
            className="mt-4 flex items-center gap-2 rounded-[3px] px-6 py-2.5 text-sm font-medium text-white transition-all hover:opacity-90"
            style={{ backgroundColor: COLORS.primary }}
          >
            <Plus className="h-4 w-4" />
            Add Tax Form
          </button>
        )}
      </div>
    );
  };

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
        <div
          className="rounded-[3px] border-2 border-dashed p-6 text-center cursor-pointer transition-all hover:border-opacity-70"
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
        </div>
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

  const allComplete = completedMilestones.size === MILESTONES.length;

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: COLORS.bgDark }}>
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Hero Section */}
        <Card className="border-0 overflow-hidden" style={{ backgroundColor: '#F9D84E' }}>
          <CardContent className="p-8">
            <div className="flex items-start gap-6">
              <DollarSign className="h-12 w-12 flex-shrink-0" style={{ color: '#000000' }} />
              <div className="flex-1">
                <h2
                  className="mb-2 text-3xl font-[var(--font-test-national-2-narrow)] font-bold uppercase"
                  style={{ color: '#000000' }}
                >
                  Get Ready to Earn
                </h2>
                <p className="mb-6 text-lg" style={{ color: '#000000' }}>
                  Hi {firstName}! Complete these steps now so you&apos;re ready to get paid the
                  moment your music starts earning royalties.
                </p>

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
                        ? '🎉 All done! Redirecting to dashboard...'
                        : `${MILESTONES.length - completedMilestones.size} steps remaining`}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Roadmap - Left Side (2/3 width) */}
          <div className="lg:col-span-2">
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
                            {canExpand && !isExpanded && milestone.id === 'payout' && renderPayoutEmptyState()}
                            {canExpand && isExpanded && milestone.id === 'payout' && renderPayoutForm()}

                            {canExpand && !isExpanded && milestone.id === 'tax' && renderTaxEmptyState()}
                            {canExpand && isExpanded && milestone.id === 'tax' && renderTaxForm()}

                            {canExpand && milestone.id === 'identity' && renderIdentityForm()}

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
                      <p className="text-sm mb-4" style={{ color: COLORS.textGray }}>
                        Great job, {firstName}! Your account is all set up.
                        <br />
                        You&apos;ll get paid the moment your music starts earning royalties.
                      </p>
                      <button
                        type="button"
                        onClick={onComplete}
                        className="rounded-[3px] px-6 py-2 text-sm font-medium transition-all hover:opacity-90"
                        style={{
                          backgroundColor: COLORS.primary,
                          color: COLORS.textWhite,
                        }}
                      >
                        Go to Dashboard
                      </button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Article Card - Right Side (1/3 width) */}
          <div className="lg:col-span-1">
            <Card className="h-full border-white bg-white">
              <CardContent className="flex h-full flex-col bg-white p-6">
                {/* Icon Block */}
                <div
                  className="mb-6 flex w-full flex-shrink-0 items-center justify-center rounded-lg p-8"
                  style={{ backgroundColor: COLORS.primary }}
                >
                  <Wallet className="h-16 w-16 text-white" />
                </div>

                {/* Article Content */}
                <div className="flex-1">
                  <h3 className="mb-4 text-xl font-[var(--font-test-national-2-narrow)] font-bold text-black uppercase">
                    Why Set Up Now?
                  </h3>

                  <div className="space-y-4 text-sm text-gray-700">
                    <p>
                      Setting up your payment info before you release means:
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: COLORS.success }} />
                        <span><strong>No delays</strong> when you start earning</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: COLORS.success }} />
                        <span><strong>Smooth first payout</strong> with verified info</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: COLORS.success }} />
                        <span><strong>Protected account</strong> with ID verification</span>
                      </li>
                    </ul>
                    <p className="pt-2 border-t border-gray-200">
                      Artists who complete setup receive their first payment{' '}
                      <strong style={{ color: COLORS.primary }}>2x faster</strong> on average.
                    </p>
                  </div>

                  <button
                    className="mt-6 flex items-center gap-2 text-sm font-bold text-black hover:underline"
                  >
                    Learn more about payouts
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Skip Option */}
        <div className="text-center">
          <button
            type="button"
            onClick={onComplete}
            className="text-sm underline transition-opacity hover:opacity-70"
            style={{ color: COLORS.textGray }}
          >
            I&apos;ll do this later
          </button>
        </div>
      </div>
    </div>
  );
}
