-- ============================================================================
-- Fix for PostgreSQL Error: relation "public._prisma_migrations" does not exist
-- ============================================================================
-- This script safely revokes permissions on public._prisma_migrations table
-- only if the table exists, avoiding errors on non-existent tables.
--
-- Purpose: Resolves "ERROR: 42P01: relation "public._prisma_migrations" does not exist"
-- when attempting to revoke privileges on the Prisma migrations table.
-- ============================================================================

DO $$
DECLARE
  table_exists boolean;
BEGIN
  -- Check if the public._prisma_migrations table exists
  SELECT EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = '_prisma_migrations'
  ) INTO table_exists;

  -- Only execute REVOKE if the table exists
  IF table_exists THEN
    REVOKE ALL ON public._prisma_migrations FROM anon, authenticated;
    RAISE NOTICE 'Successfully revoked permissions on public._prisma_migrations from anon and authenticated roles.';
  ELSE
    RAISE NOTICE 'Table public._prisma_migrations does not exist. Skipping REVOKE statement.';
  END IF;
END $$;

-- ============================================================================
-- Verification: Confirm the operation completed
-- ============================================================================
-- You can verify the current permissions on the table (if it exists) with:
-- SELECT grantee, privilege_type 
-- FROM information_schema.role_table_grants 
-- WHERE table_schema='public' AND table_name='_prisma_migrations';
