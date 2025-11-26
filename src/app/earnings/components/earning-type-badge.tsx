import { CircleDollarSign, Music, Video } from 'lucide-react';

import { Badge } from '@/shared/components/shadcn/badge';
import { COLORS } from '@/shared/constants/theme';

import type { EarningType } from '../mock-data';
import { getEarningTypeLabel } from '../mock-data';

interface EarningTypeBadgeProps {
  type: EarningType;
  className?: string;
}

export function EarningTypeBadge({ type, className }: EarningTypeBadgeProps) {
  const colors: Record<EarningType, { bg: string; text: string }> = {
    streaming: { bg: COLORS.primary, text: COLORS.textWhite },
    'social-video': { bg: COLORS.secondary, text: COLORS.textWhite },
    other: { bg: COLORS.textGray, text: COLORS.textWhite },
  };

  const icons: Record<EarningType, typeof Music> = {
    streaming: Music,
    'social-video': Video,
    other: CircleDollarSign,
  };

  const Icon = icons[type];

  return (
    <Badge
      className={className}
      style={{
        backgroundColor: colors[type].bg,
        color: colors[type].text,
        border: 'none',
      }}
    >
      <Icon className="mr-1 h-3 w-3" />
      {getEarningTypeLabel(type)}
    </Badge>
  );
}
