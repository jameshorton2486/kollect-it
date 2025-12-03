-- =====================================================
-- KOLLECT-IT DATABASE MIGRATIONS
-- Run this SQL in your Supabase SQL Editor
-- =====================================================

-- 1. Add password reset fields to User table
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "resetToken" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "resetTokenExpiry" TIMESTAMP(3);

-- 2. Create NewsletterSubscriber table
CREATE TABLE IF NOT EXISTS "NewsletterSubscriber" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "source" TEXT DEFAULT 'website',
    "confirmedAt" TIMESTAMP(3),
    "unsubscribedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NewsletterSubscriber_pkey" PRIMARY KEY ("id")
);

-- Create unique index on email
CREATE UNIQUE INDEX IF NOT EXISTS "NewsletterSubscriber_email_key" ON "NewsletterSubscriber"("email");

-- 3. Create ContactSubmission table
CREATE TABLE IF NOT EXISTS "ContactSubmission" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "repliedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactSubmission_pkey" PRIMARY KEY ("id")
);

-- Create indexes for ContactSubmission
CREATE INDEX IF NOT EXISTS "ContactSubmission_createdAt_idx" ON "ContactSubmission"("createdAt");
CREATE INDEX IF NOT EXISTS "ContactSubmission_read_idx" ON "ContactSubmission"("read");

-- =====================================================
-- VERIFY TABLES WERE CREATED
-- =====================================================
-- Run these queries to verify:
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'User' AND column_name IN ('resetToken', 'resetTokenExpiry');
-- SELECT * FROM information_schema.tables WHERE table_name = 'NewsletterSubscriber';
-- SELECT * FROM information_schema.tables WHERE table_name = 'ContactSubmission';
