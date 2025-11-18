import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { enhancedLogger } from "./enhanced-logger";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const startTime = Date.now();
        
        try {
          enhancedLogger.info("🔐 Authorization attempt started", { 
            email: credentials?.email,
            hasPassword: !!credentials?.password 
          });

          // Validation
          if (!credentials?.email || !credentials?.password) {
            enhancedLogger.authAttempt(
              credentials?.email || "unknown", 
              false, 
              "Missing email or password"
            );
            throw new Error("Invalid credentials");
          }

          // Database lookup
          enhancedLogger.info("🔍 Looking up user in database", { email: credentials.email });
          const dbStart = Date.now();
          
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          }).catch((err) => {
            enhancedLogger.dbError("findUnique", "User", err);
            throw new Error("Database error");
          });

          const dbDuration = Date.now() - dbStart;
          enhancedLogger.dbQuery("findUnique", "User", !!user, dbDuration);

          if (!user) {
            enhancedLogger.authAttempt(
              credentials.email, 
              false, 
              "User not found in database",
              { dbDurationMs: dbDuration }
            );
            throw new Error("Invalid credentials");
          }

          enhancedLogger.info("✅ User found", { 
            userId: user.id, 
            hasPassword: !!user.password 
          });

          // Password check
          if (!user.password) {
            enhancedLogger.authAttempt(
              credentials.email, 
              false, 
              "User has no password set",
              { userId: user.id }
            );
            throw new Error("Invalid credentials");
          }

          const hashStart = Date.now();
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password,
          );
          const hashDuration = Date.now() - hashStart;

          if (!isPasswordValid) {
            enhancedLogger.authAttempt(
              credentials.email, 
              false, 
              "Password mismatch",
              { 
                userId: user.id,
                hashDurationMs: hashDuration 
              }
            );
            throw new Error("Invalid credentials");
          }

          const totalDuration = Date.now() - startTime;
          enhancedLogger.authAttempt(
            credentials.email, 
            true, 
            "Login successful",
            {
              userId: user.id,
              totalDurationMs: totalDuration,
              role: user.role
            }
          );

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          const totalDuration = Date.now() - startTime;
          enhancedLogger.authError(
            "Authorization failed", 
            credentials?.email || "unknown", 
            error,
            { totalDurationMs: totalDuration }
          );
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

