'use client';

import { useState } from 'react';
import {
  Music,
  Sparkles,
  Heart,
  Users,
  TrendingUp,
  Share2,
  Target,
  Megaphone,
  Music2,
  Gift,
  CheckCircle2,
  ArrowRight,
  Zap,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Button } from '@/shared/components/shadcn/button';

// Helper function to add basePath for production
const getAssetPath = (path: string) => {
  const basePath =
    process.env.NODE_ENV === 'production' ? '/cd-baby-member-app' : '';
  return `${basePath}${path}`;
};

interface Milestone {
  range: string;
  current: number;
  goal: number;
  title: string;
  description: string;
  actions: string[];
  completed: boolean;
}

interface EmptyStateProps {
  onComplete?: () => void;
}

export function EmptyState({ onComplete }: EmptyStateProps) {
  // Track which actions have been checked
  const [checkedActions, setCheckedActions] = useState<Set<string>>(new Set());
  const [celebratingAction, setCelebratingAction] = useState<string | null>(
    null
  );
  const [completedMilestoneRanges, setCompletedMilestoneRanges] = useState<
    Set<string>
  >(new Set());
  const [justCompletedMilestone, setJustCompletedMilestone] = useState<
    string | null
  >(null);

  const handleCheckAction = (
    actionKey: string,
    milestoneRange: string,
    totalActions: number
  ) => {
    const newChecked = new Set(checkedActions);

    if (newChecked.has(actionKey)) {
      // Uncheck
      newChecked.delete(actionKey);
    } else {
      // Check with celebration
      newChecked.add(actionKey);
      setCelebratingAction(actionKey);

      // Clear celebration after animation
      setTimeout(() => {
        setCelebratingAction(null);
      }, 1000);
    }

    setCheckedActions(newChecked);

    // Check if all actions in this milestone are now complete
    const milestoneActionKeys = Array.from(
      { length: totalActions },
      (_, i) => `${milestoneRange}-${i}`
    );
    const allChecked = milestoneActionKeys.every((key) => newChecked.has(key));

    if (allChecked && !completedMilestoneRanges.has(milestoneRange)) {
      // Milestone just completed!
      setJustCompletedMilestone(milestoneRange);

      // After showing celebration, mark as complete and move to next
      setTimeout(() => {
        const newCompletedMilestones = new Set(completedMilestoneRanges);
        newCompletedMilestones.add(milestoneRange);
        setCompletedMilestoneRanges(newCompletedMilestones);
        setJustCompletedMilestone(null);

        // Check if this was the final milestone (1000 streams)
        if (milestoneRange === '750-1,000' && onComplete) {
          // Give a moment to see the completion, then transition
          setTimeout(() => {
            onComplete();
          }, 2000);
        }
      }, 2000);
    } else if (!allChecked && completedMilestoneRanges.has(milestoneRange)) {
      // Milestone was completed but now unchecked
      const newCompletedMilestones = new Set(completedMilestoneRanges);
      newCompletedMilestones.delete(milestoneRange);
      setCompletedMilestoneRanges(newCompletedMilestones);
    }
  };

  // Calculate current streams based on completed milestones
  const calculateStreamsFromMilestones = () => {
    const milestoneStreamGoals: Record<string, number> = {
      '0-10': 10,
      '10-100': 100,
      '100-500': 500,
      '500-750': 750,
      '750-1,000': 1000,
    };

    let totalStreams = 0;
    for (const range of completedMilestoneRanges) {
      totalStreams = Math.max(totalStreams, milestoneStreamGoals[range] || 0);
    }
    return totalStreams;
  };

  const currentStreams = calculateStreamsFromMilestones();
  const goalStreams = 1000;
  const progressPercentage = (currentStreams / goalStreams) * 100;

  const milestones: Milestone[] = [
    {
      range: '0-10',
      current: currentStreams,
      goal: 10,
      title: 'Engage Your Inner Circle',
      description: 'Start with the people who already support you',
      actions: [
        'Personally text friends and family about your release',
        'Ask close connections to stream and share',
        'Reach out to collaborators to help promote',
      ],
      completed: currentStreams >= 10,
    },
    {
      range: '10-100',
      current: Math.max(0, currentStreams - 10),
      goal: 100,
      title: 'Activate Social Media',
      description: 'Expand your reach through your networks',
      actions: [
        'Announce your release across all platforms',
        'Share behind-the-scenes content',
        'Create playlists featuring your track',
        'Engage with every comment and share',
      ],
      completed: currentStreams >= 100,
    },
    {
      range: '100-500',
      current: Math.max(0, currentStreams - 100),
      goal: 500,
      title: 'Experiment & Network',
      description: 'Try new approaches and connect with communities',
      actions: [
        'Play local shows and promote your music',
        'Pitch to local press and playlists',
        'Engage with niche online communities',
        'Share content that drives engagement',
      ],
      completed: currentStreams >= 500,
    },
    {
      range: '500-750',
      current: Math.max(0, currentStreams - 500),
      goal: 750,
      title: 'Strategic Content Creation',
      description: 'Build momentum with consistent content',
      actions: [
        'Post 3-5 times weekly across platforms',
        'Share milestone updates with your fans',
        'Promote upcoming shows and events',
        'Preview future projects to build anticipation',
      ],
      completed: currentStreams >= 750,
    },
    {
      range: '750-1,000',
      current: Math.max(0, currentStreams - 750),
      goal: 1000,
      title: 'Build Your Community',
      description: 'Turn listeners into engaged fans',
      actions: [
        'Encourage fan-created playlists',
        'Run engagement giveaways',
        'Collect email contacts for your mailing list',
        'Partner with local brands and venues',
      ],
      completed: currentStreams >= 1000,
    },
  ];

  const getCurrentMilestone = () => {
    // If we're celebrating, show the milestone that was just completed
    if (justCompletedMilestone) {
      return (
        milestones.find((m) => m.range === justCompletedMilestone) ||
        milestones[0]
      );
    }
    // Otherwise, find the first milestone that hasn't been manually completed by the user
    return (
      milestones.find((m) => !completedMilestoneRanges.has(m.range)) ||
      milestones[milestones.length - 1]
    );
  };

  const currentMilestone = getCurrentMilestone();
  const completedMilestones = completedMilestoneRanges.size;

  return (
    <div className="space-y-8">
      {/* Hero Section - Journey to 1k */}
      <Card className="border-0" style={{ backgroundColor: '#61113A' }}>
        <CardContent className="p-8">
          <div className="flex items-start gap-6">
            <img
              src="/assets/cd.png"
              alt="CD"
              className="h-12 w-12 flex-shrink-0"
            />
            <div className="flex-1">
              <h2 className="mb-2 text-3xl font-[var(--font-test-national-2-narrow)] font-bold">
                Your Journey to 1,000 Streams
              </h2>
              <p className="text-muted-foreground mb-6 text-lg">
                Reach 1,000 streams and join the top 13% of tracks on Spotify.
                This milestone unlocks monetization and proves your music
                resonates with listeners.
              </p>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm font-medium text-[var(--cdbaby-light-blue)]">
                    {currentStreams} / {goalStreams} streams
                  </span>
                </div>
                <div className="bg-muted h-3 w-full overflow-hidden rounded-full">
                  <div
                    className="h-full transition-all duration-500"
                    style={{
                      width: `${Math.max(2, progressPercentage)}%`,
                      backgroundColor: '#ff386a',
                    }}
                  />
                </div>
              </div>

              {/* Milestone Progress */}
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <Sparkles className="h-4 w-4" style={{ color: '#ff386a' }} />
                <span>
                  {completedMilestones === 0
                    ? "Ready to start your journey? Let's get your first streams!"
                    : `${completedMilestones} of ${milestones.length} milestones completed`}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Roadmap with Embedded Checklists */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Roadmap - Left Side (2/3 width) */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music2 className="h-5 w-5" />
                Your Complete Roadmap
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {milestones.map((milestone, index) => {
                  const isMilestoneCompleted = completedMilestoneRanges.has(
                    milestone.range
                  );
                  const isCurrentMilestone =
                    currentMilestone?.range === milestone.range;
                  const isJustCompleted =
                    justCompletedMilestone === milestone.range;

                  return (
                    <div key={index} className="relative">
                      {/* Connector Line */}
                      {index < milestones.length - 1 && (
                        <div
                          className={`absolute top-12 left-4 h-full w-0.5 transition-colors duration-500 ${
                            isMilestoneCompleted
                              ? 'bg-[var(--cdbaby-green)]'
                              : 'bg-border'
                          }`}
                        />
                      )}

                      <div
                        className={`flex gap-4 transition-all duration-500 ${
                          isMilestoneCompleted ? 'opacity-60' : ''
                        } ${isCurrentMilestone && !isMilestoneCompleted ? '-mx-4 rounded-lg bg-[var(--cdbaby-purple)]/5 px-4 py-4' : ''}`}
                      >
                        {/* Milestone Icon */}
                        <div
                          className={`relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-all duration-500 ${
                            isMilestoneCompleted
                              ? 'bg-[var(--cdbaby-green)] text-white'
                              : isCurrentMilestone
                                ? 'animate-pulse bg-[var(--cdbaby-purple)] text-white'
                                : 'bg-muted text-muted-foreground'
                          } ${isJustCompleted ? 'scale-125 animate-bounce' : ''}`}
                        >
                          {isMilestoneCompleted ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : (
                            <span className="text-xs font-bold">
                              {index + 1}
                            </span>
                          )}

                          {/* Celebration burst when milestone completed */}
                          {isJustCompleted && (
                            <>
                              <Sparkles className="absolute -top-3 -left-3 h-5 w-5 animate-ping text-[var(--cdbaby-purple)]" />
                              <Sparkles
                                className="absolute -top-3 -right-3 h-5 w-5 animate-ping text-[var(--cdbaby-light-blue)]"
                                style={{ animationDelay: '0.3s' }}
                              />
                              <Sparkles
                                className="absolute -bottom-3 -left-3 h-5 w-5 animate-ping text-[var(--cdbaby-green)]"
                                style={{ animationDelay: '0.15s' }}
                              />
                              <Sparkles
                                className="absolute -right-3 -bottom-3 h-5 w-5 animate-ping text-[var(--cdbaby-orange)]"
                                style={{ animationDelay: '0.45s' }}
                              />
                            </>
                          )}
                        </div>

                        {/* Milestone Content */}
                        <div className="flex-1 pb-8">
                          <div className="mb-1 flex items-center gap-2">
                            <h4
                              className={`font-semibold ${isMilestoneCompleted ? 'line-through' : ''}`}
                            >
                              {milestone.title}
                            </h4>
                            <span className="text-muted-foreground text-xs">
                              ({milestone.range} streams)
                            </span>
                            {isMilestoneCompleted && (
                              <span className="ml-2 text-xs font-bold text-[var(--cdbaby-green)]">
                                DONE
                              </span>
                            )}
                            {isCurrentMilestone && !isMilestoneCompleted && (
                              <span className="ml-2 animate-pulse text-xs font-bold text-[var(--cdbaby-purple)]">
                                ACTIVE
                              </span>
                            )}
                          </div>
                          <p
                            className={`text-muted-foreground mb-3 text-sm ${isMilestoneCompleted ? 'line-through' : ''}`}
                          >
                            {milestone.description}
                          </p>

                          {/* Show interactive checklist for current milestone */}
                          {isCurrentMilestone && !isMilestoneCompleted && (
                            <div className="mt-4 space-y-2">
                              {milestone.actions.map((action, actionIndex) => {
                                const actionKey = `${milestone.range}-${actionIndex}`;
                                const isChecked = checkedActions.has(actionKey);
                                const isCelebrating =
                                  celebratingAction === actionKey;

                                return (
                                  <button
                                    key={actionIndex}
                                    onClick={() =>
                                      handleCheckAction(
                                        actionKey,
                                        milestone.range,
                                        milestone.actions.length
                                      )
                                    }
                                    className={`relative flex w-full items-start gap-3 rounded-lg p-2 transition-all duration-300 ${
                                      isChecked
                                        ? 'border-2 border-[var(--cdbaby-green)]/30 bg-[var(--cdbaby-green)]/10'
                                        : 'bg-muted/50 hover:bg-muted border-2 border-transparent'
                                    } ${isCelebrating ? 'scale-[1.02] shadow-lg' : ''}`}
                                  >
                                    {/* Celebration sparkles */}
                                    {isCelebrating && (
                                      <>
                                        <Sparkles className="absolute -top-2 -left-2 h-4 w-4 animate-ping text-[var(--cdbaby-purple)]" />
                                        <Sparkles
                                          className="absolute -top-2 -right-2 h-4 w-4 animate-ping text-[var(--cdbaby-light-blue)]"
                                          style={{ animationDelay: '0.2s' }}
                                        />
                                        <Zap
                                          className="absolute -bottom-2 -left-2 h-4 w-4 animate-ping text-[var(--cdbaby-green)]"
                                          style={{ animationDelay: '0.1s' }}
                                        />
                                      </>
                                    )}

                                    {/* Checkbox */}
                                    <div
                                      className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 transition-all duration-300 ${
                                        isChecked
                                          ? 'scale-110 border-[var(--cdbaby-green)] bg-[var(--cdbaby-green)]'
                                          : 'border-[var(--cdbaby-purple)]'
                                      }`}
                                    >
                                      {isChecked && (
                                        <CheckCircle2 className="h-4 w-4 text-white" />
                                      )}
                                    </div>

                                    {/* Action text */}
                                    <span
                                      className={`flex-1 text-left text-sm transition-all duration-300 ${
                                        isChecked
                                          ? 'line-through opacity-70'
                                          : ''
                                      }`}
                                    >
                                      {action}
                                    </span>

                                    {/* DONE label */}
                                    {isChecked && (
                                      <span className="animate-in fade-in zoom-in text-xs font-bold text-[var(--cdbaby-green)] duration-300">
                                        DONE
                                      </span>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          )}

                          {/* Show celebration message when just completed */}
                          {isJustCompleted && (
                            <div className="animate-in fade-in zoom-in mt-4 rounded-lg border-2 border-[var(--cdbaby-green)]/30 bg-[var(--cdbaby-green)]/10 p-4 duration-500">
                              <div className="flex items-center gap-2 text-[var(--cdbaby-green)]">
                                <CheckCircle2 className="h-5 w-5" />
                                <span className="font-semibold">
                                  🎉 Milestone Complete! Moving to next step...
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Show preview for upcoming milestones */}
                          {!isMilestoneCompleted && !isCurrentMilestone && (
                            <div className="space-y-2 opacity-60">
                              {milestone.actions
                                .slice(0, 2)
                                .map((action, actionIndex) => (
                                  <div
                                    key={actionIndex}
                                    className="text-muted-foreground border-muted border-l-2 pl-4 text-xs"
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
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Article Card - Right Side (1/3 width) */}
        <div className="lg:col-span-1">
          <Card className="flex h-full flex-col border-white bg-white">
            <CardContent className="flex flex-1 flex-col bg-white p-6 pt-6">
              {/* Music Note Icon Background - Inset Block */}
              <div
                className="mb-6 flex w-full flex-shrink-0 items-center justify-center p-12"
                style={{ backgroundColor: '#52bcd6' }}
              >
                <img
                  src={getAssetPath('/assets/note.png')}
                  alt="Music Note"
                  className="h-32 w-32"
                />
              </div>

              {/* Article Content */}
              <div className="flex min-h-0 flex-1 flex-col">
                <h3 className="mb-4 flex-shrink-0 text-xl font-[var(--font-test-national-2-narrow)] font-bold text-black uppercase">
                  How to Get Your First 1000 Streams
                </h3>

                <div className="flex-1 overflow-auto text-sm text-gray-700">
                  <p className="mb-3">
                    <strong>How to get 1,000 streams on Spotify</strong>
                  </p>
                  <p className="mb-3">
                    Reaching your first 1,000 streams on Spotify might feel
                    small compared to viral hits, but it's a significant
                    milestone.
                  </p>
                  <p className="mb-3">
                    First, at 1,000 streams, your track becomes eligible for
                    monetization, meaning you can start earning revenue through
                    royalties Spotify owes you.
                  </p>
                  <p className="mb-3">
                    Second, crossing 1,000 streams puts you ahead of 87% of
                    tracks available on streaming platforms. According to data
                    from Luminate, of the 202 million separate ISRCs (i.e. music
                    uploads) on streaming services in 2024, 175.5 million tracks
                    received 1,000 or fewer plays.
                  </p>
                  <p className="mb-3">
                    Lastly, the road to 1,000 streams is crucial for learning
                    how to market yourself — it's a right of passage for indie
                    musicians. At this stage, you're earning each fan one by one
                    and building foundational skills that will carry your career
                    forward. It's hard work, but you'll cherish the connections
                    and experiences you gain.
                  </p>
                  <p className="mb-3">
                    <strong>Engage your inner-circle (1-10 streams)</strong>
                  </p>
                  <p className="mb-3">
                    The first 10 streams are all about engaging your closest
                    circle. Early traction sends positive signals to Spotify's
                    algorithm and helps build momentum on release day. It's
                    essential for your algorithmic success that your song sees
                    at least a handful of streams on release day...
                  </p>
                </div>

                <button className="mt-4 flex-shrink-0 text-left text-sm font-bold text-black hover:underline">
                  Read more
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Resources & Tools */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Primary Tools */}
        <Card
          className="border-[var(--cdbaby-light-blue)]/30 bg-white"
          style={{ backgroundColor: '#ffffff' }}
        >
          <CardHeader className="bg-white">
            <CardTitle className="flex items-center gap-2 text-lg text-black">
              <Megaphone className="h-5 w-5 text-[var(--cdbaby-light-blue)]" />
              CD Baby Tools
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 bg-white">
            <Button
              variant="outline"
              className="h-auto w-full justify-between border-0 py-4"
              style={{ backgroundColor: '#606bf8' }}
            >
              <div className="text-left">
                <div className="font-semibold text-white">HearNow</div>
                <div className="text-xs text-white/90">
                  Smart links to promote your music everywhere
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-white" />
            </Button>

            <Button
              variant="outline"
              className="h-auto w-full justify-between border-0 py-4"
              style={{ backgroundColor: '#005248' }}
            >
              <div className="text-left">
                <div className="font-semibold text-white">Show.co</div>
                <div className="text-xs text-white/90">
                  Build your website and connect with fans
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-white" />
            </Button>

            <Button
              variant="outline"
              className="h-auto w-full justify-between border-0 py-4"
              style={{ backgroundColor: '#ff386a' }}
            >
              <div className="text-left">
                <div className="font-semibold text-white">
                  DIY Musician Blog
                </div>
                <div className="text-xs text-white/90">
                  Tips, guides, and success stories
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-white" />
            </Button>
          </CardContent>
        </Card>

        {/* Marketing Tools */}
        <Card
          className="border-[var(--cdbaby-purple)]/30 bg-white"
          style={{ backgroundColor: '#ffffff' }}
        >
          <CardHeader className="bg-white">
            <CardTitle className="flex items-center gap-2 text-lg text-black">
              <Share2 className="h-5 w-5 text-[var(--cdbaby-purple)]" />
              Marketing Resources
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 bg-white">
            <Button
              variant="outline"
              className="h-auto w-full justify-between border-0 py-4"
              style={{ backgroundColor: '#6a003a' }}
            >
              <div className="text-left">
                <div className="font-semibold text-white">
                  Playlist Submission Guide
                </div>
                <div className="text-xs text-white/90">
                  Get your music on curated playlists
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-white" />
            </Button>

            <Button
              variant="outline"
              className="h-auto w-full justify-between border-0 py-4"
              style={{ backgroundColor: '#ff8100' }}
            >
              <div className="text-left">
                <div className="font-semibold text-white">
                  Social Media Templates
                </div>
                <div className="text-xs text-white/90">
                  Ready-made content for your posts
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-white" />
            </Button>

            <Button
              variant="outline"
              className="h-auto w-full justify-between border-0 py-4"
              style={{ backgroundColor: '#89ff9a' }}
            >
              <div className="text-left">
                <div className="font-semibold text-black">
                  Promotion Partners
                </div>
                <div className="text-xs text-black/80">
                  Verified services to grow your reach
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-black" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
