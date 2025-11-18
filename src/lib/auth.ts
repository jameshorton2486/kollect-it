import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { logger } from "./logger";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          logger.info("Authorization attempt started", { email: credentials?.email });

          if (!credentials?.email || !credentials?.password) {
            logger.authAttempt(credentials?.email || "unknown", false, "Missing credentials");
            throw new Error("Invalid credentials");
          }

          logger.info("Looking up user in database", { email: credentials.email });
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user) {
            logger.authAttempt(credentials.email, false, "User not found");
            throw new Error("Invalid credentials");
          }

          logger.info("User found, checking password", { userId: user.id });

          if (!user.password) {
            logger.authAttempt(credentials.email, false, "No password set");
            throw new Error("Invalid credentials");
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password,
          );

          if (!isPasswordValid) {
            logger.authAttempt(credentials.email, false, "Invalid password");
            throw new Error("Invalid credentials");
          }

          logger.authAttempt(credentials.email, true, "Login successful");
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          logger.authError("Authorization failed", credentials?.email || "unknown", error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

