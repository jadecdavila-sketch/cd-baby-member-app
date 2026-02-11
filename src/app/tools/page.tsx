'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  ExternalLink,
  Link as LinkIcon,
  Megaphone,
  Rocket,
  Save,
  Music,
  Globe,
  Copyright,
  Radio,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { COLORS } from '@/shared/constants/theme';
import { getAssetPath } from '@/shared/utils/asset-path';

import { PlatformClaimDrawer } from './components/platform-claim-drawer';
import { ToolDrawer } from './components/tool-drawer';

type ToolType = 'hearnow' | 'boost' | 'presave';

// Section 1: CD Baby Tools
const CD_BABY_TOOLS = [
  {
    id: 'boost',
    name: 'Boost',
    value: 'Register your tracks and collect more royalties through The MLC, SoundExchange, and CD Baby\'s Sync Licensing program.',
    cta: 'Add Boost',
    icon: Rocket,
    note: 'Paid',
  },
  {
    id: 'hearnow',
    name: 'Promotional Landing Page',
    value: 'Create a single, shareable landing page to promote your release everywhere.',
    cta: 'Create Landing Page',
    icon: LinkIcon,
    note: 'Powered by HearNow',
  },
  {
    id: 'presave',
    name: 'Spotify Pre-Save',
    value: 'Build pre-release momentum by letting fans save your music on Spotify before release day — included with CD Baby distribution.',
    cta: 'Set up Pre-Save',
    icon: Save,
    note: 'Powered by show.co',
  },
  {
    id: 'ads',
    name: 'Ad Campaign Builder',
    value: 'Create targeted ad campaigns to reach new fans and grow your audience.',
    cta: 'Build an Ad',
    icon: Megaphone,
    note: 'Powered by show.co',
  },
];

// Section 2: Platform Tools - with brand colors and white logos
const PLATFORM_TOOLS = [
  { id: 'spotify', name: 'Spotify', logo: 'spotify-white.svg', color: '#1DB954', description: 'Access tools and insights designed to help you grow your presence on Spotify' },
  { id: 'apple', name: 'Apple Music', logo: 'apple-music-white.svg', color: '#FC3C44', description: 'Optimize your releases and artist profile across Apple Music' },
  { id: 'amazon', name: 'Amazon Music', logo: 'amazon-white.svg', color: '#00A8E1', description: 'Manage and promote your music on Amazon Music' },
  { id: 'deezer', name: 'Deezer', logo: 'deezer-white.svg', color: '#A238FF', description: 'Tools to support your reach and performance on Deezer' },
  { id: 'tidal', name: 'TIDAL', logo: 'tidal-white.svg', color: '#000000', description: 'Resources to help maximize your visibility on TIDAL' },
];

// Section 3: Artist Services - Partnerships
const PARTNERSHIPS = [
  {
    id: 'discmakers',
    name: 'Disc Makers',
    description: 'Produce high-quality vinyl and CDs for your physical releases',
  },
];

// Section 3: Artist Services - Third Party Tools
const ARTIST_SERVICES = [
  { id: 'radioairplay', name: 'Radio Airplay', description: 'Get your music played on internet and specialty radio stations', icon: Radio },
  { id: 'bandzoogle', name: 'Bandzoogle', description: 'Build a professional band or artist website with music-focused tools', icon: Globe },
  { id: 'musixmatch', name: 'Musixmatch', description: 'Distribute and sync your lyrics across major music platforms', icon: Music },
  { id: 'cosynd', name: 'Cosynd', description: 'Register copyrights and protect your creative work', icon: Copyright },
  { id: 'easysong', name: 'Easy Song', description: 'Secure licenses for releasing cover songs legally', icon: Music },
  { id: 'groover', name: 'Groover', description: 'Pitch your music directly to curators, radios, and industry professionals', icon: Music },
  { id: 'symphonyos', name: 'SymphonyOS', description: 'All-in-one marketing platform to promote, track, and grow your music', icon: Megaphone },
  { id: 'unhurd', name: 'Un:hurd', description: 'Pitch your tracks to playlist curators and tastemakers', icon: Music },
];

// Section 4: Learn & Get Guidance - Using dashboard resource style
const GUIDES = [
  {
    id: 'promote-release',
    title: 'How to Promote a Release',
    description: 'Step-by-step strategies to get your music heard by more listeners.',
    image: '/assets/resources/1.png',
  },
  {
    id: 'after-distribution',
    title: 'What to Do After Distribution',
    description: 'Essential next steps once your music is live on streaming platforms.',
    image: '/assets/resources/2.png',
  },
  {
    id: 'royalties',
    title: 'Understanding Music Royalties',
    description: 'Learn how you earn money from streams, downloads, and more.',
    image: '/assets/resources/3.png',
  },
  {
    id: 'playlist-pitching',
    title: 'Playlist Pitching',
    description: 'Get featured on playlists and grow your audience.',
    image: '/assets/resources/4.png',
  },
];

export default function ToolsPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<ToolType>('hearnow');
  const [platformDrawerOpen, setPlatformDrawerOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('spotify');

  const handleToolClick = (toolId: string) => {
    if (toolId === 'hearnow' || toolId === 'boost' || toolId === 'presave') {
      setSelectedTool(toolId as ToolType);
      setDrawerOpen(true);
    } else if (toolId === 'ads') {
      // Redirect to show.co for Ad Campaign
      window.open('https://show.co', '_blank');
    }
  };

  const handlePlatformClick = (platformId: string) => {
    setSelectedPlatform(platformId);
    setPlatformDrawerOpen(true);
  };

  return (
    <div className="px-6 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1
          className="text-2xl font-bold font-[var(--font-test-national-2-narrow)] uppercase tracking-wide"
          style={{ color: COLORS.textWhite }}
        >
          Tools & Promotions
        </h1>
        <p className="mt-2 text-sm max-w-2xl" style={{ color: COLORS.textGray }}>
          Recommended tools to promote your release, grow your audience, and manage your artist presence.
        </p>
      </div>

      {/* Section 1: CD Baby Tools */}
      <Card className="border-0 mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-base uppercase">CD Baby Tools</CardTitle>
          <p className="text-sm mt-1" style={{ color: COLORS.textGray }}>
            Tools built and managed by CD Baby to help you release, promote, and monetize your music.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CD_BABY_TOOLS.map((tool) => {
              const Icon = tool.icon;
              return (
                <div
                  key={tool.id}
                  className="flex overflow-hidden rounded-[3px]"
                  style={{ backgroundColor: COLORS.bgDark, border: `1px solid ${COLORS.borderGray}` }}
                >
                  {/* Icon column */}
                  <div
                    className="w-20 flex-shrink-0 flex items-center justify-center"
                    style={{ backgroundColor: `${COLORS.primary}15` }}
                  >
                    <Icon className="h-8 w-8" style={{ color: COLORS.primary }} />
                  </div>
                  {/* Content column */}
                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-base" style={{ color: COLORS.textWhite }}>
                          {tool.name}
                        </h3>
                        <p className="text-sm mt-1 leading-relaxed" style={{ color: COLORS.textGray }}>
                          {tool.value}
                        </p>
                      </div>
                      {tool.note && (
                        <span
                          className="text-xs px-2 py-1 rounded-[3px] whitespace-nowrap flex-shrink-0"
                          style={{ backgroundColor: COLORS.bgCard, color: COLORS.textGray }}
                        >
                          {tool.note}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToolClick(tool.id)}
                      className="mt-4 rounded-[3px] px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90"
                      style={{ backgroundColor: COLORS.primary, color: COLORS.textWhite }}
                    >
                      {tool.cta}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Platform Tools - Grid */}
      <Card className="border-0 mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-base uppercase">Platform Tools</CardTitle>
          <p className="text-sm mt-1" style={{ color: COLORS.textGray }}>
            Tools and resources designed to help you optimize your presence on major streaming platforms.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            {PLATFORM_TOOLS.map((platform) => (
              <button
                key={platform.id}
                type="button"
                onClick={() => handlePlatformClick(platform.id)}
                className="flex flex-col items-center justify-center rounded-[3px] p-6 transition-all hover:opacity-90 cursor-pointer"
                style={{
                  background: platform.color,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                }}
              >
                {/* Logo - white on colored background */}
                <div className="relative h-10 w-10 mb-3">
                  <Image
                    src={getAssetPath(`/assets/platforms/${platform.logo}`)}
                    alt={platform.name}
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>

                {/* Platform Name */}
                <p className="font-semibold text-sm text-white text-center">
                  {platform.name}
                </p>

                {/* CTA */}
                <span className="text-xs text-white/70 mt-2">
                  Claim profile →
                </span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Artist Services */}
      <Card className="border-0 mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-base uppercase">Artist Services</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Partnerships */}
          <div>
            <p className="text-xs uppercase tracking-wide mb-3" style={{ color: COLORS.textGray }}>
              Partnerships
            </p>
            <div className="flex flex-wrap gap-3">
              {PARTNERSHIPS.map((partner) => (
                <button
                  key={partner.id}
                  type="button"
                  className="flex items-center gap-4 rounded-[3px] px-5 py-4 transition-all hover:bg-white/5"
                  style={{ backgroundColor: COLORS.bgDark, border: `1px solid ${COLORS.borderGray}` }}
                >
                  <div>
                    <p className="font-medium text-left" style={{ color: COLORS.textWhite }}>
                      {partner.name}
                    </p>
                    <p className="text-sm text-left" style={{ color: COLORS.textGray }}>
                      {partner.description}
                    </p>
                  </div>
                  <ExternalLink className="h-4 w-4 flex-shrink-0" style={{ color: COLORS.primary }} />
                </button>
              ))}
            </div>
          </div>

          {/* Third Party Tools */}
          <div>
            <p className="text-xs uppercase tracking-wide mb-3" style={{ color: COLORS.textGray }}>
              Third Party Tools
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {ARTIST_SERVICES.map((tool) => {
                const Icon = tool.icon;
                return (
                  <button
                    key={tool.id}
                    type="button"
                    className="flex items-center gap-3 rounded-[3px] p-4 text-left transition-all hover:bg-white/5"
                    style={{ backgroundColor: COLORS.bgDark, border: `1px solid ${COLORS.borderGray}` }}
                  >
                    <div
                      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
                      style={{ backgroundColor: COLORS.bgCard }}
                    >
                      <Icon className="h-5 w-5" style={{ color: COLORS.textGray }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm" style={{ color: COLORS.textWhite }}>
                        {tool.name}
                      </p>
                      <p className="text-xs" style={{ color: COLORS.textGray }}>
                        {tool.description}
                      </p>
                    </div>
                    <ExternalLink className="h-4 w-4 flex-shrink-0" style={{ color: COLORS.textGray }} />
                  </button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Learn & Get Guidance - Dashboard style resources */}
      <Card className="border-0">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base uppercase">Learn & Get Guidance</CardTitle>
            <Link
              href="#"
              className="flex items-center gap-1 text-sm font-medium transition-opacity hover:opacity-80"
              style={{ color: COLORS.primary }}
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {GUIDES.map((guide) => (
              <Link
                key={guide.id}
                href="#"
                className="group rounded-[3px] overflow-hidden transition-all hover:opacity-90"
                style={{ backgroundColor: COLORS.bgDark, border: `1px solid ${COLORS.borderGray}` }}
              >
                {/* Resource Image - 374x403 aspect ratio like dashboard */}
                <div className="relative w-full overflow-hidden" style={{ aspectRatio: '374/403' }}>
                  <Image
                    src={getAssetPath(guide.image)}
                    alt={guide.title}
                    fill
                    className="object-contain transition-transform group-hover:scale-105"
                  />
                </div>
                {/* Resource Content */}
                <div className="p-3">
                  <h3 className="text-sm font-medium mb-1 line-clamp-1" style={{ color: COLORS.textWhite }}>
                    {guide.title}
                  </h3>
                  <p className="text-xs line-clamp-2" style={{ color: COLORS.textGray }}>
                    {guide.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tool Drawer */}
      <ToolDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        toolType={selectedTool}
      />

      {/* Platform Claim Drawer */}
      <PlatformClaimDrawer
        open={platformDrawerOpen}
        onOpenChange={setPlatformDrawerOpen}
        platformId={selectedPlatform}
      />
    </div>
  );
}
