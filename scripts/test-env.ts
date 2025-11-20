#!/usr/bin/env bun

console.log('🔍 Environment Variables Test')
console.log('==============================')

console.log('\n📋 Database Configuration:')
console.log(`DATABASE_URL: ${process.env.DATABASE_URL}`)
console.log(`DIRECT_URL: ${process.env.DIRECT_URL}`)

console.log('\n📋 Supabase Configuration:')
console.log(`NEXT_PUBLIC_SUPABASE_URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`)
console.log(`NEXT_PUBLIC_SUPABASE_ANON_KEY: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20)}...`)
console.log(`SUPABASE_SERVICE_ROLE_KEY: ${process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 20)}...`)

console.log('\n📋 Other Variables:')
console.log(`RESEND_API_KEY: ${process.env.RESEND_API_KEY}`)

// Check if DATABASE_URL has the correct host
const dbUrl = process.env.DATABASE_URL
if (dbUrl) {
  if (dbUrl.includes('aws-0-us-east-2.pooler.supabase.com')) {
    console.log('\n✅ DATABASE_URL using us-east-2 pooler host (correct!)')
  } else if (dbUrl.includes('aws-0-us-east-1.pooler.supabase.com')) {
    console.log('\n✅ DATABASE_URL using us-east-1 pooler host')
  } else if (dbUrl.includes('db.xqrroyyqrgdytzpcckwk.supabase.co')) {
    console.log('\n⚠️ DATABASE_URL using direct host (should be pooler)')
  } else {
    console.log('\n❌ DATABASE_URL using unknown host')
  }
}