#!/usr/bin/env bun

import { PrismaClient } from '@prisma/client'

console.log('🔍 Testing Supabase Pooler Connection')
console.log('====================================')

// Test the pooler connection with correct username format
const poolerUrl = "postgresql://postgres.xqrroyyqrgdytzpcckwk:SwDLU82qca9qhNW4@aws-0-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true"

console.log('\n📋 Connection Details:')
console.log('Host: aws-0-us-east-2.pooler.supabase.com')
console.log('Port: 6543 (Transaction Pooler)')
console.log('User: postgres.xqrroyyqrgdytzpcckwk')
console.log('Password: SwDLU82qca9qhNW4')

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
  
  const result = await prisma.$queryRaw`SELECT 1 as test`
  console.log('✅ Pooler query successful!')
  
  console.log('\n🎉 POOLER WORKS!')
  console.log('You can now use the pooler for production.')
  
} catch (error) {
  console.error('\n❌ Pooler connection failed!')
  console.error('Error:', error.message)
  
  if (error.message.includes('Tenant or user not found')) {
    console.log('\n💡 This suggests:')
    console.log('1. Username format might still be wrong for your project')
    console.log('2. Or pooler access might need to be enabled in Supabase')
    console.log('3. Direct connection is working fine for now')
  }
} finally {
  await prisma.$disconnect()
}