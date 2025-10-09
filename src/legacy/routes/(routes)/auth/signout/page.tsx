import { Suspense } from 'react';
import SignOut from './SignOut';

// Next.js 13+/App Router: using useSearchParams makes the page dynamic.
// Explicitly mark as dynamic to skip static pre-rendering.
export const dynamic = 'force-dynamic';

export default function SignOutPage() {
  return (
    <Suspense fallback={<p>Preparing sign out...</p>}>
      <SignOut />
    </Suspense>
  );
}
