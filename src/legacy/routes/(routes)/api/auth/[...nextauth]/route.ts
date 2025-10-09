import NextAuth from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { Session } from 'next-auth';
import FusionAuthProvider from 'next-auth/providers/fusionauth';

declare module 'next-auth' {
  interface Profile {
    sub?: string;
    given_name: string;
    family_name: string;
    emails?: string[];
    email?: string;
    newUser?: boolean;
  }

  interface Session {
    user: {
      id?: string;
      name?: string;
      email?: string;
      image?: string;
      newUser?: boolean;
    };
    accessToken?: string;
  }
}

const handler = NextAuth({
  providers: [
    FusionAuthProvider({
      id: 'fusionauth',
      name: 'FusionAuth',
      clientId: process.env.NEXT_PUBLIC_FUSIONAUTH_CLIENT_ID!,
      clientSecret: process.env.FUSIONAUTH_CLIENT_SECRET!,
      wellKnown: `${process.env.FUSIONAUTH_BASE_URL}/.well-known/openid-configuration`,
      authorization: {
        params: {
          scope: 'openid offline_access email profile',
          prompt: 'login',
        },
      },
      client: {
        token_endpoint_auth_method: 'client_secret_basic',
      },
      profile(profile) {
        return {
          id: profile.sub,
          name:
            profile.name ||
            `${profile.given_name ?? ''} ${profile.family_name ?? ''}`,
          email: profile.email,
          image: profile.picture ?? null,
          newUser: profile.newUser, // Custom claim (optional)
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user, profile }) {
      if (account && user && profile) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          id: profile.sub,
          newUser: profile.newUser, // Include newUser claim
        };
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session) {
        session.accessToken = token.accessToken as string | undefined;
        session.user.id = token.id as string | undefined;
        session.user.newUser = token.newUser as boolean | undefined; // Include newUser claim in session
      }
      return session;
    },
  },
  debug: true,
});

export { handler as GET, handler as POST };
