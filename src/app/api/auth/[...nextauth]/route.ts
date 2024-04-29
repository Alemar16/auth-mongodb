import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/libs/mongodb";
import User from "@/models/users";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Email" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "******",
        },
      },
      async authorize(credentials, req) {
        await connectDB();
        console.log(credentials);

        const userFound = await User.findOne({
          email: credentials?.email,
        }).select("+password");
        if (!userFound) throw new Error("Invalid credentials");

        const passwordMatch = await bcrypt.compare(
          credentials!.password,
          userFound.password
        );

        if (!passwordMatch) throw new Error("Invalid credentials");

        console.log(userFound);

        return userFound;
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
