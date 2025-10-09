'use client';

import { ReleaseStatusButtons } from '@/components/release-status-buttons';

export default function ReleaseNamePage() {
  return (
    <div>
      <h1>Release Name</h1>
      <ReleaseStatusButtons navItemId="release-name" />
    </div>
  );
}
