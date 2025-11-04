'use client';

import { useState, useEffect } from 'react';
import {
  Sparkles,
  TrendingUp,
  Target,
  Music2,
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

interface IntermediateStateProps {
  // Data from analytics
  currentStreams: number;
  // Children components to render
  renderKPICards: () => React.ReactNode;
  renderFilterControls: () => React.ReactNode;
  renderMetricsChart: () => React.ReactNode;
  renderTopTracks: () => React.ReactNode;
}

// Helper function for asset paths
const getAssetPath = (path: string) => {
  const basePath =
    process.env.NODE_ENV === 'production' ? '/cd-baby-member-app' : '';
  return `${basePath}${path}`;
};

export function IntermediateState({
  currentStreams,
  renderKPICards,
  renderFilterControls,
  renderMetricsChart,
  renderTopTracks,
}: IntermediateStateProps) {
  const goalStreams = 1000;
  const progressPercentage = (currentStreams / goalStreams) * 100;
  const streamsToGo = goalStreams - currentStreams;

  // All milestones in the journey
  const getAllMilestones = () => [
    {
      range: '0-10',
      minStreams: 0,
      title: 'Engage Your Inner Circle',
      description: 'Start with the people who already support you',
      actions: [
        'Personally text friends and family about your release',
        'Ask close connections to stream and share',
        'Reach out to collaborators to help promote',
      ],
    },
    {
      range: '10-100',
      minStreams: 10,
      title: 'Activate Social Media',
      description: 'Expand your reach through your networks',
      actions: [
        'Announce your release across all platforms',
        'Share behind-the-scenes content',
        'Create playlists featuring your track',
        'Engage with every comment and share',
      ],
    },
    {
      range: '100-500',
      minStreams: 100,
      title: 'Experiment & Network',
      description: 'Try new approaches and connect with communities',
      actions: [
        'Play local shows and promote your music',
        'Pitch to local press and playlists',
        'Engage with niche online communities',
        'Share content that drives engagement',
      ],
    },
    {
      range: '500-750',
      minStreams: 500,
      title: 'Strategic Content Creation',
      description: 'Build momentum with consistent content',
      actions: [
        'Post 3-5 times weekly across platforms',
        'Share milestone updates with your fans',
        'Promote upcoming shows and events',
        'Preview future projects to build anticipation',
      ],
    },
    {
      range: '750-1,000',
      minStreams: 750,
      title: 'Build Your Community',
      description: 'Turn listeners into engaged fans',
      actions: [
        'Encourage fan-created playlists',
        'Run engagement giveaways',
        'Collect email contacts for your mailing list',
        'Partner with local brands and venues',
      ],
    },
  ];

  // Determine current milestone based on streams
  const getCurrentMilestone = () => {
    const milestones = getAllMilestones();
    // Find the milestone where currentStreams falls within its range
    for (let i = milestones.length - 1; i >= 0; i--) {
      const milestone = milestones[i];
      if (milestone && currentStreams >= milestone.minStreams) {
        return milestone;
      }
    }
    const firstMilestone = milestones[0];
    return (
      firstMilestone || {
        range: '100-500',
        minStreams: 100,
        title: 'Experiment & Network',
        description: 'Try new approaches and connect with communities',
        actions: [],
      }
    );
  };

  // Track which milestone range we're actively showing
  const [activeMilestoneRange, setActiveMilestoneRange] = useState<
    string | null
  >(null);
  const [checkedActions, setCheckedActions] = useState<Set<string>>(new Set());
  const [celebratingAction, setCelebratingAction] = useState<string | null>(
    null
  );
  const [justCompletedMilestone, setJustCompletedMilestone] = useState<
    string | null
  >(null);

  // Determine the actual current milestone based on stream count
  const streamBasedMilestone = getCurrentMilestone();

  // Use the active milestone if set, otherwise use the stream-based one
  const currentMilestone =
    getAllMilestones().find((m) => m.range === activeMilestoneRange) ||
    streamBasedMilestone;

  // Initialize active milestone on mount
  useEffect(() => {
    if (!activeMilestoneRange) {
      setActiveMilestoneRange(streamBasedMilestone.range);
    }
  }, [activeMilestoneRange, streamBasedMilestone.range]);

  const handleCheckAction = (actionKey: string, milestoneRange: string) => {
    const newChecked = new Set(checkedActions);

    if (newChecked.has(actionKey)) {
      newChecked.delete(actionKey);
    } else {
      newChecked.add(actionKey);
      setCelebratingAction(actionKey);
      setTimeout(() => setCelebratingAction(null), 1000);
    }

    setCheckedActions(newChecked);

    // Check if all actions in this milestone are now checked
    const milestone = getAllMilestones().find(
      (m) => m.range === milestoneRange
    );
    if (milestone) {
      const milestoneActionKeys = milestone.actions.map(
        (_, idx) => `${milestoneRange}-${idx}`
      );
      const allChecked = milestoneActionKeys.every((key) =>
        newChecked.has(key)
      );

      if (allChecked) {
        // Milestone completed! Show celebration
        setJustCompletedMilestone(milestoneRange);

        // After celebration, move to next milestone
        setTimeout(() => {
          setJustCompletedMilestone(null);

          // Find next milestone
          const milestones = getAllMilestones();
          const currentIndex = milestones.findIndex(
            (m) => m.range === milestoneRange
          );
          if (currentIndex >= 0 && currentIndex < milestones.length - 1) {
            const nextMilestone = milestones[currentIndex + 1];
            if (nextMilestone) {
              setActiveMilestoneRange(nextMilestone.range);
            }
          }
        }, 2000);
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Celebration Banner - Journey Progress */}
      <Card className="border-0" style={{ backgroundColor: '#61113A' }}>
        <CardContent className="p-8">
          <div className="flex items-start gap-6">
            <img
              src={getAssetPath('/assets/cd.png')}
              alt="CD"
              className="h-12 w-12 flex-shrink-0"
            />
            <div className="flex-1">
              <h2 className="mb-2 text-3xl font-[var(--font-test-national-2-narrow)] font-bold">
                You're Making Progress! 🎉
              </h2>
              <p className="text-muted-foreground mb-6 text-lg">
                You've reached {currentStreams.toLocaleString()} streams! Only{' '}
                {streamsToGo} more to hit 1,000 and join the top 13% of tracks
                on Spotify.
              </p>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm font-medium text-[var(--cdbaby-light-blue)]">
                    {currentStreams.toLocaleString()} /{' '}
                    {goalStreams.toLocaleString()} streams
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

              {/* Encouraging Message */}
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <Sparkles className="h-4 w-4" style={{ color: '#ff386a' }} />
                <span>
                  Your music is resonating! Keep up the momentum with the
                  actions below.
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards - Show real data */}
      {renderKPICards()}

      {/* Filter Controls */}
      {renderFilterControls()}

      {/* Metrics Chart - Show real data */}
      {renderMetricsChart()}

      {/* Two Column Layout: Next Steps + Quick Wins */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Next Steps Card - 2/3 width */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-[var(--cdbaby-purple)]" />
                Your Next Steps to 1,000 Streams
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 rounded-lg bg-[var(--cdbaby-purple)]/10 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <h4 className="font-semibold">{currentMilestone.title}</h4>
                  <span className="text-muted-foreground text-xs">
                    ({currentMilestone.range} streams)
                  </span>
                  <span className="ml-2 animate-pulse text-xs font-bold text-[var(--cdbaby-purple)]">
                    ACTIVE
                  </span>
                </div>
                <p className="text-muted-foreground mb-4 text-sm">
                  {currentMilestone.description}
                </p>

                {/* Interactive Checklist */}
                <div className="space-y-2">
                  {currentMilestone.actions.map((action, actionIndex) => {
                    const actionKey = `${currentMilestone.range}-${actionIndex}`;
                    const isChecked = checkedActions.has(actionKey);
                    const isCelebrating = celebratingAction === actionKey;

                    return (
                      <button
                        key={actionKey}
                        onClick={() =>
                          handleCheckAction(actionKey, currentMilestone.range)
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
                            isChecked ? 'line-through opacity-70' : ''
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

                {/* Milestone Completion Celebration */}
                {justCompletedMilestone === currentMilestone.range && (
                  <div className="animate-in fade-in zoom-in mt-4 rounded-lg border-2 border-[var(--cdbaby-green)]/30 bg-[var(--cdbaby-green)]/10 p-4 duration-500">
                    <div className="flex items-center gap-2 text-[var(--cdbaby-green)]">
                      <CheckCircle2 className="h-5 w-5" />
                      <span className="font-semibold">
                        🎉 Milestone Complete! Moving to next step...
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Complete Journey Roadmap */}
              <div className="mt-6 space-y-4">
                <h5 className="text-muted-foreground text-sm font-semibold">
                  Your Complete Journey to 1,000 Streams
                </h5>
                {getAllMilestones().map((milestone, index) => {
                  const isCompleted = currentStreams >= milestone.minStreams;
                  const isCurrent = milestone.range === currentMilestone.range;

                  return (
                    <div key={index} className="relative flex gap-3">
                      {/* Connector Line */}
                      {index < getAllMilestones().length - 1 && (
                        <div
                          className={`absolute top-8 left-3 h-full w-0.5 transition-colors duration-300 ${
                            isCompleted
                              ? 'bg-[var(--cdbaby-green)]'
                              : 'bg-border'
                          }`}
                        />
                      )}

                      {/* Milestone Icon */}
                      <div
                        className={`relative z-10 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                          isCompleted
                            ? 'bg-[var(--cdbaby-green)] text-white'
                            : isCurrent
                              ? 'animate-pulse bg-[var(--cdbaby-purple)] text-white'
                              : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <span className="text-xs font-bold">{index + 1}</span>
                        )}
                      </div>

                      {/* Milestone Content */}
                      <div className="flex-1 pb-2">
                        <div className="mb-0.5 flex items-center gap-2">
                          <h6
                            className={`text-sm font-semibold ${isCompleted ? 'line-through opacity-60' : ''}`}
                          >
                            {milestone.title}
                          </h6>
                          <span className="text-muted-foreground text-xs">
                            ({milestone.range} streams)
                          </span>
                          {isCompleted && (
                            <span className="text-xs font-bold text-[var(--cdbaby-green)]">
                              ✓
                            </span>
                          )}
                          {isCurrent && !isCompleted && (
                            <span className="animate-pulse text-xs font-bold text-[var(--cdbaby-purple)]">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <p
                          className={`text-muted-foreground text-xs ${isCompleted ? 'line-through opacity-60' : ''}`}
                        >
                          {milestone.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Article/Resource Card - 1/3 width */}
        <div className="lg:col-span-1">
          <Card className="flex h-full flex-col border-white bg-white">
            <CardContent className="flex flex-1 flex-col bg-white p-6 pt-6">
              {/* Icon Block */}
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
                  Growing Your Fanbase
                </h3>

                <div className="flex-1 overflow-auto text-sm text-gray-700">
                  <p className="mb-3">
                    <strong>You're on the right track!</strong>
                  </p>
                  <p className="mb-3">
                    At {currentStreams.toLocaleString()} streams, you've already
                    proven your music resonates with listeners. Now it's time to
                    amplify that success.
                  </p>
                  <p className="mb-3">
                    <strong>Key strategies for your stage:</strong>
                  </p>
                  <ul className="mb-3 list-inside list-disc space-y-1">
                    <li>Focus on converting casual listeners to fans</li>
                    <li>Engage consistently on social platforms</li>
                    <li>Build anticipation for your next release</li>
                    <li>Network with other artists in your genre</li>
                  </ul>
                  <p className="mb-3">
                    Remember, the journey from 100 to 1,000 streams teaches you
                    invaluable marketing skills. Each stream represents a real
                    person connecting with your art.
                  </p>
                  <p className="mb-3">
                    <strong>What happens at 1,000 streams?</strong>
                  </p>
                  <p className="mb-3">
                    Your track becomes eligible for monetization, and you'll
                    join the top 13% of tracks on Spotify. This milestone opens
                    doors to playlist consideration and proves market validation
                    for your sound.
                  </p>
                </div>

                <button className="mt-4 flex-shrink-0 text-left text-sm font-bold text-black hover:underline">
                  Read more success stories
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Top Tracks and Videos - Show Real Data */}
      {/* Top Tracks */}
      {renderTopTracks()}

      {/* Marketing Tools */}
      <Card
        className="border-[var(--cdbaby-purple)]/30 bg-white"
        style={{ backgroundColor: '#ffffff' }}
      >
        <CardHeader className="bg-white">
          <CardTitle className="flex items-center gap-2 text-lg text-black">
            <TrendingUp className="h-5 w-5 text-[var(--cdbaby-purple)]" />
            Recommended Tools to Reach 1,000 Streams
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 bg-white md:grid-cols-3">
          <Button
            variant="outline"
            className="h-auto justify-between border-0 py-4"
            style={{ backgroundColor: '#606bf8' }}
          >
            <div className="text-left">
              <div className="font-semibold text-white">HearNow</div>
              <div className="text-xs text-white/90">
                Smart links to promote everywhere
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-white" />
          </Button>

          <Button
            variant="outline"
            className="h-auto justify-between border-0 py-4"
            style={{ backgroundColor: '#6a003a' }}
          >
            <div className="text-left">
              <div className="font-semibold text-white">Playlist Pitching</div>
              <div className="text-xs text-white/90">
                Get on curated playlists
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-white" />
          </Button>

          <Button
            variant="outline"
            className="h-auto justify-between border-0 py-4"
            style={{ backgroundColor: '#ff8100' }}
          >
            <div className="text-left">
              <div className="font-semibold text-white">Social Media Kit</div>
              <div className="text-xs text-white/90">
                Ready-made content templates
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-white" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
