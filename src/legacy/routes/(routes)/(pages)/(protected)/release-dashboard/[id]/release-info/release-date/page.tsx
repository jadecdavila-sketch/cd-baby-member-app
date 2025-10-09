'use client';

import { ReleaseStatusButtons } from '@/components/release-status-buttons';

export default function ReleaseDatePage() {
  return (
    <div>
      <h1>Release Date</h1>
      <ReleaseStatusButtons navItemId="release-date" />
    </div>
  );
}
