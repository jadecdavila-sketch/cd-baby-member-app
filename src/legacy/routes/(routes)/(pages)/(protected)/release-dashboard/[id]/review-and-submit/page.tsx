'use client';

import { ReleaseStatusButtons } from '@/components/release-status-buttons';

export default function ReviewPage() {
  return (
    <div>
      <h1>Review and Submit</h1>
      <ReleaseStatusButtons navItemId="review-and-submit" />
    </div>
  );
}
