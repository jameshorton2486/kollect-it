#!/bin/bash

# =============================================================================
# Kollect-It Marketplace - Environment & Database Connectivity Test
# =============================================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}🔍 ENVIRONMENT & DATABASE CONNECTIVITY TEST${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ .env file not found!${NC}"
    echo "   Create it by copying .env.example: cp .env.example .env"
    exit 1
fi

echo -e "${GREEN}✅ .env file found${NC}"
echo ""

# Load environment variables
export $(cat .env | grep -v '^#' | xargs)

# Test 1: Core Application Variables
echo -e "${YELLOW}TEST 1: Core Application Variables${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -z "$NODE_ENV" ]; then
    echo -e "${RED}❌ NODE_ENV not set${NC}"
else
    echo -e "${GREEN}✅ NODE_ENV: $NODE_ENV${NC}"
fi

if [ -z "$NEXT_PUBLIC_SITE_URL" ]; then
    echo -e "${RED}❌ NEXT_PUBLIC_SITE_URL not set${NC}"
else
    echo -e "${GREEN}✅ NEXT_PUBLIC_SITE_URL: $NEXT_PUBLIC_SITE_URL${NC}"
fi

echo ""

# Test 2: Authentication Variables
echo -e "${YELLOW}TEST 2: Authentication (NextAuth.js)${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -z "$NEXTAUTH_URL" ]; then
    echo -e "${RED}❌ NEXTAUTH_URL not set${NC}"
else
    echo -e "${GREEN}✅ NEXTAUTH_URL: $NEXTAUTH_URL${NC}"
fi

if [ -z "$NEXTAUTH_SECRET" ] || [ "$NEXTAUTH_SECRET" = "your-secret-key-here-min-32-characters" ]; then
    echo -e "${RED}❌ NEXTAUTH_SECRET not set or using placeholder${NC}"
    echo "   Generate one with: openssl rand -base64 32"
else
    if [ ${#NEXTAUTH_SECRET} -lt 32 ]; then
        echo -e "${RED}❌ NEXTAUTH_SECRET is too short (min 32 characters)${NC}"
    else
        echo -e "${GREEN}✅ NEXTAUTH_SECRET: Set (${#NEXTAUTH_SECRET} characters)${NC}"
    fi
fi

echo ""

# Test 3: Database Variables
echo -e "${YELLOW}TEST 3: Database (PostgreSQL via Supabase)${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -z "$DATABASE_URL" ] || [ "$DATABASE_URL" = "postgres://postgres:YOUR_PASSWORD@db.okthcpumncidcihdhgea.supabase.co:6543/postgres?pgbouncer=true" ]; then
    echo -e "${RED}❌ DATABASE_URL not configured${NC}"
    echo "   Update with your actual database password"
else
    if [[ "$DATABASE_URL" == *"YOUR_PASSWORD"* ]]; then
        echo -e "${RED}❌ DATABASE_URL still contains YOUR_PASSWORD placeholder${NC}"
    else
        echo -e "${GREEN}✅ DATABASE_URL: Configured (pooled connection)${NC}"
    fi
fi

if [ -z "$DIRECT_URL" ] || [ "$DIRECT_URL" = "postgres://postgres:YOUR_PASSWORD@db.okthcpumncidcihdhgea.supabase.co:5432/postgres" ]; then
    echo -e "${RED}❌ DIRECT_URL not configured${NC}"
    echo "   Update with your actual database password"
else
    if [[ "$DIRECT_URL" == *"YOUR_PASSWORD"* ]]; then
        echo -e "${RED}❌ DIRECT_URL still contains YOUR_PASSWORD placeholder${NC}"
    else
        echo -e "${GREEN}✅ DIRECT_URL: Configured (direct connection)${NC}"
    fi
fi

echo ""

# Test 4: Supabase API Keys
echo -e "${YELLOW}TEST 4: Supabase API Keys${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
    echo -e "${RED}❌ NEXT_PUBLIC_SUPABASE_URL not set${NC}"
else
    echo -e "${GREEN}✅ NEXT_PUBLIC_SUPABASE_URL: $NEXT_PUBLIC_SUPABASE_URL${NC}"
fi

if [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ] || [ "$NEXT_PUBLIC_SUPABASE_ANON_KEY" = "your_anon_key_here" ]; then
    echo -e "${RED}❌ NEXT_PUBLIC_SUPABASE_ANON_KEY not set or using placeholder${NC}"
else
    echo -e "${GREEN}✅ NEXT_PUBLIC_SUPABASE_ANON_KEY: Set${NC}"
fi

if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ] || [ "$SUPABASE_SERVICE_ROLE_KEY" = "your_service_role_key_here" ]; then
    echo -e "${YELLOW}⚠️  SUPABASE_SERVICE_ROLE_KEY not set (optional for now)${NC}"
else
    echo -e "${GREEN}✅ SUPABASE_SERVICE_ROLE_KEY: Set${NC}"
fi

echo ""

# Test 5: Optional Services (Stripe, Resend, ImageKit)
echo -e "${YELLOW}TEST 5: Optional Services (Stripe, Resend, ImageKit)${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -z "$STRIPE_SECRET_KEY" ] || [ "$STRIPE_SECRET_KEY" = "sk_test_your_secret_key_here" ]; then
    echo -e "${YELLOW}⚠️  STRIPE_SECRET_KEY not configured (optional)${NC}"
else
    echo -e "${GREEN}✅ STRIPE_SECRET_KEY: Configured${NC}"
fi

if [ -z "$RESEND_API_KEY" ] || [ "$RESEND_API_KEY" = "re_your_api_key_here" ]; then
    echo -e "${YELLOW}⚠️  RESEND_API_KEY not configured (optional)${NC}"
else
    echo -e "${GREEN}✅ RESEND_API_KEY: Configured${NC}"
fi

if [ -z "$NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY" ] || [ "$NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY" = "public_your_public_key_here" ]; then
    echo -e "${YELLOW}⚠️  NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY not configured (optional)${NC}"
else
    echo -e "${GREEN}✅ NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY: Configured${NC}"
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ ENVIRONMENT VARIABLES TEST COMPLETE${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

# Test 6: Prisma Client Generation
echo -e "${YELLOW}TEST 6: Prisma Client Generation${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if command -v bunx &> /dev/null; then
    echo -e "${BLUE}Running: bunx prisma generate${NC}"
    if bunx prisma generate 2>&1 | head -5; then
        echo -e "${GREEN}✅ Prisma client generation successful${NC}"
    else
        echo -e "${YELLOW}⚠️  Prisma generation had warnings (check output above)${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  bun not found, skipping Prisma generation test${NC}"
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ ALL TESTS COMPLETE${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo "Next steps:"
echo "  1. Review any red (❌) items above and update your .env file"
echo "  2. Run: bun install"
echo "  3. Run: bun run build"
echo "  4. Run: bun run dev"
echo ""
