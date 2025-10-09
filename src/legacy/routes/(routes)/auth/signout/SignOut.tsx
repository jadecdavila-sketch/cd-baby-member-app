'use client';
import { signOut } from 'next-auth/react';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

const tentantName = process.env.NEXT_PUBLIC_AZURE_AD_B2C_TENANT_NAME;
const userFlow = process.env.NEXT_PUBLIC_AZURE_AD_B2C_PRIMARY_USER_FLOW;
const redirectURI = process.env.NEXT_PUBLIC_BASE_URL;

const signOutURL = `https://${tentantName}.b2clogin.com/${tentantName}.onmicrosoft.com/${userFlow}/oauth2/v2.0/logout?post_logout_redirect_uri=${redirectURI}`;

const SignOut = () => {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect');

  useEffect(() => {
    // once next-auth is done loading
    if (status !== 'loading') {
      // if next-auth has something for session, signOut() should clear it and re-render this page
      if (session) {
        signOut();
      }
      // once next-auth doesn't have a session stored, redirect to azure b2c to sign out from the server (and redirect back to the app)
      else {
        window.location.href = signOutURL + (redirectPath ? redirectPath : '');
      }
    }
  }, [session, status]);

  return (
    <div>
      <p>Signing you out...</p>
    </div>
  );
};

export default SignOut;
