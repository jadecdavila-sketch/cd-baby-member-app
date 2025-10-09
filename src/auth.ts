import NextAuth from 'next-auth';

// @ts-expect-error - NextAuth v5 beta has incomplete type definitions
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    {
      id: 'fusionauth',
      name: 'FusionAuth',
      type: 'oidc',
      issuer: process.env.FUSIONAUTH_ISSUER!,
      clientId: process.env.FUSIONAUTH_CLIENT_ID!,
      clientSecret: process.env.FUSIONAUTH_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'openid email profile',
        },
      },
      profile(profile: any) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    },
  ],
  pages: {
    error: '/auth/error',
  },
  callbacks: {
    // @ts-expect-error - NextAuth v5 beta callback types are incomplete
    async jwt({ token, account }) {
      // Preserve the FusionAuth access token in the JWT
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    // @ts-expect-error - NextAuth v5 beta callback types are incomplete
    async session({ session, token }) {
      // Make the access token available in the session for API calls
      if (token.accessToken) {
        (session as any).accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 2 * 60 * 60, // 2 hours
    updateAge: 30 * 60, // Refresh every 30 minutes
  },
  cookies: {
    sessionToken: {
      name: `__Secure-cdbaby.session-token`,
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 2 * 60 * 60,
      },
    },
    callbackUrl: {
      name: `__Secure-cdbaby.callback-url`,
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 15 * 60,
      },
    },
    csrfToken: {
      name: `__Secure-cdbaby.csrf-token`,
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60,
      },
    },
    pkceCodeVerifier: {
      name: `__Secure-cdbaby.pkce.code_verifier`,
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 15 * 60,
      },
    },
    state: {
      name: `__Secure-cdbaby.state`,
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 15 * 60,
      },
    },
    nonce: {
      name: `__Secure-cdbaby.nonce`,
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 15 * 60,
      },
    },
  },
  trustHost: true,
  useSecureCookies: process.env.NODE_ENV === 'production',
  debug: process.env.NODE_ENV === 'development',
});
