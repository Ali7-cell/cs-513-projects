import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { Role } from "@/types/user";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "UAF Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const input = credentials.email.trim();
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: input.toLowerCase() },
              { regNumber: input.toUpperCase() },
            ],
          },
        });
        if (!user) return null;
        const valid = await verifyPassword(
          credentials.password,
          user.passwordHash
        );
        if (!valid) return null;
        return {
          id: user.id,
          name: user.fullName,
          email: user.email,
          role: user.role as Role,
          sectionCode: user.sectionCode,
          regNumber: user.regNumber,
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.sectionCode = (user as any).sectionCode;
        token.regNumber = (user as any).regNumber;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as Role;
        (session.user as any).sectionCode = token.sectionCode as string | null;
        (session.user as any).regNumber = token.regNumber as string | null;
      }
      return session;
    },
  },
};
