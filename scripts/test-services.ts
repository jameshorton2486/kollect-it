#!/usr/bin/env bun
/**
 * KOLLECT-IT SERVICE CONNECTIVITY TEST
 * Tests actual connections to: Database, Stripe, ImageKit, Email
 * 
 * Usage: bun run test-services.ts
 */

import { PrismaClient } from '@prisma/client'
import Stripe from 'stripe'
import ImageKit from 'imagekit'
import nodemailer from 'nodemailer'
import { config } from 'dotenv'

config({ path: '.env.local' })

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`)
}

function section(title: string) {
  log('\n' + title, colors.cyan + colors.bright)
  log('─'.repeat(title.length), colors.cyan)
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

// ============================================================================
// TEST RESULTS TRACKING
// ============================================================================
const results = {
  database: { passed: false, message: '' },
  stripe: { passed: false, message: '' },
  imagekit: { passed: false, message: '' },
  email: { passed: false, message: '' },
}

// ============================================================================
// TEST 1: DATABASE CONNECTION
// ============================================================================
async function testDatabase() {
  section('🗄️  TEST 1: Database Connection (Supabase)')
  
  try {
    const prisma = new PrismaClient()
    
    // Test connection
    await prisma.$connect()
    log('✅ Connected to database', colors.green)
    
    // Count users
    const userCount = await prisma.user.count()
    log(`   Found ${userCount} user(s) in database`, colors.green)
    
    // List tables (models)
    const tables = [
      'User',
      'Account',
      'Session',
      'Product',
      'Order',
      'OrderItem',
      'Category',
    ]
    
    log('   Database tables:', colors.green)
    for (const table of tables) {
      log(`     • ${table}`, colors.green)
    }
    
    await prisma.$disconnect()
    
    results.database.passed = true
    results.database.message = `Connected successfully (${userCount} users)`
    
  } catch (error: unknown) {
    const message = getErrorMessage(error)

    log('❌ Database connection failed', colors.red)
    log(`   Error: ${message}`, colors.red)
    
    if (message.includes('timeout')) {
      log('   Possible causes:', colors.yellow)
      log('     • Supabase project paused', colors.yellow)
      log('     • Wrong DATABASE_URL', colors.yellow)
      log('     • Network connectivity issues', colors.yellow)
    }
    
    results.database.passed = false
    results.database.message = message
  }
}

// ============================================================================
// TEST 2: STRIPE CONNECTION
// ============================================================================
async function testStripe() {
  section('💳 TEST 2: Stripe Connection')
  
  const stripeKey = process.env.STRIPE_SECRET_KEY
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  
  if (!stripeKey) {
    log('❌ STRIPE_SECRET_KEY not found', colors.red)
    results.stripe.passed = false
    results.stripe.message = 'Missing STRIPE_SECRET_KEY'
    return
  }
  
  try {
    const stripe = new Stripe(stripeKey, {
      apiVersion: '2025-11-17.clover',
    })
    
    // Test API by retrieving account info
    const account = await stripe.accounts.retrieve()
    log('✅ Connected to Stripe', colors.green)
    log(`   Account: ${account.email || account.id}`, colors.green)
    log(`   Type: ${account.type}`, colors.green)
    log(`   Mode: ${stripeKey.startsWith('sk_test') ? 'TEST' : 'LIVE'}`, colors.green)
    
    // Check publishable key
    if (publishableKey) {
      log('✅ Publishable key configured', colors.green)
      log(`   Mode: ${publishableKey.startsWith('pk_test') ? 'TEST' : 'LIVE'}`, colors.green)
    } else {
      log('⚠️  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY not set', colors.yellow)
    }
    
    // Check webhook secret
    if (webhookSecret) {
      log('✅ Webhook secret configured', colors.green)
    } else {
      log('⚠️  STRIPE_WEBHOOK_SECRET not set', colors.yellow)
      log('   Webhooks will not work without this', colors.yellow)
    }
    
    results.stripe.passed = true
    results.stripe.message = `Connected to ${account.email || account.id}`
    
  } catch (error: unknown) {
    const message = getErrorMessage(error)
    log('❌ Stripe connection failed', colors.red)
    log(`   Error: ${message}`, colors.red)
    
    if (typeof error === 'object' && error !== null && 'type' in error && (error as { type?: unknown }).type === 'StripeAuthenticationError') {
      log('   Possible causes:', colors.yellow)
      log('     • Invalid API key', colors.yellow)
      log('     • Expired API key', colors.yellow)
      log('     • Wrong environment (test vs live)', colors.yellow)
    }
    
    results.stripe.passed = false
    results.stripe.message = message
  }
}

// ============================================================================
// TEST 3: IMAGEKIT CONNECTION
// ============================================================================
async function testImageKit() {
  section('🖼️  TEST 3: ImageKit Connection')
  
  const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY
  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT
  
  if (!publicKey || !privateKey || !urlEndpoint) {
    log('❌ ImageKit credentials not fully configured', colors.red)
    const missing = []
    if (!publicKey) missing.push('NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY')
    if (!privateKey) missing.push('IMAGEKIT_PRIVATE_KEY')
    if (!urlEndpoint) missing.push('NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT')
    log(`   Missing: ${missing.join(', ')}`, colors.red)
    
    results.imagekit.passed = false
    results.imagekit.message = `Missing: ${missing.join(', ')}`
    return
  }
  
  try {
    const imagekit = new ImageKit({
      publicKey,
      privateKey,
      urlEndpoint,
    })
    
    // Test by listing files (limit 1)
    const files = await imagekit.listFiles({
      limit: 1,
    })
    
    log('✅ Connected to ImageKit', colors.green)
    log(`   Endpoint: ${urlEndpoint}`, colors.green)
    log(`   Public Key: ${publicKey.substring(0, 20)}...`, colors.green)
    
    // Get storage info if we have files
    if (files && files.length > 0 && 'fileId' in files[0]) {
      const details = await imagekit.getFileDetails(files[0].fileId)
      if (details) {
        log(`   Test file loaded successfully`, colors.green)
      }
    }
    
    results.imagekit.passed = true
    results.imagekit.message = 'Connected successfully'
    
  } catch (error: unknown) {
    const message = getErrorMessage(error)

    log('❌ ImageKit connection failed', colors.red)
    log(`   Error: ${message}`, colors.red)
    
    if (message.includes('401') || message.includes('authentication')) {
      log('   Possible causes:', colors.yellow)
      log('     • Invalid private key', colors.yellow)
      log('     • Wrong public key', colors.yellow)
      log('     • Expired credentials', colors.yellow)
    }
    
    results.imagekit.passed = false
    results.imagekit.message = message
  }
}

// ============================================================================
// TEST 4: EMAIL CONFIGURATION
// ============================================================================
async function testEmail() {
  section('📧 TEST 4: Email Configuration (Zoho Mail SMTP)')

  const host = process.env.EMAIL_HOST || 'smtp.zoho.com'
  const port = Number(process.env.EMAIL_PORT || '587')
  const user = process.env.EMAIL_USER
  const pass = process.env.EMAIL_PASSWORD
  const emailFrom = process.env.EMAIL_FROM

  if (!user || !pass) {
    log('❌ EMAIL_USER or EMAIL_PASSWORD not found', colors.red)
    results.email.passed = false
    results.email.message = 'Missing EMAIL_USER/EMAIL_PASSWORD'
    return
  }

  if (!emailFrom) {
    log('❌ EMAIL_FROM not found', colors.red)
    log('   This is CRITICAL - emails will not send!', colors.red)
    log('   Add to .env.local: EMAIL_FROM="noreply@kollect-it.com"', colors.yellow)
    results.email.passed = false
    results.email.message = 'Missing EMAIL_FROM'
    return
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    })

    await transporter.verify()
    log('✅ SMTP connection verified', colors.green)
    log(`   Host: ${host}`, colors.green)
    log(`   Port: ${port}`, colors.green)
    log(`   Sender: ${emailFrom}`, colors.green)

    results.email.passed = true
    results.email.message = 'SMTP verified'
  } catch (error: unknown) {
    const message = getErrorMessage(error)

    log('❌ Email configuration test failed', colors.red)
    log(`   Error: ${message}`, colors.red)

    results.email.passed = false
    results.email.message = message
  }
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================
async function main() {
  log('\n🔍 KOLLECT-IT SERVICE CONNECTIVITY TEST', colors.cyan + colors.bright)
  log('=========================================', colors.cyan)
  log('Testing connections to external services...', colors.cyan)
  
  await testDatabase()
  await testStripe()
  await testImageKit()
  await testEmail()
  
  // Summary
  section('📊 SUMMARY')
  
  const total = Object.keys(results).length
  const passed = Object.values(results).filter(r => r.passed).length
  const failed = total - passed
  
  log(`\nTests: ${passed}/${total} passed`, colors.bright)
  
  for (const [service, result] of Object.entries(results)) {
    const icon = result.passed ? '✅' : '❌'
    const color = result.passed ? colors.green : colors.red
    const serviceName = service.charAt(0).toUpperCase() + service.slice(1)
    log(`${icon} ${serviceName}: ${result.message}`, color)
  }
  
  if (failed === 0) {
    log('\n🎉 ALL SERVICES ARE WORKING!', colors.green + colors.bright)
    log('Your Kollect-It marketplace is ready to run.', colors.green)
    log('\nNext step: bun run dev', colors.yellow)
  } else {
    log(`\n⚠️  ${failed} service(s) need attention`, colors.yellow + colors.bright)
    log('Fix the issues above before running the app.', colors.yellow)
    log('\nCheck your .env.local file for missing/incorrect values.', colors.yellow)
  }
  
  log('')
}

// Run tests
main().catch((error) => {
  log('\n❌ Unexpected error during testing:', colors.red)
  console.error(error)
  process.exit(1)
})
