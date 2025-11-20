#!/usr/bin/env bun
/**
 * Comprehensive Database Diagnosis Script
 * Identifies network, authentication, and configuration issues
 */

console.log('🔍 COMPREHENSIVE DATABASE DIAGNOSIS')
console.log('=====================================\n')

// 1. Environment Variable Check
console.log('📋 STEP 1: Environment Variables')
console.log('-------------------------------')

const dbUrl = process.env.DATABASE_URL
const directUrl = process.env.DIRECT_URL
const resendKey = process.env.RESEND_API_KEY

console.log(`DATABASE_URL: ${dbUrl ? '✓ Set' : '❌ Missing'}`)
console.log(`DIRECT_URL: ${directUrl ? '✓ Set' : '❌ Missing'}`)
console.log(`RESEND_API_KEY: ${resendKey ? '✓ Set' : '❌ Missing'}`)

if (!dbUrl) {
  console.log('\n❌ CRITICAL: DATABASE_URL is not set!')
  console.log('Please add it to .env.local')
  process.exit(1)
}

// 2. Connection String Analysis
console.log('\n🔗 STEP 2: Connection String Analysis')
console.log('------------------------------------')

const urlPattern = /^postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)(\?.+)?$/
const urlParts = dbUrl.match(urlPattern)

if (urlParts) {
  const [, user, password, host, port, database, params] = urlParts
  
  console.log(`Protocol: ${dbUrl.startsWith('postgresql://') ? '✓ postgresql://' : '⚠️  postgres:// (should be postgresql://)'}`)
  console.log(`User: ${user}`)
  console.log(`Host: ${host}`)
  console.log(`Port: ${port} ${port === '6543' ? '(✓ Pooler)' : port === '5432' ? '(⚠️  Direct)' : '(❌ Invalid)'}`)
  console.log(`Database: ${database}`)
  console.log(`Params: ${params || 'None'}`)
  
  // Check required parameters
  const hasPooler = params?.includes('pgbouncer=true')
  console.log(`pgbouncer=true: ${hasPooler ? '✓ Present' : '❌ Missing'}`)
  
} else {
  console.log('❌ Invalid DATABASE_URL format!')
  console.log('Expected: postgresql://user:pass@host:port/db?params')
  process.exit(1)
}

// 3. Network Connectivity Test
console.log('\n🌐 STEP 3: Network Connectivity')
console.log('------------------------------')

const { execSync } = require('child_process')

try {
  // Extract host from URL
  const host = urlParts[3]
  
  console.log(`Testing connection to ${host}:6543...`)
  
  // Try to resolve DNS first
  try {
    const dnsResult = execSync(`nslookup ${host}`, { encoding: 'utf-8', timeout: 5000 })
    console.log('✓ DNS resolution successful')
  } catch (dnsError) {
    console.log('❌ DNS resolution failed')
    console.log('This might indicate network issues or the server is down')
  }
  
  // Test if we can reach the host at all
  try {
    const pingResult = execSync(`ping -n 1 -w 1000 ${host}`, { encoding: 'utf-8', timeout: 5000 })
    console.log('✓ Host is reachable')
  } catch (pingError) {
    console.log('⚠️  Host ping failed (this might be normal - many servers block ping)')
  }
  
} catch (error) {
  console.log('⚠️  Network test failed:', error.message)
}

// 4. Supabase Project Status Check
console.log('\n📡 STEP 4: Supabase Project Status')
console.log('----------------------------------')

const projectRef = urlParts[3].split('.')[1] // Extract project reference
console.log(`Project Reference: ${projectRef}`)
console.log(`Supabase URL: https://supabase.com/dashboard/project/${projectRef}`)

console.log('\n💡 Manual Checks Required:')
console.log('1. Visit the Supabase dashboard URL above')
console.log('2. Check if the project shows as "Active" (not "Paused")')
console.log('3. Go to Settings → Database to verify connection details')
console.log('4. If paused, click "Resume" to reactivate')

// 5. Alternative Connection Test
console.log('\n🔌 STEP 5: Database Connection Test')
console.log('----------------------------------')

console.log('Testing Prisma connection...')

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['error'],
  datasources: {
    db: {
      url: dbUrl
    }
  }
})

try {
  await prisma.$connect()
  console.log('✅ Prisma connection successful!')
  
  // Test basic query
  const result = await prisma.$queryRaw`SELECT NOW() as current_time`
  console.log('✅ Database query successful!')
  console.log('Current database time:', result[0].current_time)
  
} catch (error) {
  console.log('❌ Database connection failed!')
  console.log('Error:', error.message)
  
  // Provide specific guidance based on error
  if (error.message.includes('SASL authentication failed')) {
    console.log('\n🔧 AUTHENTICATION ISSUE DETECTED')
    console.log('Possible causes:')
    console.log('- Incorrect password in DATABASE_URL')
    console.log('- Database user permissions changed')
    console.log('- Supabase project credentials rotated')
    console.log('\nSolution: Get fresh connection string from Supabase Dashboard')
  } else if (error.message.includes('Can\'t reach database server')) {
    console.log('\n🔧 CONNECTIVITY ISSUE DETECTED')
    console.log('Possible causes:')
    console.log('- Supabase project is paused')
    console.log('- Network connectivity issues')
    console.log('- Supabase maintenance')
    console.log('\nSolution: Check Supabase dashboard and ensure project is active')
  } else if (error.message.includes('timeout')) {
    console.log('\n🔧 TIMEOUT ISSUE DETECTED')
    console.log('Possible causes:')
    console.log('- Slow network connection')
    console.log('- Server overload')
    console.log('\nSolution: Try again in a few minutes')
  }
  
} finally {
  await prisma.$disconnect()
}

console.log('\n📋 DIAGNOSIS COMPLETE')
console.log('====================')
console.log('Review the results above to identify the root cause.')
console.log('Most common issue: Supabase project is paused - check dashboard!')