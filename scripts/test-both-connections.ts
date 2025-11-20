#!/usr/bin/env bun
/**
 * Quick Database Connection Test - Direct vs Pooler
 */

import { PrismaClient } from '@prisma/client'

console.log('🔍 Testing Both Connection Methods...\n')

const poolerUrl = process.env.DATABASE_URL
const directUrl = process.env.DIRECT_URL

console.log('📋 Connection URLs:')
console.log(`Pooler: ${poolerUrl ? 'Set' : 'Missing'}`)
console.log(`Direct: ${directUrl ? 'Set' : 'Missing'}`)

// Test 1: Pooler Connection
console.log('\n🔌 Test 1: Transaction Pooler (6543)')
console.log('----------------------------------------')

const prismaPooler = new PrismaClient({
  datasources: { db: { url: poolerUrl } },
  log: ['error']
})

try {
  await prismaPooler.$connect()
  const result = await prismaPooler.$queryRaw`SELECT 1 as test`
  console.log('✅ Pooler connection SUCCESS!')
  await prismaPooler.$disconnect()
} catch (error) {
  console.log('❌ Pooler connection FAILED:', error.message)
  await prismaPooler.$disconnect()
}

// Test 2: Direct Connection
console.log('\n🔌 Test 2: Direct Connection (5432)')
console.log('-----------------------------------')

if (directUrl) {
  const prismaDirect = new PrismaClient({
    datasources: { db: { url: directUrl } },
    log: ['error']
  })

  try {
    await prismaDirect.$connect()
    const result = await prismaDirect.$queryRaw`SELECT 1 as test`
    console.log('✅ Direct connection SUCCESS!')
    
    // If direct works, update DATABASE_URL temporarily
    console.log('\n💡 Direct connection works! Consider updating DATABASE_URL')
    
    await prismaDirect.$disconnect()
  } catch (error) {
    console.log('❌ Direct connection FAILED:', error.message)
    await prismaDirect.$disconnect()
  }
} else {
  console.log('⚠️  DIRECT_URL not configured')
}

console.log('\n🎯 Diagnosis Complete!')