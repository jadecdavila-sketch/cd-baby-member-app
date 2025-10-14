'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/shadcn/button';
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
  Zap
} from 'lucide-react';

interface Milestone {
  range: string;
  current: number;
  goal: number;
  title: string;
  description: string;
  actions: string[];
  completed: boolean;
}

export function EmptyState() {
  // Track which actions have been checked
  const [checkedActions, setCheckedActions] = useState<Set<string>>(new Set());
  const [celebratingAction, setCelebratingAction] = useState<string | null>(null);
  const [completedMilestoneRanges, setCompletedMilestoneRanges] = useState<Set<string>>(new Set());
  const [justCompletedMilestone, setJustCompletedMilestone] = useState<string | null>(null);

  const handleCheckAction = (actionKey: string, milestoneRange: string, totalActions: number) => {
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
    const milestoneActionKeys = Array.from({ length: totalActions }, (_, i) => `${milestoneRange}-${i}`);
    const allChecked = milestoneActionKeys.every(key => newChecked.has(key));

    if (allChecked && !completedMilestoneRanges.has(milestoneRange)) {
      // Milestone just completed!
      setJustCompletedMilestone(milestoneRange);

      // After showing celebration, mark as complete and move to next
      setTimeout(() => {
        const newCompletedMilestones = new Set(completedMilestoneRanges);
        newCompletedMilestones.add(milestoneRange);
        setCompletedMilestoneRanges(newCompletedMilestones);
        setJustCompletedMilestone(null);
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
      return milestones.find(m => m.range === justCompletedMilestone) || milestones[0];
    }
    // Otherwise, find the first milestone that hasn't been manually completed by the user
    return milestones.find(m => !completedMilestoneRanges.has(m.range)) || milestones[milestones.length - 1];
  };

  const currentMilestone = getCurrentMilestone();
  const completedMilestones = completedMilestoneRanges.size;

  return (
    <div className="space-y-8">
      {/* Hero Section - Journey to 1k */}
      <Card className="border-2 border-[var(--cdbaby-light-blue)]/20 bg-gradient-to-br from-[#0a0a0a] to-[#1a1a2e]">
        <CardContent className="p-8">
          <div className="flex items-start gap-6">
            <div className="rounded-lg bg-[var(--cdbaby-light-blue)]/10 p-4">
              <Target className="h-12 w-12 text-[var(--cdbaby-light-blue)]" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold font-[var(--font-test-national-2-narrow)] mb-2">
                Your Journey to 1,000 Streams
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Reach 1,000 streams and join the top 13% of tracks on Spotify. This milestone unlocks monetization and proves your music resonates with listeners.
              </p>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm font-medium text-[var(--cdbaby-light-blue)]">
                    {currentStreams} / {goalStreams} streams
                  </span>
                </div>
                <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[var(--cdbaby-light-blue)] to-[var(--cdbaby-purple)] transition-all duration-500"
                    style={{ width: `${Math.max(2, progressPercentage)}%` }}
                  />
                </div>
              </div>

              {/* Milestone Progress */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4 text-[var(--cdbaby-purple)]" />
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

      {/* Current Milestone - Featured */}
      {currentStreams < 1000 && (
        <Card className={`border-2 transition-all duration-500 ${
          justCompletedMilestone ? 'border-[var(--cdbaby-green)]/50 bg-[var(--cdbaby-green)]/5' : 'border-[var(--cdbaby-purple)]/30'
        }`}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className={`rounded-lg p-2 transition-colors duration-500 ${
                justCompletedMilestone ? 'bg-[var(--cdbaby-green)]/10' : 'bg-[var(--cdbaby-purple)]/10'
              }`}>
                {justCompletedMilestone ? (
                  <CheckCircle2 className="h-5 w-5 text-[var(--cdbaby-green)]" />
                ) : (
                  <TrendingUp className="h-5 w-5 text-[var(--cdbaby-purple)]" />
                )}
              </div>
              <div className="flex-1">
                <CardTitle className="text-xl">
                  {justCompletedMilestone ? '🎉 Milestone Complete!' : `Next Up: ${currentMilestone.title}`}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {justCompletedMilestone
                    ? 'Great work! Moving to the next step...'
                    : `${currentMilestone.description} • Target: ${currentMilestone.range} streams`}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {currentMilestone.actions.map((action, index) => {
                const actionKey = `${currentMilestone.range}-${index}`;
                const isChecked = checkedActions.has(actionKey);
                const isCelebrating = celebratingAction === actionKey;

                return (
                  <button
                    key={index}
                    onClick={() => handleCheckAction(actionKey, currentMilestone.range, currentMilestone.actions.length)}
                    className={`relative w-full flex items-start gap-3 p-2 rounded-lg transition-all duration-300 ${
                      isChecked
                        ? 'bg-[var(--cdbaby-green)]/10 border-2 border-[var(--cdbaby-green)]/30'
                        : 'bg-muted/50 hover:bg-muted border-2 border-transparent'
                    } ${isCelebrating ? 'scale-[1.02] shadow-lg' : ''}`}
                  >
                    {/* Celebration sparkles */}
                    {isCelebrating && (
                      <>
                        <Sparkles className="absolute -top-2 -left-2 h-4 w-4 text-[var(--cdbaby-purple)] animate-ping" />
                        <Sparkles className="absolute -top-2 -right-2 h-4 w-4 text-[var(--cdbaby-light-blue)] animate-ping" style={{ animationDelay: '0.2s' }} />
                        <Zap className="absolute -bottom-2 -left-2 h-4 w-4 text-[var(--cdbaby-green)] animate-ping" style={{ animationDelay: '0.1s' }} />
                      </>
                    )}

                    {/* Checkbox */}
                    <div className={`mt-0.5 h-5 w-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      isChecked
                        ? 'bg-[var(--cdbaby-green)] border-[var(--cdbaby-green)] scale-110'
                        : 'border-[var(--cdbaby-purple)]'
                    }`}>
                      {isChecked && (
                        <CheckCircle2 className="h-4 w-4 text-white" />
                      )}
                    </div>

                    {/* Action text */}
                    <span className={`flex-1 text-sm text-left transition-all duration-300 ${
                      isChecked ? 'line-through opacity-70' : ''
                    }`}>
                      {action}
                    </span>

                    {/* DONE label */}
                    {isChecked && (
                      <span className="text-xs font-bold text-[var(--cdbaby-green)] animate-in fade-in zoom-in duration-300">
                        DONE
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Milestones - Roadmap */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music2 className="h-5 w-5" />
            Your Complete Roadmap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {milestones.map((milestone, index) => {
              const isMilestoneCompleted = completedMilestoneRanges.has(milestone.range);
              const isCurrentMilestone = currentMilestone.range === milestone.range;
              const isJustCompleted = justCompletedMilestone === milestone.range;

              return (
                <div key={index} className="relative">
                  {/* Connector Line */}
                  {index < milestones.length - 1 && (
                    <div className={`absolute left-4 top-12 w-0.5 h-full transition-colors duration-500 ${
                      isMilestoneCompleted ? 'bg-[var(--cdbaby-green)]' : 'bg-border'
                    }`} />
                  )}

                  <div className={`flex gap-4 transition-all duration-500 ${
                    isMilestoneCompleted ? 'opacity-60' : ''
                  } ${isCurrentMilestone && !isMilestoneCompleted ? 'bg-[var(--cdbaby-purple)]/5 -mx-4 px-4 py-4 rounded-lg' : ''}`}>
                    {/* Milestone Icon */}
                    <div className={`relative z-10 flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                      isMilestoneCompleted
                        ? 'bg-[var(--cdbaby-green)] text-white'
                        : isCurrentMilestone
                          ? 'bg-[var(--cdbaby-purple)] text-white animate-pulse'
                          : 'bg-muted text-muted-foreground'
                    } ${isJustCompleted ? 'scale-125 animate-bounce' : ''}`}>
                      {isMilestoneCompleted ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <span className="text-xs font-bold">{index + 1}</span>
                      )}

                      {/* Celebration burst when milestone completed */}
                      {isJustCompleted && (
                        <>
                          <Sparkles className="absolute -top-3 -left-3 h-5 w-5 text-[var(--cdbaby-purple)] animate-ping" />
                          <Sparkles className="absolute -top-3 -right-3 h-5 w-5 text-[var(--cdbaby-light-blue)] animate-ping" style={{ animationDelay: '0.3s' }} />
                          <Sparkles className="absolute -bottom-3 -left-3 h-5 w-5 text-[var(--cdbaby-green)] animate-ping" style={{ animationDelay: '0.15s' }} />
                          <Sparkles className="absolute -bottom-3 -right-3 h-5 w-5 text-[var(--cdbaby-orange)] animate-ping" style={{ animationDelay: '0.45s' }} />
                        </>
                      )}
                    </div>

                    {/* Milestone Content */}
                    <div className="flex-1 pb-8">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={`font-semibold ${isMilestoneCompleted ? 'line-through' : ''}`}>
                          {milestone.title}
                        </h4>
                        <span className="text-xs text-muted-foreground">({milestone.range} streams)</span>
                        {isMilestoneCompleted && (
                          <span className="text-xs font-bold text-[var(--cdbaby-green)] ml-2">
                            DONE
                          </span>
                        )}
                        {isCurrentMilestone && !isMilestoneCompleted && (
                          <span className="text-xs font-bold text-[var(--cdbaby-purple)] ml-2 animate-pulse">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <p className={`text-sm text-muted-foreground mb-3 ${isMilestoneCompleted ? 'line-through' : ''}`}>
                        {milestone.description}
                      </p>

                      {!isMilestoneCompleted && !isCurrentMilestone && (
                        <div className="space-y-2">
                          {milestone.actions.slice(0, 2).map((action, actionIndex) => (
                            <div key={actionIndex} className="text-xs text-muted-foreground pl-4 border-l-2 border-muted">
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

      {/* Resources & Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Primary Tools */}
        <Card className="border-[var(--cdbaby-light-blue)]/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Megaphone className="h-5 w-5 text-[var(--cdbaby-light-blue)]" />
              CD Baby Tools
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-between h-auto py-4"
              style={{ borderColor: 'var(--cdbaby-light-blue)' }}
            >
              <div className="text-left">
                <div className="font-semibold">HearNow</div>
                <div className="text-xs text-muted-foreground">Smart links to promote your music everywhere</div>
              </div>
              <ArrowRight className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              className="w-full justify-between h-auto py-4"
              style={{ borderColor: 'var(--cdbaby-green)' }}
            >
              <div className="text-left">
                <div className="font-semibold">Show.co</div>
                <div className="text-xs text-muted-foreground">Build your website and connect with fans</div>
              </div>
              <ArrowRight className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              className="w-full justify-between h-auto py-4"
            >
              <div className="text-left">
                <div className="font-semibold">DIY Musician Blog</div>
                <div className="text-xs text-muted-foreground">Tips, guides, and success stories</div>
              </div>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Marketing Tools */}
        <Card className="border-[var(--cdbaby-purple)]/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Share2 className="h-5 w-5 text-[var(--cdbaby-purple)]" />
              Marketing Resources
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-between h-auto py-4"
            >
              <div className="text-left">
                <div className="font-semibold">Playlist Submission Guide</div>
                <div className="text-xs text-muted-foreground">Get your music on curated playlists</div>
              </div>
              <ArrowRight className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              className="w-full justify-between h-auto py-4"
            >
              <div className="text-left">
                <div className="font-semibold">Social Media Templates</div>
                <div className="text-xs text-muted-foreground">Ready-made content for your posts</div>
              </div>
              <ArrowRight className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              className="w-full justify-between h-auto py-4"
            >
              <div className="text-left">
                <div className="font-semibold">Promotion Partners</div>
                <div className="text-xs text-muted-foreground">Verified services to grow your reach</div>
              </div>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Celebration Moments */}
      <Card className="bg-gradient-to-br from-[var(--cdbaby-purple)]/10 to-[var(--cdbaby-light-blue)]/10 border-dashed">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="inline-flex rounded-full bg-[var(--cdbaby-purple)]/20 p-4 mb-4">
              <Gift className="h-8 w-8 text-[var(--cdbaby-purple)]" />
            </div>
            <h3 className="text-xl font-bold mb-2">Celebrate Your Firsts</h3>
            <p className="text-muted-foreground mb-4">
              Every milestone matters. We'll celebrate with you when you hit your first stream, first creation, first playlist add, and more!
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-sm">
              <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-muted/50">
                <Music className="h-4 w-4 text-[var(--cdbaby-light-blue)]" />
                <span>First Stream</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-muted/50">
                <Sparkles className="h-4 w-4 text-[var(--cdbaby-purple)]" />
                <span>First Creation</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-muted/50">
                <Heart className="h-4 w-4 text-[var(--cdbaby-pink)]" />
                <span>First Like</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-muted/50">
                <Users className="h-4 w-4 text-[var(--cdbaby-green)]" />
                <span>First Playlist</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
