'use client';

import { Share2, Megaphone, BookOpen, ArrowRight } from 'lucide-react';

import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/shadcn/button';

export function ActionCards() {
  const actions = [
    {
      id: 1,
      icon: Share2,
      title: 'Share with HearNow',
      description:
        'Create a personalized music link to share your latest release across all platforms.',
      color: 'var(--cdbaby-light-blue)',
      bgColor: 'bg-[var(--cdbaby-light-blue)]/10',
      action: () => console.log('Navigate to HearNow'),
    },
    {
      id: 2,
      icon: Megaphone,
      title: 'Run Show.co Campaign',
      description:
        "Launch targeted ads to promote your music where it's gaining the most traction.",
      color: 'var(--cdbaby-pink)',
      bgColor: 'bg-[var(--cdbaby-pink)]/10',
      action: () => console.log('Navigate to Show.co'),
    },
    {
      id: 3,
      icon: BookOpen,
      title: 'Learn & Grow',
      description:
        'Access guides on how to maximize your streams, engagement, and tour planning.',
      color: 'var(--cdbaby-green)',
      bgColor: 'bg-[var(--cdbaby-green)]/10',
      action: () => console.log('Navigate to resources'),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="mb-2 flex items-center gap-2">
        <h2 className="text-2xl font-[var(--font-test-national-2-narrow)] font-bold uppercase">
          TAKE ACTION
        </h2>
      </div>

      {/* Action Cards Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Card
              key={action.id}
              className="group relative cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              onClick={action.action}
            >
              <CardContent className="p-6">
                {/* Icon */}
                <div
                  className={`mb-4 inline-flex rounded-lg p-3 ${action.bgColor}`}
                >
                  <Icon className="h-6 w-6" style={{ color: action.color }} />
                </div>

                {/* Title */}
                <h3 className="mb-2 text-lg font-bold">{action.title}</h3>

                {/* Description */}
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                  {action.description}
                </p>

                {/* Arrow */}
                <div className="flex items-center gap-2 text-sm font-semibold transition-all duration-300 group-hover:gap-3">
                  <span style={{ color: action.color }}>Get Started</span>
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    style={{ color: action.color }}
                  />
                </div>

                {/* Animated background on hover */}
                <div
                  className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-5 ${action.bgColor}`}
                />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
