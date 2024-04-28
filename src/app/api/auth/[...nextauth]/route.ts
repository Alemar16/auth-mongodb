import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const user = {
          id: "1",
          fullname: "J Smith",
          email: "j@j.com",
        };
        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ account, token, user, profile, session }) {
      if (user) token.user = user;
      return token;
    },
    async session({ session, token }) {
      console.log({ session, token });
      session.user = token.user as any;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
