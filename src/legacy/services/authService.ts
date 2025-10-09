import { redirect } from 'next/navigation';
import { signIn as nextAuthSignIn } from 'next-auth/react';
import { Session } from 'next-auth';
import { signOut as nextAuthSignOut } from 'next-auth/react';

export function signIn() {
  nextAuthSignIn('fusionauth', undefined, { prompt: 'login' });
}

export async function signOut(redirectTo?: string) {
  await nextAuthSignOut({ redirect: false });

  const fusionAuthClientId = process.env.NEXT_PUBLIC_FUSIONAUTH_CLIENT_ID;
  const fusionAuthLogoutUrl = `${process.env.NEXT_PUBLIC_FUSIONAUTH_LOGOUT_URL}?client_id=${fusionAuthClientId}`;

  window.location.href = fusionAuthLogoutUrl;
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
    const payload = JSON.parse(atob(payloadEncoded));
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
