#!/usr/bin/env bun
/**
 * Database Connection Test Script
 * Tests Supabase PostgreSQL connection with detailed diagnostics
 */

import { config } from "dotenv";
import { PrismaClient } from '@prisma/client'

// Load environment variables
config({ path: ".env.local" });

console.log('🔍 Testing Database Connection...\n')

// Check environment variables
console.log('📋 Environment Variables:')
const dbUrl = process.env.DATABASE_URL
if (!dbUrl) {
  console.log('❌ DATABASE_URL is not set!')
  process.exit(1)
}

console.log(`✓ DATABASE_URL exists (length: ${dbUrl.length})`)

// Analyze connection string
const urlParts = dbUrl.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)(\?.+)?/)
if (urlParts) {
  const [, user, password, host, port, database, params] = urlParts
  console.log(`✓ User: ${user}`)
  console.log(`✓ Host: ${host}`)
  console.log(`✓ Port: ${port} ${port === '6543' ? '(✓ Pooler)' : '(⚠️  Direct - should be 6543)'}`)
  console.log(`✓ Database: ${database}`)
  console.log(`✓ Parameters: ${params || 'None'}`)
  
  if (!params?.includes('pgbouncer=true')) {
    console.log('⚠️  Missing pgbouncer=true parameter')
  }
} else {
  console.log('⚠️  Could not parse DATABASE_URL format')
}

console.log('\n🔌 Testing Connection...')

const prisma = new PrismaClient({
  log: ['error'],
})

try {
  // Test basic connection
  await prisma.$connect()
  console.log('✅ Database connection successful!')

  // Test a simple query
  const result = await prisma.$queryRaw`SELECT 1 as test`
  console.log('✅ Query execution successful!')

  // Test Users table access
  try {
    const userCount = await prisma.user.count()
    console.log(`✅ Users table accessible! (${userCount} users found)`)
  } catch (error) {
    console.log(`⚠️  Users table access failed: ${error.message}`)
  }

  // Test Admin user check
  try {
    const adminUser = await prisma.user.findFirst({
      where: {
        role: 'ADMIN'
      }
    })
    
    if (adminUser) {
      console.log(`✅ Admin user found: ${adminUser.email}`)
    } else {
      console.log('⚠️  No admin user found')
    }
  } catch (error) {
    console.log(`⚠️  Admin user check failed: ${error.message}`)
  }

  console.log('\n🎉 ALL TESTS PASSED!')

} catch (error) {
  console.error('❌ Database connection failed!')
  console.error('Error details:', error.message)
  
  if (error.message.includes('SASL authentication failed')) {
    console.log('\n💡 Suggested fixes:')
    console.log('1. Check if the password in DATABASE_URL is correct')
    console.log('2. Reset database password in Supabase Dashboard')
    console.log('3. Get fresh connection string from Settings → Database → Transaction Pooler')
  }
  
  if (error.message.includes('network') || error.message.includes('timeout')) {
    console.log('\n💡 Suggested fixes:')
    console.log('1. Check internet connection')
    console.log('2. Verify Supabase project is not paused')
    console.log('3. Ensure using port 6543 (Transaction Pooler)')
  }
  
  process.exit(1)
} finally {
  await prisma.$disconnect()
}