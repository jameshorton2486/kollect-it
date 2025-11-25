#!/usr/bin/env bun

import { PrismaClient } from '@prisma/client'

console.log('🎯 DIRECT DATABASE TEST')
console.log('========================')

// Use the DATABASE_URL from environment
const dbUrl = process.env.DATABASE_URL
console.log(`Database URL: ${dbUrl?.substring(0, 50)}...`)

const prisma = new PrismaClient()

try {
  console.log('\n🔌 Testing connection...')
  await prisma.$connect()
  console.log('✅ Connected successfully!')
  
  console.log('\n📊 Testing query...')
  const result = await prisma.$queryRaw`SELECT version() as version`
  console.log('✅ Query successful!')
  console.log(`PostgreSQL Version: ${(result as any)[0].version}`)
  
  console.log('\n📋 Testing tables...')
  const tables = await prisma.$queryRaw`
    SELECT tablename 
    FROM pg_tables 
    WHERE schemaname = 'public'
    ORDER BY tablename
  `
  console.log(`Found ${(tables as any[]).length} tables:`)
  for (const table of (tables as any[])) {
    console.log(`  - ${table.tablename}`)
  }
  
  console.log('\n🎉 ALL TESTS PASSED!')
  
} catch (error) {
  const message = error instanceof Error ? error.message : String(error)

  console.error('\n❌ Database test failed!')
  console.error('Error:', message)
} finally {
  await prisma.$disconnect()
}