#!/usr/bin/env bun

import { config } from 'dotenv'
import { PrismaClient } from '@prisma/client'

config({ path: '.env.local' })

console.log('🔍 Testing Supabase Pooler Connection')
console.log('====================================')

// Test the pooler connection using environment configuration
const poolerUrl = process.env.DATABASE_URL

if (!poolerUrl) {
  console.error('\n❌ DATABASE_URL is not set. Add it to .env.local before running this script.')
  process.exit(1)
}

let parsedPoolerUrl: URL

try {
  parsedPoolerUrl = new URL(poolerUrl)
} catch (error) {
  const message = error instanceof Error ? error.message : String(error)
  console.error('\n❌ DATABASE_URL is not a valid URL:', message)
  process.exit(1)
}

console.log('\n📋 Connection Details:')
console.log(`Host: ${parsedPoolerUrl.hostname}`)
console.log(`Port: ${parsedPoolerUrl.port || '6543 (default)'}`)
console.log(`User: ${parsedPoolerUrl.username || 'Not specified'}`)
console.log('Password: [hidden]')

const prisma = new PrismaClient({
  datasources: {
    db: { url: poolerUrl }
  },
  log: ['error']
})

console.log('\n🔌 Testing pooler connection...')

try {
  await prisma.$connect()
  console.log('✅ Pooler connection successful!')
  
  const _result = await prisma.$queryRaw`SELECT 1 as test`
  console.log('✅ Pooler query successful!')
  
  console.log('\n🎉 POOLER WORKS!')
  console.log('You can now use the pooler for production.')
  
} catch (error) {
  const message = error instanceof Error ? error.message : String(error)

  console.error('\n❌ Pooler connection failed!')
  console.error('Error:', message)
  
  if (message.includes('Tenant or user not found')) {
    console.log('\n💡 This suggests:')
    console.log('1. Username format might still be wrong for your project')
    console.log('2. Or pooler access might need to be enabled in Supabase')
    console.log('3. Direct connection is working fine for now')
  }
} finally {
  await prisma.$disconnect()
}