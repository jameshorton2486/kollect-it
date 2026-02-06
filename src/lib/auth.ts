import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { enhancedLogger as logger } from "./enhanced-logger";

/**
 * Enhanced NextAuth configuration with comprehensive logging
 *
 * This version logs every step of the authentication process to help debug
 * login issues. All logs use the structured logger with appropriate levels.
 *
 * Logs to check when login fails:
 * 1. Terminal running `bun run dev` (local)
 * 2. `logs/` directory (local files)
 * 3. Vercel dashboard → Logs (production)
 * 4. Run `bun run error-summary` for AI-ready summary
 */

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Log the attempt (redacted for security)
        logger.info("Login attempt started", {
          emailProvided: !!credentials?.email,
          passwordProvided: !!credentials?.password,
        });

        // Check for missing credentials
        if (!credentials?.email || !credentials?.password) {
          logger.warn("Login failed: missing credentials", {
            hasEmail: !!credentials?.email,
            hasPassword: !!credentials?.password,
          });
          throw new Error("Invalid credentials");
        }

        // Normalize email for lookup (avoids case mismatch: Info@ vs info@)
        const normalizedEmail = credentials.email.toLowerCase().trim();

        // Look up user in database
        let user;
        try {
          user = await prisma.user.findUnique({
            where: { email: normalizedEmail },
          });
        } catch (err) {
          logger.error(
            "Login failed: database error during user lookup",
            {
              attemptedEmail: credentials.email,
            },
            err
          );
          throw new Error("Invalid credentials");
        }

        // Check if user exists
        if (!user) {
          logger.warn("Login failed: user not found", {
            attemptedEmail: credentials.email,
          });
          throw new Error("Invalid credentials");
        }

        // Check if user has a password hash
        if (!user.password) {
          logger.error("Login failed: user has no password hash", {
            userId: user.id,
            email: user.email,
            userRole: user.role,
            helpText: "User account exists but password is null. Run 'bun run scripts/create-admin.ts' to fix.",
          });
          throw new Error("Invalid credentials");
        }

        // Verify password
        let isPasswordValid = false;
        try {
          isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
        } catch (err) {
          logger.error(
            "Login failed: password comparison error",
            {
              userId: user.id,
              email: user.email,
              errorType: "bcrypt_compare_failed",
            },
            err
          );
          throw new Error("Invalid credentials");
        }

        // Check password match
        if (!isPasswordValid) {
          logger.warn("Login failed: incorrect password", {
            userId: user.id,
            email: user.email,
            userRole: user.role,
          });
          throw new Error("Invalid credentials");
        }

        // Success!
        logger.info("Login succeeded", {
          userId: user.id,
          email: user.email,
          role: user.role,
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;

        if (process.env.NODE_ENV === "development") {
          logger.debug("JWT token created", {
            userId: user.id,
            role: user.role,
          });
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;

        if (process.env.NODE_ENV === "development") {
          logger.debug("Session created", {
            userId: token.id as string,
            role: token.role as string,
          });
        }
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

  // Hook into NextAuth's own logger
  logger: {
    error(code, metadata) {
      logger.error("NextAuth error", {
        code,
        ...metadata,
        helpText: "This is a NextAuth internal error. Check NEXTAUTH_SECRET and NEXTAUTH_URL env vars.",
      });
    },
    warn(code) {
      logger.warn("NextAuth warning", { code });
    },
    debug(code, metadata) {
      if (process.env.NODE_ENV === "development") {
        logger.debug("NextAuth debug", { code, ...(metadata && typeof metadata === 'object' ? metadata : {}) });
      }
    },
  },

  // Enable debug in development for extra detail
  debug: process.env.NODE_ENV === "development",
};
