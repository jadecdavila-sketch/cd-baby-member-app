'use client';

import { ReleaseStatusButtons } from '@/components/release-status-buttons';

export default function VersionInfoPage() {
  return (
    <div>
      <h1>Version Info</h1>
      <ReleaseStatusButtons navItemId="version-info" />
    </div>
  );
}
