'use client';

import { ListMusic, Users, TrendingUp } from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';

import type { Playlist } from '../mock-data';
import { formatNumber } from '../mock-data';

interface TopPlaylistsProps {
  playlists: Playlist[];
}

export function TopPlaylists({ playlists }: TopPlaylistsProps) {
  const getDSPColor = (dsp: string) => {
    switch (dsp) {
      case 'spotify':
        return 'bg-[#1DB954] text-white';
      case 'apple-music':
        return 'bg-gradient-to-r from-pink-500 to-red-500 text-white';
      case 'youtube-music':
        return 'bg-red-600 text-white';
      case 'amazon':
        return 'bg-[#FF9900] text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getDSPName = (dsp: string) => {
    switch (dsp) {
      case 'spotify':
        return 'Spotify';
      case 'apple-music':
        return 'Apple Music';
      case 'youtube-music':
        return 'YouTube Music';
      case 'amazon':
        return 'Amazon Music';
      default:
        return dsp;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <ListMusic className="h-5 w-5" />
          <CardTitle>Top Playlists</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {playlists.map((playlist, index) => (
            <div
              key={playlist.id}
              className="group hover:bg-muted/50 flex items-start gap-4 rounded-lg border p-4 transition-all duration-300 hover:shadow-md"
            >
              {/* Rank */}
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center">
                {index === 0 ? (
                  <TrendingUp className="h-5 w-5 text-[var(--cdbaby-green)]" />
                ) : (
                  <span className="text-muted-foreground text-sm font-bold">
                    #{index + 1}
                  </span>
                )}
              </div>

              {/* Playlist Info */}
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <h4 className="truncate font-semibold">{playlist.name}</h4>
                  <span
                    className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${getDSPColor(playlist.dsp)}`}
                  >
                    {getDSPName(playlist.dsp)}
                  </span>
                </div>
                <p className="text-muted-foreground mb-2 text-sm">
                  Curated by {playlist.curatorName}
                </p>
                <div className="text-muted-foreground flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>
                      {formatNumber(playlist.followerCount)} followers
                    </span>
                  </div>
                </div>
              </div>

              {/* Streams */}
              <div className="flex-shrink-0 text-right">
                <p className="text-2xl font-bold text-[var(--cdbaby-light-blue)]">
                  {formatNumber(playlist.streams)}
                </p>
                <p className="text-muted-foreground text-xs">Streams</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
