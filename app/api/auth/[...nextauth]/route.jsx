import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Replace this with your own logic to validate credentials
        const adminUser = {
          id: '1',
          username: 'admin',
          password: 'admin123', // In production, use environment variables and hashed passwords
        };

        if (
          credentials.username === adminUser.username &&
          credentials.password === adminUser.password
        ) {
          return adminUser;
        } else {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin', // Custom sign-in page
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.username = token.username;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Add a secret key to your .env.local file
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };