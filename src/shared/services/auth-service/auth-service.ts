import { Session } from 'next-auth';
import { signIn as nextAuthSignIn } from 'next-auth/react';
import { signOut as nextAuthSignOut } from 'next-auth/react';

export function signIn(callbackUrl?: string) {
  return nextAuthSignIn('fusionauth', {
    callbackUrl: callbackUrl ?? '/',
    redirect: true,
  });
}

export async function signOut(callbackUrl?: string) {
  // Sign out from NextAuth (clears HTTP-only cookies)
  await nextAuthSignOut({
    redirect: false,
    callbackUrl: callbackUrl ?? '/',
  });
  // Redirect to FusionAuth logout to clear server session
  const fusionAuthClientId = process.env.NEXT_PUBLIC_FUSIONAUTH_CLIENT_ID;
  const fusionAuthLogoutUrl = `${process.env.NEXT_PUBLIC_FUSIONAUTH_LOGOUT_URL}?client_id=${fusionAuthClientId}`;
  const redirectUrl = callbackUrl
    ? `&post_logout_redirect_uri=${encodeURIComponent(callbackUrl)}`
    : '';

  window.location.href = fusionAuthLogoutUrl + redirectUrl;
}

// get the session expiration time from the jwt (NOT next-auth session.expires which is irrelevant)
export function getSessionExpTime(session: Session | null): Date | null {
  const token = session?.accessToken;
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }
    const payloadEncoded = parts[1];
    const payload = JSON.parse(atob(payloadEncoded ?? ''));
    return new Date(payload.exp * 1000);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

export function getSessionStatus(
  session: Session | null,
  status: 'loading' | 'unauthenticated' | 'authenticated'
): 'loading' | 'expired' | 'unauthenticated' | 'authenticated' {
  // if the next-auth status 'loading' or 'unauthenticated' just return the status
  if (status !== 'authenticated') return status;
  // otherwise check if the session expired
  const exp = getSessionExpTime(session);
  const now = new Date();
  const hasExpired = exp && now > exp;
  return hasExpired ? 'expired' : 'authenticated';
}
