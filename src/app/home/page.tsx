'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  AlertTriangle,
  Building2,
  Check,
  ChevronDown,
  Clock,
  DollarSign,
  Disc3,
  Music,
  Plus,
  User,
  Wallet,
} from 'lucide-react';

import { COLORS } from '@/shared/constants/theme';
import { getAssetPath } from '@/shared/utils/asset-path';
import { JourneyBanner } from '@/shared/components/journey-banner';
import { KPICards } from '@/app/analytics/components/kpi-cards';
import { MetricsChart } from '@/app/analytics/components/metrics-chart';
import { mockKPIs, mockTimeSeriesData } from '@/app/analytics/mock-data';

// Dashboard states based on PRD
type DashboardState = 'brand-new' | 'has-draft' | 'in-review' | 'delivered';

type SetupTask = 'account-info' | 'payout-tax' | 'release';

interface Milestone {
  id: SetupTask;
  icon: typeof Wallet;
  title: string;
  description: string;
}

// Mock release data for different states
interface Release {
  id: string;
  title: string;
  artist: string;
  type: 'single' | 'album';
  status: 'draft' | 'sent-for-review' | 'needs-attention' | 'delivered';
  coverArt?: string;
  updatedAt: string;
}

const MOCK_RELEASES: Record<DashboardState, Release[]> = {
  'brand-new': [],
  'has-draft': [
    {
      id: '1',
      title: 'Summer Vibes',
      artist: 'Your Artist Name',
      type: 'single',
      status: 'needs-attention',
      coverArt: '/assets/covers/cover1.jpg',
      updatedAt: '2 hours ago',
    },
    {
      id: '2',
      title: 'Late Night Sessions',
      artist: 'Your Artist Name',
      type: 'album',
      status: 'draft',
      coverArt: '/assets/covers/cover2.jpg',
      updatedAt: '3 days ago',
    },
    {
      id: '3',
      title: 'Ocean Waves',
      artist: 'Your Artist Name',
      type: 'single',
      status: 'draft',
      coverArt: '/assets/covers/cover3.jpg',
      updatedAt: '1 week ago',
    },
  ],
  'in-review': [
    {
      id: '4',
      title: 'Midnight Dreams',
      artist: 'Your Artist Name',
      type: 'album',
      status: 'sent-for-review',
      coverArt: '/assets/covers/cover2.jpg',
      updatedAt: '1 day ago',
    },
    {
      id: '5',
      title: 'City Lights',
      artist: 'Your Artist Name',
      type: 'single',
      status: 'draft',
      coverArt: '/assets/covers/cover1.jpg',
      updatedAt: '3 days ago',
    },
    {
      id: '6',
      title: 'Neon Glow EP',
      artist: 'Your Artist Name',
      type: 'album',
      status: 'draft',
      coverArt: '/assets/covers/cover4.jpg',
      updatedAt: '5 days ago',
    },
  ],
  delivered: [
    {
      id: '7',
      title: 'Electric Sunset',
      artist: 'Your Artist Name',
      type: 'single',
      status: 'delivered',
      coverArt: '/assets/covers/cover3.jpg',
      updatedAt: '2 weeks ago',
    },
    {
      id: '8',
      title: 'Night Rider EP',
      artist: 'Your Artist Name',
      type: 'album',
      status: 'delivered',
      coverArt: '/assets/covers/cover4.jpg',
      updatedAt: '1 month ago',
    },
    {
      id: '9',
      title: 'Starlight',
      artist: 'Your Artist Name',
      type: 'single',
      status: 'delivered',
      coverArt: '/assets/covers/cover1.jpg',
      updatedAt: '2 months ago',
    },
  ],
};

// Mock earnings data
const MOCK_EARNINGS = {
  currentBalance: 127.43,
  payPointThreshold: 100,
  pendingEarnings: 45.21,
};

// Resources data based on dashboard state (per PRD)
interface Resource {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
}

const RESOURCES_BY_STATE: Record<DashboardState, Resource[]> = {
  'brand-new': [
    {
      id: '1',
      title: 'Distribution 101',
      description: 'Learn the basics of music distribution',
      image: '/assets/resources/1.png',
      link: '#',
    },
    {
      id: '2',
      title: 'Music Industry 101',
      description: 'Understanding how the industry works',
      image: '/assets/resources/2.png',
      link: '#',
    },
    {
      id: '3',
      title: 'Best Practices',
      description: 'Tips for a successful release',
      image: '/assets/resources/3.png',
      link: '#',
    },
    {
      id: '4',
      title: 'Getting Started',
      description: 'Your first steps as an artist',
      image: '/assets/resources/4.png',
      link: '#',
    },
  ],
  'has-draft': [
    {
      id: '1',
      title: 'Finishing Your Release',
      description: 'Complete your draft and get distributed',
      image: '/assets/resources/1.png',
      link: '#',
    },
    {
      id: '2',
      title: 'Pre-Release Checklist',
      description: 'Make sure everything is ready',
      image: '/assets/resources/2.png',
      link: '#',
    },
    {
      id: '3',
      title: 'Marketing Prep',
      description: 'Plan your release promotion',
      image: '/assets/resources/3.png',
      link: '#',
    },
    {
      id: '4',
      title: 'Cover Art Guide',
      description: 'Create eye-catching artwork',
      image: '/assets/resources/4.png',
      link: '#',
    },
  ],
  'in-review': [
    {
      id: '1',
      title: 'Music Marketing 101',
      description: 'Promote your music effectively',
      image: '/assets/resources/1.png',
      link: '#',
    },
    {
      id: '2',
      title: 'What to Do During Finalization',
      description: 'Make the most of your wait time',
      image: '/assets/resources/2.png',
      link: '#',
    },
    {
      id: '3',
      title: 'Social Media Strategy',
      description: 'Build your audience online',
      image: '/assets/resources/3.png',
      link: '#',
    },
    {
      id: '4',
      title: 'Pre-Save Campaigns',
      description: 'Generate buzz before release',
      image: '/assets/resources/4.png',
      link: '#',
    },
  ],
  delivered: [
    {
      id: '1',
      title: 'Spotify for Artists',
      description: 'Claim and optimize your profile',
      image: '/assets/resources/1.png',
      link: '#',
    },
    {
      id: '2',
      title: 'Growing Your Fanbase',
      description: 'Advanced marketing strategies',
      image: '/assets/resources/2.png',
      link: '#',
    },
    {
      id: '3',
      title: 'Understanding Royalties',
      description: 'How you get paid for streams',
      image: '/assets/resources/3.png',
      link: '#',
    },
    {
      id: '4',
      title: 'Playlist Pitching',
      description: 'Get featured on playlists',
      image: '/assets/resources/4.png',
      link: '#',
    },
  ],
};

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

const DASHBOARD_STATE_LABELS: Record<DashboardState, string> = {
  'brand-new': 'Brand New User (No Releases)',
  'has-draft': 'Has Draft (Unfinished Release)',
  'in-review': 'In Review (Finalized, Not Delivered)',
  delivered: 'Delivered (With Analytics & Earnings)',
};

export default function HomePage() {
  // Dashboard state for testing
  const [dashboardState, setDashboardState] = useState<DashboardState>('brand-new');
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const [releasesExpanded, setReleasesExpanded] = useState(false);

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

  // Get releases for current state
  const releases = MOCK_RELEASES[dashboardState];

  // Determine which modules to show based on state
  const showOnboarding = dashboardState === 'brand-new' || dashboardState === 'has-draft';
  const showReleaseCatalog = dashboardState !== 'brand-new';
  const showAnalytics = dashboardState === 'delivered';
  const showBalance = dashboardState === 'delivered';
  const showAnalyticsPlaceholder = dashboardState === 'in-review';

  // Release catalog component
  const renderReleaseCatalog = () => {
    if (!showReleaseCatalog) return null;

    const displayedReleases = releasesExpanded ? releases : releases.slice(0, 3);
    const hiddenCount = releases.length - 3;

    return (
      <div
        className="rounded-[3px] p-6"
        style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.borderGray}` }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold uppercase tracking-wide" style={{ color: COLORS.textWhite }}>
            Your Releases
          </h2>
          <Link
            href="/releases"
            className="text-sm font-medium transition-opacity hover:opacity-80"
            style={{ color: COLORS.primary }}
          >
            View All
          </Link>
        </div>

        {releases.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm" style={{ color: COLORS.textGray }}>
              No releases yet
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedReleases.map((release) => (
              <div
                key={release.id}
                className="rounded-[3px] overflow-hidden transition-all hover:scale-[1.02] hover:shadow-lg"
                style={{
                  backgroundColor: COLORS.bgDark,
                  border: release.status === 'needs-attention' ? `2px solid ${COLORS.warning}` : `1px solid ${COLORS.borderGray}`,
                }}
              >
                {/* Cover Art - Large and Prominent */}
                <div className="relative aspect-square w-full overflow-hidden">
                  {release.coverArt ? (
                    <Image
                      src={getAssetPath(release.coverArt)}
                      alt={release.title}
                      fill
                      className="object-cover transition-transform hover:scale-105"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ backgroundColor: `${COLORS.primary}20` }}
                    >
                      {release.type === 'album' ? (
                        <Disc3 className="h-16 w-16" style={{ color: COLORS.primary }} />
                      ) : (
                        <Music className="h-16 w-16" style={{ color: COLORS.primary }} />
                      )}
                    </div>
                  )}
                  {/* Status Badge Overlay */}
                  <div className="absolute top-3 right-3">
                    {release.status === 'draft' && (
                      <span
                        className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm"
                        style={{ backgroundColor: 'rgba(0,0,0,0.7)', color: COLORS.textGray }}
                      >
                        <Clock className="h-3 w-3" />
                        Draft
                      </span>
                    )}
                    {release.status === 'sent-for-review' && (
                      <span
                        className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm"
                        style={{ backgroundColor: 'rgba(0,0,0,0.7)', color: COLORS.primary }}
                      >
                        <Clock className="h-3 w-3" />
                        In Review
                      </span>
                    )}
                    {release.status === 'needs-attention' && (
                      <span
                        className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm"
                        style={{ backgroundColor: 'rgba(0,0,0,0.7)', color: COLORS.warning }}
                      >
                        <AlertTriangle className="h-3 w-3" />
                        Needs Attention
                      </span>
                    )}
                    {release.status === 'delivered' && (
                      <span
                        className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm"
                        style={{ backgroundColor: 'rgba(0,0,0,0.7)', color: COLORS.success }}
                      >
                        <Check className="h-3 w-3" />
                        Live
                      </span>
                    )}
                  </div>
                </div>

                {/* Release Info */}
                <div className="p-4">
                  <p className="font-semibold text-lg truncate" style={{ color: COLORS.textWhite }}>
                    {release.title}
                  </p>
                  <p className="text-sm truncate mt-1" style={{ color: COLORS.textGray }}>
                    {release.artist} • {release.type === 'album' ? 'Album' : 'Single'}
                  </p>

                  {/* Action Button */}
                  <div className="mt-4">
                    {release.status === 'draft' && (
                      <button
                        type="button"
                        className="w-full text-sm font-medium px-4 py-2.5 rounded-[3px] transition-opacity hover:opacity-90"
                        style={{ backgroundColor: COLORS.primary, color: COLORS.textWhite }}
                      >
                        Resume
                      </button>
                    )}
                    {release.status === 'needs-attention' && (
                      <button
                        type="button"
                        className="w-full text-sm font-medium px-4 py-2.5 rounded-[3px] transition-opacity hover:opacity-90"
                        style={{ backgroundColor: COLORS.warning, color: '#000' }}
                      >
                        Fix Issues
                      </button>
                    )}
                    {release.status === 'delivered' && (
                      <button
                        type="button"
                        className="w-full text-sm font-medium px-4 py-2.5 rounded-[3px] transition-opacity hover:opacity-90"
                        style={{ backgroundColor: COLORS.bgCard, color: COLORS.textWhite, border: `1px solid ${COLORS.borderGray}` }}
                      >
                        View
                      </button>
                    )}
                    {release.status === 'sent-for-review' && (
                      <button
                        type="button"
                        className="w-full text-sm font-medium px-4 py-2.5 rounded-[3px] transition-opacity hover:opacity-90"
                        style={{ backgroundColor: COLORS.bgCard, color: COLORS.textWhite, border: `1px solid ${COLORS.borderGray}` }}
                      >
                        View Details
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Show More / Show Less Button */}
            {hiddenCount > 0 && (
              <button
                type="button"
                onClick={() => setReleasesExpanded(!releasesExpanded)}
                className="w-full text-sm font-medium py-2 transition-opacity hover:opacity-80"
                style={{ color: COLORS.primary }}
              >
                {releasesExpanded ? 'Show less' : `+${hiddenCount} more`}
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  // Analytics component (real data for delivered state)
  const renderAnalyticsModule = () => {
    if (!showAnalytics) return null;

    return (
      <div
        className="rounded-[3px] p-6"
        style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.borderGray}` }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold uppercase tracking-wide" style={{ color: COLORS.textWhite }}>
            Analytics
          </h2>
          <Link
            href="/analytics"
            className="text-sm font-medium transition-opacity hover:opacity-80"
            style={{ color: COLORS.primary }}
          >
            View All
          </Link>
        </div>

        {/* KPI Cards from Analytics page */}
        <div className="mb-6">
          <KPICards kpis={mockKPIs} />
        </div>

        {/* Performance Over Time Chart from Analytics page */}
        <MetricsChart data={mockTimeSeriesData} />
      </div>
    );
  };

  // Balance + Pay Point Progress component
  const renderBalanceModule = () => {
    if (!showBalance) return null;

    const progressPercent = Math.min(
      100,
      (MOCK_EARNINGS.currentBalance / MOCK_EARNINGS.payPointThreshold) * 100
    );
    const isAbovePayPoint = MOCK_EARNINGS.currentBalance >= MOCK_EARNINGS.payPointThreshold;

    return (
      <div
        className="rounded-[3px] p-6"
        style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.borderGray}` }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold uppercase tracking-wide" style={{ color: COLORS.textWhite }}>
            Earnings
          </h2>
          <Link
            href="/earnings"
            className="text-sm font-medium transition-opacity hover:opacity-80"
            style={{ color: COLORS.primary }}
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Current Balance */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4" style={{ color: COLORS.success }} />
              <span className="text-sm" style={{ color: COLORS.textGray }}>Current Balance</span>
            </div>
            <p className="text-3xl font-bold" style={{ color: COLORS.success }}>
              ${MOCK_EARNINGS.currentBalance.toFixed(2)}
            </p>
            {isAbovePayPoint && (
              <p className="text-sm mt-1" style={{ color: COLORS.success }}>
                Ready for withdrawal
              </p>
            )}
          </div>

          {/* Pay Point Progress */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="h-4 w-4" style={{ color: COLORS.textGray }} />
              <span className="text-sm" style={{ color: COLORS.textGray }}>Pay Point Progress</span>
            </div>
            <div
              className="h-3 rounded-full overflow-hidden mb-2"
              style={{ backgroundColor: COLORS.bgDark }}
            >
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${progressPercent}%`,
                  backgroundColor: isAbovePayPoint ? COLORS.success : COLORS.primary,
                }}
              />
            </div>
            <p className="text-sm" style={{ color: COLORS.textGray }}>
              ${MOCK_EARNINGS.currentBalance.toFixed(2)} / ${MOCK_EARNINGS.payPointThreshold} minimum
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Get resources for current state
  const resources = RESOURCES_BY_STATE[dashboardState];

  // Resources component
  const renderResources = () => {
    return (
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold uppercase tracking-wide" style={{ color: COLORS.textWhite }}>
            Resources
          </h2>
          <Link
            href="#"
            className="flex items-center gap-1 text-sm font-medium transition-opacity hover:opacity-80"
            style={{ color: COLORS.primary }}
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {resources.map((resource) => (
            <Link
              key={resource.id}
              href={resource.link}
              className="group rounded-[3px] overflow-hidden transition-all hover:opacity-90"
              style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.borderGray}` }}
            >
              {/* Resource Image - 374x403 aspect ratio */}
              <div className="relative w-full overflow-hidden" style={{ aspectRatio: '374/403' }}>
                <Image
                  src={getAssetPath(resource.image)}
                  alt={resource.title}
                  fill
                  className="object-contain transition-transform group-hover:scale-105"
                />
              </div>
              {/* Resource Content */}
              <div className="p-3">
                <h3 className="text-sm font-medium mb-1 line-clamp-1" style={{ color: COLORS.textWhite }}>
                  {resource.title}
                </h3>
                <p className="text-xs line-clamp-2" style={{ color: COLORS.textGray }}>
                  {resource.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  };

  // Journey to 1000 streams banner for in-review state
  const renderJourneyBanner = () => {
    if (!showAnalyticsPlaceholder) return null;

    return <JourneyBanner showLearnMore />;
  };

  return (
    <div className="px-6 py-8">
      {/* State Toggle - For Testing Only */}
      <div className="mb-6 relative">
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-wide" style={{ color: COLORS.textGray }}>
            Testing Mode:
          </span>
          <button
            type="button"
            onClick={() => setStateDropdownOpen(!stateDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-[3px] text-sm font-medium transition-colors"
            style={{
              backgroundColor: COLORS.bgCard,
              border: `1px solid ${COLORS.borderGray}`,
              color: COLORS.textWhite,
            }}
          >
            {DASHBOARD_STATE_LABELS[dashboardState]}
            <ChevronDown
              className={`h-4 w-4 transition-transform ${stateDropdownOpen ? 'rotate-180' : ''}`}
              style={{ color: COLORS.textGray }}
            />
          </button>
        </div>

        {stateDropdownOpen && (
          <div
            className="absolute top-full left-0 mt-2 w-80 rounded-[3px] shadow-lg z-50 overflow-hidden"
            style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.borderGray}` }}
          >
            {(Object.keys(DASHBOARD_STATE_LABELS) as DashboardState[]).map((state) => (
              <button
                key={state}
                type="button"
                onClick={() => {
                  setDashboardState(state);
                  setStateDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-3 text-sm transition-colors hover:bg-opacity-50"
                style={{
                  backgroundColor: dashboardState === state ? `${COLORS.primary}20` : 'transparent',
                  color: dashboardState === state ? COLORS.primary : COLORS.textWhite,
                }}
              >
                {DASHBOARD_STATE_LABELS[state]}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Onboarding Section - Only for brand-new and has-draft states */}
      {showOnboarding && (
        <div className="flex gap-4">
        {MILESTONES.map((milestone, index) => {
          const isCompleted = completedMilestones.has(milestone.id);
          const isCurrent = currentMilestoneId === milestone.id;
          const isExpanded = isCurrent;
          const Icon = milestone.icon;

          // Account info stays small, payout+tax and release get equal larger sizes
          const isAccountInfo = milestone.id === 'account-info';
          const flexClass = isExpanded ? 'flex-[3]' : isAccountInfo ? 'flex-none' : 'flex-1';

          return (
            <div
              key={milestone.id}
              className={`rounded-[3px] overflow-hidden transition-all duration-300 ${flexClass}`}
              style={{
                backgroundColor: COLORS.bgCard,
                border: `1px solid ${isCurrent ? COLORS.primary : COLORS.borderGray}`,
                ...(isAccountInfo && !isExpanded ? { width: '160px' } : {}),
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
                  {/* Show CTA for release milestone, "Up Next" badge for others */}
                  {milestone.id === 'release' ? (
                    <Link
                      href="/onboarding/release-type"
                      className="mt-3 px-4 py-2 rounded-[3px] text-xs font-medium transition-opacity hover:opacity-90"
                      style={{ backgroundColor: COLORS.primary, color: COLORS.textWhite }}
                    >
                      Start a Release
                    </Link>
                  ) : (
                    <span
                      className="text-xs font-medium mt-3 px-3 py-1 rounded-full"
                      style={{ backgroundColor: COLORS.bgDark, color: COLORS.textGray }}
                    >
                      Up Next
                    </span>
                  )}
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
      )}

      {/* Balance/Earnings Module - At the top for delivered state */}
      {showBalance && (
        <div className="mt-6">
          {renderBalanceModule()}
        </div>
      )}

      {/* Release Catalog - For has-draft, in-review, delivered states */}
      {showReleaseCatalog && (
        <div className="mt-6">
          {renderReleaseCatalog()}
        </div>
      )}

      {/* Analytics Module - Only for delivered state */}
      {showAnalytics && (
        <div className="mt-6">
          {renderAnalyticsModule()}
        </div>
      )}

      {/* Analytics Placeholder with Overlay - For non-delivered states */}
      <div className="mt-6">
        {renderJourneyBanner()}
      </div>

      {/* Resources Section - Always shown, content varies by state */}
      {renderResources()}
    </div>
  );
}
