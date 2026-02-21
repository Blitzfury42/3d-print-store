import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { query } from '@/lib/db';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: any) {
        const result = await query('SELECT * FROM users WHERE email = $1', [credentials?.email]);
        const user = result.rows[0];
        if (user && credentials?.password === user.password) {
          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
          };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async session({ session, token }: any) {
      session.user.id = token.sub;
      return session;
    },
  },
};

export default NextAuth(authOptions);